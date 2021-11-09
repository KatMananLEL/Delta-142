const { MessageEmbed, MessageActionRow } = require('discord.js');
const { closebutton, rightpagebutton, leftpagebutton, verifybutton, cancelbutton } = require('../aesthetics/buttons.js')
const emoji = require(`../aesthetics/emoji.json`)
const settingsSchema = require('../database/models/settingsSchema.js')
const guildsetup = require(`../modules/guildsetup.js`)
module.exports = {
    name:'setup',
    description: "Setup Command which is used to prepare bot for the server",
    admin: true,
    cooldown: 20,
    aka:['set','settings','setting'],
    format:`{prefix}setup [Sub-Category to set] (Options for Sub-Category)`,
    owner:false
}
module.exports.run = async (client, message, args) => {
    const randomNumber = message.id
    const guildsettings = await settingsSchema.findOne({guild_ID:message.guild.id})
    if (!guildsettings) {
        return guildsetup(client, message.guild)
    }
    const prefix = guildsettings.prefix
    let qrole;
    let mrole;
    let logchannel;
    const logsenabled = guildsettings.log_enabled
    const msglogs = guildsettings.msg_log
    const bankick = guildsettings.kick_ban_log
    const log_channel = message.guild.channels.cache.get(guildsettings.log_channel)
    const muterole = guildsettings.mute_role
    const quarantinerole = guildsettings.quarantine_role
    let verifylogs;
    let verify_msglog;
    let verify_banandkicklog;
    let anti_nuke;
    let anti_raid;
    const antinuke = guildsettings.anti_nuke_enabled
    const antiraid = guildsettings.anti_raid_enabled

    if (message.guild.roles.cache.get(quarantinerole)) qrole = `<@&${quarantinerole}>`
    else qrole = `\`Not Provided / Undefined\``
    if (message.guild.roles.cache.get(muterole)) mrole = `<@&${muterole}>`
    else mrole = `\`Not Provided / Undefined\``
    if (!client.channels.cache.get(log_channel)) logchannel = 'No Log Channels'
    else logchannel = `<#${log_channel}>`
    if (logsenabled == true) verifylogs = 'True'
    else verifylogs = 'False'
    if (msglogs == true) verify_msglog = 'True'
    else verify_msglog = 'False'
    if (bankick == true) verify_banandkicklog = 'True'
    else verify_banandkicklog = 'False'
    if (antiraid == true) anti_raid = 'True'
    else anti_raid = 'False'
    if (antinuke == true) anti_nuke = 'True'
    else anti_nuke = 'False'

    const errorembed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emoji.failed} Command Failed`)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()
    const successembed = new MessageEmbed()
        .setColor('#41B631')
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
    const verifyembed = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle(`${emoji.warn} Please Verify your changes`)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
    const page1 = new MessageEmbed()
        .setColor('#008BFF')
        .setTitle(`\`${message.guild.name}\`'s Setup: Status ${emoji.verify}`)
        .setDescription(`**Guild ID:** \`${message.guild.id}\`\n` +
            `**Guild Owner:** <@${message.guild.ownerId}>\n` +
            `**Prefix:** \`${prefix}\`\n` +
            `**Logs Enabled:** \`${verifylogs}\`\n`+
            `**Anti-Nuke Enabled:** \`${anti_nuke}\`\n`+
            `**Anti-Raid Enabled:** \`${anti_raid}\``)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
    const page2 = new MessageEmbed()
        .setColor('#008BFF')
        .setTitle(`\`${message.guild.name}\`'s Setup: Values ${emoji.verify}`)
        .setDescription(`**Muted Role:** ${mrole} \n`+
        `**Quarantine Role:** ${qrole}`)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
    const page3 = new MessageEmbed()
        .setColor('#008BDD')
        .setTitle(`\`${message.guild.name}\`'s Setup: Logging Values ${emoji.verify}`)
        .setDescription(`**Log Channel:** ${logchannel}\n`+
        `**Logging Module:** \`${verifylogs}\`\n`+
        `**Message Delete Logging:** \`${verify_msglog}\`\n`+
        `**Ban & Kick Logging:** \`${verify_banandkicklog}\``)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setFooter(`${client.user.username}`,`${client.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()

    const startpagebuttons = new MessageActionRow()
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
    .addComponents(rightpagebutton.setCustomId(`right_page_${message.author.id}_${randomNumber}`))
    const endpagebutton = new MessageActionRow()
    .addComponents(leftpagebutton.setCustomId(`left_page_${message.author.id}_${randomNumber}`))
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
    const middlepagebuttons = new MessageActionRow()
    .addComponents(leftpagebutton.setCustomId(`left_page_${message.author.id}_${randomNumber}`))
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
    .addComponents(rightpagebutton.setCustomId(`right_page_${message.author.id}_${randomNumber}`))
    const toverifybuttons = new MessageActionRow()
    .addComponents(verifybutton.setCustomId(`verify_${message.author.id}_${randomNumber}`))
    .addComponents(cancelbutton.setCustomId(`cancel_${message.author.id}_${randomNumber}`))
    
    if (!args[0]) {
        message.reply({ embeds: [page1], components: [startpagebuttons]}) // Replying with Page 1
        let pages = `1_${message.author.id}_${message.id}`
        client.on('interactionCreate', async (interact) => {
            if (!interact.member.id === message.author.id) return
            if (interact.customId == `right_page_${interact.member.id}_${randomNumber}`) {
                if (pages == `1_${message.author.id}_${message.id}`) {
                    interact.update({embeds:[page2], components:[middlepagebuttons]})
                    pages = `2_${message.author.id}_${message.id}`
                } else if (pages == `2_${message.author.id}_${message.id}`) {
                    interact.update({embeds:[page3], components:[endpagebutton]})
                    pages = `3_${message.author.id}_${message.id}`
                }
            } else if (interact.customId == `left_page_${interact.member.id}_${randomNumber}`) {
                if (pages == `2_${message.author.id}_${message.id}`) {
                    interact.update({embeds:[page1], components:[startpagebuttons]})
                    pages = `1_${message.author.id}_${message.id}`
                } else if (pages == `3_${message.author.id}_${message.id}`) {
                    interact.update({embeds:[page2], components:[middlepagebuttons]})
                    pages = `2_${message.author.id}_${message.id}`
                }
            } else if (interact.customId == `close_${interact.member.id}_${randomNumber}`) {
                interact.update({components:[]})
            }
            setTimeout(() => {return pages = undefined}, 60000)

        })
    } else {
        const toset = args[0].toLowerCase();

        async function roleset(client, valuetoset, valuetoshow_in_embed, value){
            client.on('interactionCreate',async (interact) => {
                if (interact.customId == `verify_${interact.member.id}_${randomNumber}`) {
                    await settingsSchema.findOneAndUpdate({guild_ID:message.guild.id},{valuetoset:value.id})
                    await interact.update({embeds:[successembed.setDescription(`${valuetoshow_in_embed} for \`${message.guild.name}\` has been set to ${value}`)], components:[]})
                } else if (interact.customId == `cancel_${interact.member.id}_${randomNumber}`) {
                    await interact.update({embeds:[errorembed.setDescription(`Settings: \`${valuetoshow_in_embed}\`\nError: \`Cancelled by the Author\``)], components:[]})
                    return
                }
            })
        }

        if (toset == 'mute' || toset == 'muterole') {
            const muterole = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first()
            if (!muterole || muterole == undefined) return message.reply({embeds:[errorembed.setDescription(`Settings: \`Mute Role\`\nError: \`Provided Mute role is invalid\``)], components:[]})
            message.reply({embeds:[verifyembed.setDescription(`Are you sure that you want to set \`Mute Role\` to <@&${muterole.id}> ?`)],components:[toverifybuttons]})
            roleset(client,'mute_role','Mute Role',muterole); 
        }
    } 
}