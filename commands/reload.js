const { MessageEmbed } = require("discord.js")

const emojisxd = require(`../aesthetics/emoji.json`)

module.exports = {
    name:'reload',
    descriptions:'Reloads a command',
    owner:true,
}

module.exports.run = async(client, message, args) => {

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

    const toreload = args[0]

    if (!toreload) return message.reply({embeds:[failembed.setDescription(`No Commands provided to reload`)]})

    try {

        delete require.cache[require.resolve(`../commands/${toreload}`)]

        client.commands.delete(toreload);

        const toreloadfile = require(`../commands/${toreload}`)

        client.commands.set(toreload, toreloadfile);

        message.reply({embeds:[successembed.setDescription(`\`${toreload}\` was reloaded successfully.`)]}).catch(e => {
                
            client.channels.cache.get('893073190035816458').send(`${e}`) 
        
            message.channel.send(`Error sent to: <#893073190035816458>`)
        
        })

        return message.react(emojisxd.success);

    } catch(error) {

        return message.reply({embeds:[failembed.setDescription(`Error found! \n`+`\`\`\`javascript\n${error}\`\`\``)]})

    }

}