const { setup, blacklist, owner } = require('./database/quick-db.js')

const mongoose = require('mongoose')

const Discord = require('discord.js')

const settingsSchema = require('./database/models/settingsSchema.js');

require('dotenv').config()

const fs = require('fs')

const client = new Discord.Client({ disableMentions: 'all', intents: [Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES] })

client.commands = new Discord.Collection(); // Making Collections for Commmand files

client.pages = new Discord.Collection(); // For Editing Command's Message which has more than 2 Pages

const cooldowns = new Map();

const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // filters out command files in commands folder

for (const file of commandfiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command); // Reading Files

    console.log(`Command => ${command.name} Loaded`) // Making sure that all file shows up in console

};

mongoose.connect(process.env.SRV_URL).then(() => {
    console.log(`Logged-in to Database`)
}).catch((err) => {
    client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error While Logging Into Database \n` + `\`${err}\``)
})

client.on('ready', () => {

    client.user.setActivity(`to d.help`, {

        type: 'LISTENING'

    });

    setup.set(`ERROR_LOGS`, '893073190035816458')

    owner.set('OWNER_321638481803739147', true)

    console.log(`Loaded all files for ${client.user.tag}`);

});

client.on('messageCreate', async message => {

    if (!message.guild) return // Message in DM's were not ignored kek

    if (blacklist.get(`${message.guild.id}_GUILD`) == true) return // Blacklisting Guilds be like

    if (blacklist.get(`${message.author.id}_MEMBER`) == true) return // Blacklisting Users be like

    const guildsettings = await settingsSchema.findOne({ guild_ID: message.guild.id })

    try {

        if (!guildsettings) {

            await settingsSchema.create({
                guild_ID: message.guild.id,
                prefix: 'd.',
                log_channel: ' ',
                anti_nuke_enabled: false,
                anti_raid_enabled: false,
                mute_role: ' ',
                quarantine_role: ' '
            }).save 
            return

        }

    } catch (err) {

        client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error Found while Registering a guild: \n` + `\`${err}\``)

    }

    const prefix = guildsettings.prefix

    if (!message.content.startsWith(prefix) || message.author.bot) return; // Not gonna waste time of my bot

    const args = message.content.slice(prefix.length).split(/ +/);

    const commandname = args.shift().toLowerCase();

    const command = client.commands.get(commandname) || client.commands.find(file => file.aka && file.aka.includes(commandname))

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

        command.run(client, message, args)

    } catch (err) {

        const errorembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`${emojis.failed} Unkown Error Found`)
            .setDescription(`There was an Unkown Error while executing ${command.name}`)
            .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()

        message.reply({ embeds: errorembed });

        client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error:\n` + `\`${err}\``)

    }

});

client.on('guildCreate', async newguild => {

    if (blacklist.get(`${newguild.id}_GUILD`) == true) return newguild.leave();

    const guildsettings = await settingsSchema.findOne({ guild_ID: newguild.id })

    try {

        if (!guildsettings) {

            await settingsSchema.create({
                guild_ID: newguild.id,
                prefix: 'd.',
                log_channel: ' ',
                anti_nuke_enabled: false,
                anti_raid_enabled: false,
                mute_role: ' ',
                quarantine_role: ' '
            }).save

        } return

    } catch (err) {

        client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error Found while Registering a guild when added: \n` + `\`${err}\``)

    }

})

client.login(process.env.TOKEN)