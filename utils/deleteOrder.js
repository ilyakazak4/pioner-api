const fs = require('fs')

function getDataFromSave(account) {
  const accountFilePath = `./orders/${account}.txt`
  return { data: fs.readFileSync(accountFilePath, 'utf-8'), accountFilePath }
}

function deleteOrder(account) {
  const { accountFilePath } = getDataFromSave(account)
  fs.unlink(accountFilePath, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

module.exports = { deleteOrder, getDataFromSave }
