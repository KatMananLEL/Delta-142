const { MessageEmbed, MessageActionRow } = require('discord.js');
const { closebutton, rightpagebutton, leftpagebutton, verifybutton, cancelbutton } = require('../aesthetics/buttons.js')
const emoji = require(`../aesthetics/emoji.json`)
const settingsSchema = require('../database/models/settingsSchema.js')

module.exports = {
    name:'setup',
    description: "Setup Command which is used to prepare bot for the server",
    admin: true,
    cooldown: 20,
    aka:['set'],
    format:`{prefix}setup [Sub-Category to set] (Options for Sub-Category)`
}

module.exports.run = async (client, message, args) => {

    const randomNumber = message.id

    const guildsettings = await settingsSchema.findOne({guild_ID:message.guild.id})

    const prefix = guildsettings.prefix

    let logsenabled;

    let qrole;

    let mrole;

    const logchannel = message.guild.channels.cache.get(guildsettings.log_channel)

    const muterole = guildsettings.mute_role

    let antinuke = guildsettings.anti_nuke_enabled

    let antiraid = guildsettings.anti_raid_enabled

    const quarantinerole = guildsettings.quarantine_role

    if (message.guild.roles.cache.get(quarantinerole)) qrole = `<@&${quarantinerole}>`

    else qrole = `\`Not Provided / Undefined\``

    if (message.guild.roles.cache.get(muterole)) mrole = `<@&${muterole}>`

    else mrole = `\`Not Provided / Undefined\``

    if (antinuke == true) antinuke = `\`True\``

    else antinuke = `\`False\``

    if (antiraid == true) antiraid = `\`True\``

    else antiraid = `\`False\``

    if (!logchannel) logsenabled = 'False'

    else logsenabled = 'True'

    const errorembed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emoji.failed} Command Failed`)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()
    
    const successembed = new MessageEmbed()
        .setColor('#41B631')
        .setFooter(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()

    const verifyembed = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle(`${emoji.warn} Please Verify your changes`)
        .setFooter(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()

    const page1 = new MessageEmbed()
        .setColor('#008BFF')
        .setTitle(`\`${message.guild.name}\`'s Setup: Status ${emoji.verify}`)
        .setDescription(`**Guild ID:** \`${message.guild.id}\`\n` +
            `**Guild Owner:** <@${message.guild.ownerId}>\n` +
            `**Prefix:** \`${prefix}\`\n` +
            `**Logs Enabled:** \`${logsenabled}\`\n`+
            `**Anti-Nuke Enabled:** \`${antinuke}\`\n`+
            `**Anti-Raid Enabled:** \`${antiraid}\``)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()

    const page2 = new MessageEmbed()
        .setColor('#008BFF')
        .setTitle(`\`${message.guild.name}\`'s Setup: Values ${emoji.verify}`)
        .setDescription(`**Muted Role:** ${mrole} \n`+
        `**Quarantine Role:** ${qrole}`)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()

    const startpagebuttons = new MessageActionRow()
    .addComponents(rightpagebutton.setCustomId(`right_page_${message.author.id}_${randomNumber}`))
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))

    const endpagebutton = new MessageActionRow()
    .addComponents(closebutton.setCustomId(`close_${message.author.id}_${randomNumber}`))
    .addComponents(leftpagebutton.setCustomId(`left_page_${message.author.id}_${randomNumber}`))

    const toverifybuttons = new MessageActionRow()
    .addComponents(verifybutton.setCustomId(`verify_${message.author.id}_${randomNumber}`))
    .addComponents(cancelbutton.setCustomId(`cancel_${message.author.id}_${randomNumber}`))
    
    if (!args[0]) {

        message.reply({ embeds: [page1], components: [startpagebuttons] }) // Replying with Page 1

        client.on('interactionCreate', async (interact) => {

            if (!interact.member.id == message.member.id) return

            if (interact.customId == `right_page_${interact.member.id}_${randomNumber}`) {

                await interact.update({ embeds: [page2], components: [endpagebutton] }) // Page 2 Here

            } else if (interact.customId == `left_page_${interact.member.id}_${randomNumber}`) {

                await interact.update({ embeds: [page1], components: [startpagebuttons] }) // Returning to Page 1

            } else if (interact.customId == `close_${interact.member.id}_${randomNumber}`) {

                await interact.message.delete();

            }

            setTimeout(() => {return client.pages.delete(`setup_${message.author.id}`)}, 60000)

        })

    } else {

        const toset = args[0].toLowerCase();

        if (toset == 'mute' || toset == 'mute_role') {

            if (!args[1]) return message.reply({embeds:[errorembed.setDescription(`Settings: \`Mute Role\`\n`+`Error: \`Invalid Mute Role\``)]})

            const tosetmuterole = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.get(message.mentions.roles.first().id)

            message.reply({embeds:[verifyembed.setDescription(`Are you sure that you want to set <@&${tosetmuterole.id}> as your Mute Role?`)], components:[toverifybuttons]})

            client.on('interactionCreate', async (int) => {
                
                if (!int.member.id == message.member.id) return

                if (int.customId == `verify_${int.member.id}_${randomNumber}`) {

                    await settingsSchema.findOneAndUpdate({guild_ID:message.guild.id}, {mute_role:tosetmuterole.id})

                    await int.update({embeds:[successembed.setDescription(`Muted Role was successfully updated`)], components:[]})

                    return

                } else if (int.customId == `cancel_${int.member.id}_${randomNumber}`) {

                    await int.update({embed:[errorembed.setDescription(`Settings: \`Mute Role\`\n`+`Error: \`Cancelled by the author\``)], components:[]})

                    return

                }

                setTimeout(() => {return}, 60000)

            })

        } else if (toset == 'quarantine' || toset == 'quarantine_role') {

            if (!args[1]) return message.reply({embeds:[errorembed.setDescription(`Settings: \`Quarantine Role\`\n`+`Error: \`Invalid Mute Role\``)]})

            const tosetqrole = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.get(message.mentions.roles.first().id)

            message.reply({embeds:[verifyembed.setDescription(`Are you sure that you want to set <@&${tosetqrole.id}> as your Quarantine Role?`)], components:[toverifybuttons]})

            client.on('interactionCreate', async (int) => {
                
                if (!int.member.id == message.member.id) return

                if (int.customId == `verify_${int.member.id}_${randomNumber}`) {

                    await settingsSchema.findOneAndUpdate({guild_ID:message.guild.id}, {quarantine_role:tosetqrole.id})

                    await int.update({embeds:[successembed.setDescription(`Quarantine Role was successfully updated`)], components:[]})

                    return

                } else if (int.customId == `cancel_${int.member.id}_${randomNumber}`) {

                    await int.update({embeds:[errorembed.setDescription(`Settings: \`Quarantine Role\`\n`+`Error: \`Cancelled by the author\``)], components:[]})

                    return

                }

                setTimeout(() => {return}, 60000)

            })

        } else if (toset == 'logs' || toset == 'log' || toset == 'log_channel' || toset == 'logs_channel') {

            if (!args[1]) return message.reply({embeds:[errorembed.setDescription(`Settings: \`Log Channel\`\n`+`Error: \`Invalid Channel\``)], components:[]})

            const to_set_channel = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.get(message.mentions.channels.first().id)

            message.reply({embeds:[verifyembed.setDescription(`Are you sure that you want to set your Logging channel to <#${to_set_channel.id}>`)], components:[toverifybuttons]})

            client.on('interactionCreate', async (int) => {
                
                if (!int.member.id == message.member.id) return

                if (int.customId == `verify_${int.member.id}_${randomNumber}`) {

                    await settingsSchema.findOneAndUpdate({guild_ID:message.guild.id}, {log_channel:to_set_channel.id})

                    await int.update({embeds:[successembed.setDescription(`Logging Channel was successfully updated.`)], components:[]})

                    return

                } else if (int.customId == `cancel_${int.member.id}_${randomNumber}`) {

                    await int.update({embeds:[errorembed.setDescription(`Settings: \`Log Channel\`\n`+`Error: \`Cancelled by the author\``)], components:[]})

                    return

                }

                setTimeout(() => {return}, 60000)

            })

        } else return message.reply({embeds:[errorembed.setDescription(`\`${toset}\` Setting not found`)]})

    }

}