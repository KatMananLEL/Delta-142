const settingsSchema = require('../database/models/settingsSchema.js')
const {setup, blacklist} = require('../database/quick-db.js')
const registerguild = require('../modules/registerguild.js')
module.exports = (client, newguild) => {
    if (blacklist.get(`${newguild.id}_GUILD`) == true) return newguild.leave();
    const newguildsettings = settingsSchema.findOne({
        guild_ID:newguild.id
    });
    if (!newguildsettings) {
        const toregisterguild = newguild
        registerguild(client, toregisterguild)
        return
    }
}