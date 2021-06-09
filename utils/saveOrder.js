const fs = require('fs')

function saveOrder(account, order) {
  fs.appendFileSync(`./order/${account}.txt`, order)
}

module.exports = saveOrder
