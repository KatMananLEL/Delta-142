const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    guild_ID:{type:String, unique:true},
    assign_role_onjoin:{type:Boolean},
    prefix:{type:String},
    log_channel:{type:String},
    mute_role:{type:String},
    quarantine_role:{type:String},
    anti_raid_enable:{type:Boolean},
    anti_nuke_enable:{type:Boolean},
    log_enabled:{type:Boolean},
    msg_log:{type:Boolean},
    kick_ban_log:{type:Boolean},
    welcoming_role:{type:String}
})

const settingsModel = mongoose.model('settingsSchema', settingsSchema);

module.exports = settingsModel;