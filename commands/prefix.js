const { MessageEmbed, MessageActionRow } = require("discord.js")

const { setup } = require(`../database/quick-db.js`)

const emojis = require(`../aesthetics/emoji.json`)

const { verifybutton, cancelbutton } = require(`../aesthetics/buttons.js`)

const settingsSchema = require('../database/models/settingsSchema.js')

module.exports = {
    name:'prefix',
    description:'Changes the prefix for this guild (Warning: Prefix should be less than 3 characters)',
    cooldown:10,
    aka:['p'],
    admin:true,
    format:`{prefix}prefix {New_Prefix}`,
}

module.exports.run = async(client, message, args) => {

    const newprefix = args[0]

    const randomNumber = message.id

    const errorchannel = client.channels.cache.get(setup.get('ERROR_LOGS'));

    const catchembed = new MessageEmbed()
    .setColor('YELLOW')
    .setTitle(`Error found!`)
    .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({dynamic:true})}`)
    .addField(`Guild ID where Error Occured`, `${message.guild.id}`)
    .addField(`Guild Owner ID`,`${message.guild.ownerID}`)
    .setTimestamp()

    const errorembed = new MessageEmbed()
    .setColor('RED')
    .setTitle('Command Failed')
    .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
    .setTimestamp()

    const successembed = new MessageEmbed()
    .setColor('#41B631')
    .setTitle(`Prefix successfully changed`)
    .setDescription(`Prefix for **${message.guild.name}** is updated to \`${newprefix}\``)
    .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic:true})}`)
    .setTimestamp()

    const comfirmembed = new MessageEmbed()
    .setColor(`YELLOW`)
    .setTitle(`${emojis.warn} Please verify your changes.`)
    .setDescription(`Are you sure you want to change your prefix to \`${newprefix}\``)
    .setFooter(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
    .setTimestamp()

    if (!newprefix) {
        message.reply({
            embeds: [ 
                errorembed.setDescription(`New Prefix is \`undefined / not provided\``)
            ]}).catch((error) => errorchannel.send({embeds:[ catchembed.setDescription(error)]}))

        return

    } else if (newprefix.length > 3) {

        message.reply({embeds: [
            errorembed.setDescription(`Length of new prefix is greater than 3 characters.`)
        ]}).catch((errorr) = errorchannel.send({embeds:[ catchembed.setDescription(`${errorr}`)]}))

        return

        
    } else {

        message.reply({embeds:[comfirmembed], components:[new MessageActionRow().addComponents(verifybutton.setCustomId(`verify_${message.author.id}_${randomNumber}`)).addComponents(cancelbutton.setCustomId(`cancel_${message.author.id}_${randomNumber}`))]})

        client.on('interactionCreate', async (interact) => {

            if (interact.member.id ==! message.author.id) return

            if (interact.customId == `verify_${interact.member.id}_${randomNumber}`) {

                await settingsSchema.findOneAndUpdate({guild_ID:message.guild.id}, {prefix:newprefix})

                await interact.update({embeds:[successembed], components:[]})


            } else if (interact.customId == `cancel_${interact.member.id}_${randomNumber}`) {

                await interact.message.delete()

                await interact.channel.send({embeds:[errorembed.setDescription(`Cancelled by the author.`)]})

            }

            setTimeout(() => {return message.channel.send(`Interaction Time-out!`)}, 60000)

        })

        
    }

}