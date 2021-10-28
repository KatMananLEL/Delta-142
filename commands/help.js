// Work In Progress
const { MessageEmbed, MessageActionRow} = require('discord.js');
const emojisxd = require(`../aesthetics/emoji.json`)
const {closebutton} = require(`../aesthetics/buttons.js`)
module.exports = {
    name:'help',
    description:`Sends Help embed with formats of command`,
    cooldown:3,
    format:`{prefix}help (Optional Command here)`
}
module.exports.run = async(client, message, args) => {
    const randomNumber = message.id
    const closeactionrow = new MessageActionRow()
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))

    if(!args[0]) {
        const helpembed = new MessageEmbed()
            .setColor('#0774CF')
            .setTitle(`Help Menu ${emojisxd.verify}`)
            .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
            .setDescription(`You can use d.help {Command_Name} to get Info about specific command.`)
            .addField(`Misc Commands`,`\`help\`,\`ping\``,true)
            .addField(`Manager Commands (Required )`,`\`prefix\`,\`setup\``,true)
            .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        message.reply({embeds:[helpembed],components:[closeactionrow]})
    } else {
        const tohelp = args[0].toLowerCase();
        const tohelpfile = client.commands.get(tohelp) || client.commands.find(file => file.aka && file.aka.includes(tohelp))
        if (tohelpfile.owner) return

        const helpembed = new MessageEmbed()
            .setColor('#0774CF')
            .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
            .setTitle(`Help Command ${emojisxd.verify}`)
            .setDescription(`**Command Name:** \`${tohelpfile.name}\`\n`+
            `**Command Description:** \`${tohelpfile.description}\`\n`+
            `**Command Format:** \`${tohelpfile.format}\``)
            .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
            .setTimestamp()
            
        if (tohelpfile.admin) helpembed.addField(`Manage Server Permission Required?`,`Yes`)
        else helpembed.addField(`Manage Server Permission Required?`,`No`)
        message.reply({embeds:[helpembed], components:[closeactionrow]})
    }

    client.on('interactionCreate', async (interact) => {
        if (interact.member.id ==! message.author.id) return
        if (interact.customId == `close_${interact.member.id}_${randomNumber}`) {
            await interact.message.delete();
        }
        setTimeout(() => {return}, 60000)
    })
};