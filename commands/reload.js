const { MessageEmbed } = require("discord.js")
const emojisxd = require(`../assets/emoji.json`)
module.exports = {
    name:'reload',
    descriptions:'Reloads a command',
    owner:true,
}
module.exports.run = async(client, message, args, errorchannel) => {
    const failembed = new MessageEmbed()
        .setColor('#E41111')
        .setTitle(`Command Failed`)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
    const successembed = new MessageEmbed()
        .setColor('#41B631')
        .setTitle(`Success`)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()

    if (!args[0]) return message.reply({embeds:[failembed.setDescription(`No Commands provided to reload`)]})
    const toreload = args[0].toLowerCase();
    try {
        delete require.cache[require.resolve(`../commands/${toreload}`)]
        client.commands.delete(toreload);
        const toreloadfile = require(`../commands/${toreload}`)
        client.commands.set(toreload, toreloadfile);
        message.reply({embeds:[successembed.setDescription(`\`${toreload}\` was reloaded successfully.`)]}).catch(e => {
            errorchannel.send(`${e}`) 
            message.channel.send(`Error sent to: <#${errorchannel.id}>`)
        })
        return message.react(emojisxd.success);
    } catch(error) {
        return message.reply({embeds:[failembed.setDescription(`Error found! \n`+`\`\`\`javascript\n${error}\`\`\``)]})
    }
}