const { MessageEmbed } = require("discord.js")
const emojis = require('../aesthetics/emoji.json')
module.exports = {
    name: 'ping',
    description: 'Shows the latency of the bot',
    format:'d.ping',
    aka:['p'],
    cooldown:2,
    owner:false
}
module.exports.run = async (client, message, args, errorchannel) => {
    const e = new MessageEmbed()
        .setColor('#9B9B9B')
        .setTitle('Pinging...........')
        .setTimestamp()
    const a = await message.channel.send({embeds:[e]})
    const araara = a.createdTimestamp - message.createdTimestamp
    const editedembed = new MessageEmbed()
        .setColor(`#41B631`)
        .setTitle(`${emojis.loading} Pong!`)
        .setDescription(`Bot Latency :\`${araara}\` ms. \n`+
        `Client's Websocket Latency: \`${client.ws.ping}\` ms.`)
        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamics: true })}`)
        .setTimestamp()
    a.edit({embeds:[editedembed]})
}