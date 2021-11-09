const db = require('quick.db')
const setup = new db.table('SETUP')
const blacklist = new db.table('BLACKLIST')
const owner = new db.table('OWNERS')

module.exports = {setup, blacklist, owner}