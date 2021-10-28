const {setup} = require('../database/quick-db.js')
const settingsSchema = require('../database/models/settingsSchema.js')
module.exports = async (client, toregisterguild) => {
    try {
        await settingsSchema.create({
            guild_ID: toregisterguild.id,
            prefix: 'd.',
            log_channel: ' ',
            anti_nuke_enabled: false,
            anti_raid_enabled: false,
            mute_role: ' ',
            quarantine_role: ' '
        }).save
        return
    } catch (err) {
        client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error Found while Registering a guild: \n` + `\`${err}\``)
    }
}