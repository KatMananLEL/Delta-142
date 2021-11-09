const settingsSchema = require(`../database/models/settingsSchema.js`)
const {blacklist, setup, owner} = require(`../database/quick-db.js`)
const emojis = require(`../aesthetics/emoji.json`)
const registerguild = require('../modules/registerguild.js')
const Discord = require('discord.js');
module.exports = async (client, message) => {
    if (!message.guild || message.author.bot || message.channel.isThread()) return // Message in DM's were not ignored kek
    if (blacklist.get(`${message.guild.id}_GUILD`) == true) return // Blacklisting Guilds be like
    if (blacklist.get(`${message.author.id}_MEMBER`) == true) return // Blacklisting Users be like

    const guildsettings = await settingsSchema.findOne({ guild_ID: message.guild.id })
    if (!guildsettings) {
        registerguild(client, message.guild)
        return
    }

    const prefix = guildsettings.prefix
    if (!message.content.startsWith(prefix)) return; // Not gonna waste time of my bot
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandname = args.shift().toLowerCase();
    const cooldowns = new Map();
    const command = client.commands.get(commandname) || client.commands.find(file => file.aka && file.aka.includes(commandname))
    const errorchannel = client.channels.cache.get(setup.get('ERROR_LOGS'))
    const notfoundembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTitle(`Command Not Found`)
        .setDescription(`\`${commandname}\` Command was not found, please use \`${prefix}help\` to get list of commands.`)
        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()

    if (!command) return message.reply({ embeds: [notfoundembed] })

    //If cooldowns map doesn't have a command.name key then create one.
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;
    if (time_stamps.has(message.author.id)) { //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            const cooldownembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`Rate Limit for ${command.name}`)
                .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setDescription(`Please wait \`${time_left.toFixed(1)}\` more seconds`)
                .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
                .setTimestamp()
            return message.reply({ embeds: [cooldownembed] })
        }
    }

    time_stamps.set(message.author.id, current_time);//If the author's id is not in time_stamps then add them with the current time.
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);//Delete the user's id once the cooldown is over.

    if (command.owner) {
        if (!owner.get(`OWNER_${message.author.id}`) == true) return
    }
    if (command.admin) {
        if (!message.member.permissions.has('MANAGE_GUILD')) return
    }
    try {
        command.run(client, message, args, errorchannel)
    } catch (err) {
        const errorembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`${emojis.failed} Unkown Error Found`)
            .setDescription(`There was an Unkown Error while executing ${command.name}`)
            .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()
        message.reply({ embeds: errorembed });
        errorchannel.send(`Error:\n` + `\`${err}\``)
    }
}