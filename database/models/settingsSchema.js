const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    guild_ID:{type:String, unique:true},
    prefix:{type:String},
    log_channel:{type:String},
    mute_role:{type:String},
    quarantine_role:{type:String},
    anti_raid_enable:{type:Boolean},
    anti_nuke_enable:{type:Boolean}
})

const settingsModel = mongoose.model('settingsSchema', settingsSchema);

module.exports = settingsModel;