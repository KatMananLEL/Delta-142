const db = require('quick.db')
const blacklist = new db.table('BLACKLIST')
const owner = new db.table('OWNERS')

module.exports = {blacklist, owner}