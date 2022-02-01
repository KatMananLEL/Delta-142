const { MessageEmbed, MessageActionRow } = require("discord.js");
const {} = require(`../assets/emoji.json`);
const { verifybutton, cancelbutton } = require(`../assets/buttons.js`);
const settingsSchema = require('../database/models/settingsSchema.js')
module.exports = {
    name:'prefix',
    description:`Change Prefix for this bot if you don't like it. New prefix should be less than 3 characters.`,
    cooldown:10,
    aka:[],
    admin:true,
    format:`d.prefix [New Prefix Here]`,
}
// Gonna rewrite this soon