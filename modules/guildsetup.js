const { Permissions } = require('discord.js')
const settingsSchema = require(`../database/models/settingsSchema`)
const registerguild = require('./registerguild.js')
const { setup } = require(`../database/quick-db.js`)
module.exports = async (client, guild) => {
    const errorchannel = client.channels.cache.get(setup.get('ERROR_LOGS'))
    const guildsettings = await settingsSchema.findOne({ guild_ID: guild.id })
    if (!guildsettings) registerguild(client, guild)
    try {
        // Mute Role
        const mute_role = guild.roles.cache.find(role => role.name.includes('Muted'))
        if (!mute_role) {
            guild.roles.create({
                name: 'Muted',
                color: '#777A7C',
                reason: 'Reset Command'
            }).then((mute_role) => {
                guild.channels.fetch().then((channels) => {
                    channels.forEach(channel => {
                        channel.permissionOverwrites.set([
                            {
                                id: mute_role.id,
                                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.SPEAK, Permissions.FLAGS.USE_PUBLIC_THREADS, Permissions.FLAGS.REQUEST_TO_SPEAK, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SEND_MESSAGES_IN_THREADS]
                            }
                        ])
                    })
                })
                settingsSchema.findOneAndUpdate({ guild_ID: guild.id }, { mute_role: mute_role.id })
            })
        }
        else settingsSchema.findOneAndUpdate({ guild_ID: guild.id }, { mute_role: mute_role.id })
        
        // Quarantine Role
        const quarantine_role = guild.roles.cache.find(role => role.name.includes('Quarantined'))
        if (!quarantine_role) {
            guild.roles.create({
                name: 'Quarantined',
                color: '#B0510B',
                reason: 'Reset Command'
            }).then((quarantine_role) => {
                guild.channels.fetch().then((channels) => {
                    channels.forEach(channel => {
                        channel.permissionOverwrites.set([
                            {
                                id: quarantine_role,
                                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.SPEAK, Permissions.FLAGS.USE_PUBLIC_THREADS, Permissions.FLAGS.REQUEST_TO_SPEAK, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SEND_MESSAGES_IN_THREADS, Permissions.FLAGS.VIEW_CHANNEL]
                            }
                        ])
                    })
                })
                settingsSchema.findOneAndUpdate({ guild_ID: guild.id }, { quarantine_role: quarantine_role.id })
            })
        }
        else settingsSchema.findOneAndUpdate({ guild_ID: guild.id }, { quarantine_role: quarantine_role.id })

        // Logging Channel
        guild.channels.create('Logs', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                }
            ]
        }).then(channel => {
            settingsSchema.findOneAndUpdate({ guild_ID: guild.id },
                {
                    log_enabled: true,
                    log_channel: channel.id,
                    msg_log: true,
                    kick_ban_log: true
                })
        })
    } catch (err) {
        errorchannel.send(`Error while setting up a guild in guildsetup module:\n\`${err}\``)
    }
}