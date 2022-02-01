const settingsSchema = require('../database/models/settingsSchema.js');
const { MessageEmbed } = require('discord.js')
const { errorchannelID } = require('../config.json');
// Whenever this bot is added to some new guild or someone re-register their data into our database because of some errors.
module.exports = async (client, guild) => {
    // Time to configure our error channel so that i can be notified if there's any error with it's detail right of the bat
    const errorchannel = client.channels.cache.get(errorchannelID);
    // And now, try-catch feature's turn.
    try {
        await settingsSchema.create({
            // Guild Configuration here
            guildID: guild.id,
            modules: [{
                all: false, //Disabling module by default and enabling all internal modules so that whenever modules get enabled, all modules gets enabled by default
                antiRaid: true,
                antiNuke: true,
                moderation: true,
                messageLogs: true,
                assignRoles: true,
            }],
            prefix:'d.'
        })
    } catch (err) {
        const errorembed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${guild.name}`,`${guild.iconURL()}`)
            .setTitle(`Error Detected while registering this guild's data. ID: ${guild.id}`)
            .setDescription(`\`\`\`js\n${err}\`\`\``)
            .setTimestamp()
        errorchannel.send({ embeds:errorembed });
    }

}