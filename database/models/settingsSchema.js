const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    // Guild Configuration
    guildID: {type:String, unique:true},
    modules: [{
        all: Boolean, // To Check if owner wants to enable module entirely
        antiNuke: Boolean,
        antiRaid: Boolean,
        messageLogs: Boolean,
        moderation: Boolean,
        assignRoles: Boolean,
    }],
    prefix: String,
    
});
const settingsModel = mongoose.model('settingsSchema', settingsSchema);
module.exports = settingsModel;