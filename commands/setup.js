// Work in Progress
// const { MessageEmbed, MessageActionRow } = require('discord.js');
// const { closebutton, rightpagebutton, leftpagebutton, verifybutton, cancelbutton } = require('../aesthetics/buttons.js')
// const emoji = require(`../aesthetics/emoji.json`)
// const settingsSchema = require('../database/models/settingsSchema.js')
// module.exports = {
//     name:'setup',
//     description: "Setup Command which is used to prepare bot for the server",
//     admin: true,
//     cooldown: 20,
//     aka:['set'],
//     format:`{prefix}setup [Sub-Category to set] (Options for Sub-Category)`
// }
// module.exports.run = async (client, message, args) => {
//     const randomNumber = message.id
//     const guildsettings = await settingsSchema.findOne({guild_ID:message.guild.id})
//     const prefix = guildsettings.prefix
//     let logsenabled;
//     let msglogs;
//     let banlogs;
//     let qrole;
//     let mrole;
//     const logchannel = message.guild.channels.cache.get(guildsettings.log_channel)
//     const muterole = guildsettings.mute_role
//     const quarantinerole = guildsettings.quarantine_role
//     const verifylogs = guildsettings.log_enabled
//     const verify_msglog = guildsettings.msg_log
//     const verify_banandkicklog = guildsettings.kick_ban_log
//     const pages = client.pages.get(`setup_${message.author.id}_${randomNumber}`)

//     if (message.guild.roles.cache.get(quarantinerole)) qrole = `<@&${quarantinerole}>`
//     else qrole = `\`Not Provided / Undefined\``
//     if (message.guild.roles.cache.get(muterole)) mrole = `<@&${muterole}>`
//     else mrole = `\`Not Provided / Undefined\``
//     if (antinuke == true) antinuke = `\`True\``
//     else antinuke = `\`False\``
//     if (antiraid == true) antiraid = `\`True\``
//     else antiraid = `\`False\``
//     if (verifylogs == true) logsenabled = `\`True\``
//     else logsenabled = `\`False\``
//     if (verify_msglog == true)
    
//     const errorembed = new MessageEmbed()
//         .setColor('RED')
//         .setTitle(`${emoji.failed} Command Failed`)
//         .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
//         .setTimestamp()
//     const successembed = new MessageEmbed()
//         .setColor('#41B631')
//         .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
//         .setTimestamp()
//     const verifyembed = new MessageEmbed()
//         .setColor('YELLOW')
//         .setTitle(`${emoji.warn} Please Verify your changes`)
//         .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
//         .setTimestamp()
//     const page1 = new MessageEmbed()
//         .setColor('#008BFF')
//         .setTitle(`\`${message.guild.name}\`'s Setup: Status ${emoji.verify}`)
//         .setDescription(`**Guild ID:** \`${message.guild.id}\`\n` +
//             `**Guild Owner:** <@${message.guild.ownerId}>\n` +
//             `**Prefix:** \`${prefix}\`\n` +
//             `**Logs Enabled:** \`${logsenabled}\`\n`+
//             `**Anti-Nuke Enabled:** \`${antinuke}\`\n`+
//             `**Anti-Raid Enabled:** \`${antiraid}\``)
//         .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
//         .setTimestamp()
//     const page2 = new MessageEmbed()
//         .setColor('#008BFF')
//         .setTitle(`\`${message.guild.name}\`'s Setup: Values ${emoji.verify}`)
//         .setDescription(`**Muted Role:** ${mrole} \n`+
//         `**Quarantine Role:** ${qrole}`)
//         .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
//         .setTimestamp()

//     const startpagebuttons = new MessageActionRow()
//     .addComponents(rightpagebutton.setCustomId(`right_page_${message.author.id}_${randomNumber}`))
//     .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
//     const endpagebutton = new MessageActionRow()
//     .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
//     .addComponents(leftpagebutton.setCustomId(`left_page_${message.author.id}_${randomNumber}`))
//     const toverifybuttons = new MessageActionRow()
//     .addComponents(verifybutton.setCustomId(`verify_${message.author.id}_${randomNumber}`))
//     .addComponents(cancelbutton.setCustomId(`cancel_${message.author.id}_${randomNumber}`))
    
//     if (!args[0]) {
//         message.reply({ embeds: [page1], components: [startpagebuttons]}) // Replying with Page 1
//         await client.pages.set(`setup_${message.author.id}_${randomNumber}`,1)
//         client.on('interactionCreate', async (interact) => {
//             if (!interact.member.id == message.member.id) return
//             if (interact.customId == `right_page_${interact.member.id}_${randomNumber}`) {
//                 if (pages) {}
//             } else if (interact.customId == `left_page_${interact.member.id}_${randomNumber}`) {
//                 if (pages) {}
//             } else if (interact.customId == `close_${interact.member.id}_${randomNumber}`) {
//                 await interact.message.delete();
//                 await client.pages.delete(`setup_${message.author.id}_${randomNumber}`)
//             }
//             setTimeout(() => {return client.pages.delete(`setup_${message.author.id}_${randomNumber}`)}, 60000)

//         })
//     }
// }