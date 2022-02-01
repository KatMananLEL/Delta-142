// Importing Modules
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const emojis = require('../assets/emoji.json');
// Formatting the command
module.exports = {
    name: 'ping',
    description: 'Shows the latency of the bot',
    format:'d.ping',
    aka:['p'],
    cooldown:2,
    register: new SlashCommandBuilder()
    .setName(`ping`)
    .setDescription(`Shows Latency for bot! (Cooldown: 2 Seconds)`), // Slash Command's Registration
}
// Slash Command's Script
module.exports.executeSlash = async (client, interact, errorchannel) => {
    const initialembed = new MessageEmbed()
        .setColor('#9B9B9B')
        .setTitle('Pinging...........')
        .setTimestamp()
    interact.reply({
        embeds:[initialembed], ephemeral:true
    });
    const editedembed = new MessageEmbed()
        .setColor(`#41B631`)
        .setTitle(`${emojis.loading} Pong!`)
        .setDescription(`Client's Websocket Latency: \`${client.ws.ping}\` ms.`)
        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamics: true })}`)
        .setTimestamp()
    setTimeout(() => {
        interact.editReply({
            embeds:[editedembed]
        });
    }, 500);
}
module.exports.run = async (client, message, args, errorchannel) => {
    const initialembed = new MessageEmbed()
        .setColor('#9B9B9B')
        .setTitle('Pinging...........')
        .setTimestamp()
    const initialMessage = await message.reply({
        embeds:[initialembed]
    });
    const editedembed = new MessageEmbed()
        .setColor(`#41B631`)
        .setTitle(`${emojis.loading} Pong!`)
        .setDescription(`Client's Websocket Latency: \`${client.ws.ping}\` ms.`)
        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamics: true })}`)
        .setTimestamp()
    initialMessage.edit({
        embeds:[editedembed]
    });
}