require('dotenv').config()
const express = require('express')
const sendMail = require('./utils/sendMail')
const fs = require('fs')
const cors = require('cors')
const { nanoid } = require('nanoid')
const { deleteOrder, getDataFromSave } = require('./utils/deleteOrder')
const getQiwi = require('./utils/getQiwi')
const { createClient } = require('contentful')
const generateHTMLFromOrder = require('./utils/generateHTMLFromOrder')

const app = express()
app.use(express.json({ extended: false }))
app.use(cors({ origin: '*' }))
app.get('/', (req, res) => {
  res.send('API RUNING!!!')
})

class PayError extends Error {}

function checkPayStatus(status) {
  const statuses = {
    ok: ['PAID'],
    error: ['REJECTED', 'EXPIRED'],
  }
  if (statuses.error.includes(status))
    throw new PayError('Счет отклонен или не оплачен')
  if (statuses.ok.includes(status)) return true
  throw new Error('Неизвестный статус')
}

app.post('/money', async (req, res) => {
  const { bill } = req.body
  const email = 'ilyakazak4@gmail.com'
  const account = bill?.customer?.account
  const order = JSON.parse(getDataFromSave(account).data)
  const htmlOrder = generateHTMLFromOrder(order, account, bill?.billId)
  try {
    checkPayStatus(bill.status.value)
    const subject = 'Оплата'
    await sendMail(email, order.email, 'Код оплаты', `<h1>${bill?.billId}</h1>`)
    const mailResult = await sendMail(email, email, subject, htmlOrder)
    deleteOrder(account)
    return res.json(mailResult)
  } catch (e) {
    if (e instanceof PayError) {
      const subject = 'Ошибка оплаты'
      const html = `<h2>${e.message}</h2>`
      deleteOrder(account)
      await sendMail(order.email, subject, html)
    }
    return res.status(500).send(e.message)
  }
})

app.post('/order', async (req, res) => {
  try {
    const account = nanoid()
    const { email, cart } = req.body
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_KEY,
    })
    const products = await Promise.allSettled(cart.map(e => client.getEntry(e.id)))


    const order = products.map(({value: product}) => ({
      id: product.sys.id,
      title: product.fields.title,
      price: product.fields.price,
      count: cart.find(e => e.id === product.sys.id).count,
    }))
    const totalPrice = order.reduce(
      (prev, cur, acc) => (acc = prev + cur.price * cur.count),
      0
    )

    fs.appendFileSync(
      `./orders/${account}.txt`,
      JSON.stringify({ order, totalPrice, email })
    )

    const qiwi = getQiwi({
      successUrl: 'https://novoservice.netlify.app/success',
      totalPrice,
      clientEmail: email,
      account,
    })

    return res.json({ url: qiwi })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e.message })
  }
})

const port = process.env.PORT || 5000
app.listen(port)
