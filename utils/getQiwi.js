function getQiwi({ successUrl, totalPrice, clientEmail, account }) {
  const publickKey = process.env.QIWI_PUBLIC
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()
  const lifetime = new Date(year, month, day + 7)
    .toISOString()
    .split(':')
    .slice(0, -1)
    .join('')

  const url = `https://oplata.qiwi.com/create?publicKey=${publickKey}&amount=${totalPrice}&successUrl=${successUrl}&email=${clientEmail}&account=${account}&customFields[paySourcesFilter]=qw,card&lifetime=${lifetime}`
  return encodeURI(url)
}

module.exports = getQiwi
