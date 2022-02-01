const settingsSchema = require(`../database/models/settingsSchema.js`);
const { blacklist, owner } = require(`../database/quick-db.js`);
const emojis = require(`../assets/emoji.json`);
const newguildsetup = require('../modules/newguld_setup.js');
const { MessageEmbed, Collection } = require('discord.js');
const { errorchannelID } = require(`../config.json`);
const cooldowns = new Map();

module.exports = async (client) => {
    // Message Event
    client.on('messageCreate', async message => {
        // Blacklisting stuff here.
        if (!message.guild || message.author.bot) return // Message in DM's were noticed, I SWEAR
        if (blacklist.get(`${message.guild.id}_GUILD`) == true) return // Blacklisting Guilds be like
        if (blacklist.get(`${message.author.id}_MEMBER`) == true) return // Blacklisting Users be like

        // In case there's no Database, Creating one so that we can continue with no problem
        const guildsettings = await settingsSchema.findOne({ guildID: message.guild.id })
        if (!guildsettings) {
            return newguildsetup(client, message.guild); // Calling up my new guild setup module here for database
        }

        // Time to setup Prefix and message event settings
        const prefix = guildsettings.prefix
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandname = args.shift().toLowerCase();
        const command = client.commands.get(commandname) || client.commands.find(file => file.aka && file.aka.includes(commandname))
        const errorchannel = client.channels.cache.get(errorchannelID)
        const notfoundembed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`Command Not Found`)
            .setDescription(`\`${commandname}\` Command was not found, please use \`${prefix}help\` to get list of commands.`)
            .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()

        if (!command) return message.reply({ embeds: [notfoundembed] })

        //If cooldowns map doesn't have a command.name key then create one.
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        const current_time = Date.now();
        const time_stamps = cooldowns.get(command.name);
        const cooldown_amount = (command.cooldown) * 1000;
        if (time_stamps.has(message.author.id)) { //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
            const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;
                const cooldownembed = new MessageEmbed()
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
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setTitle(`${emojis.failed} Unkown Error Found`)
                .setDescription(`There was an Unkown Error while executing ${command.name}`)
                .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
                .setTimestamp()
            message.reply({ embeds: errorembed });
            errorchannel.send(`Error:\n` + `\`${err}\``)
        }
    });

    // Interaction Event
    client.on('interactionCreate', async interact => {
        // This is for interaction commands only at the moment.
        if (!interact.isCommand()) return
        // Importing Commands
        const command = client.commands.get(interact.commandName);
        if (!command) return;
        // Importing and setting up error channel
        const errorchannel = client.channels.cache.get(errorchannelID)
        // Setting up cooldowns
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection);
        }
        const currentTime = Date.now();
        const timeStamps = cooldowns.get(command.name);
        const cooldown_amount = (command.cooldown)*1000;
        if (timeStamps.has(interact.member.id)) {
            const expiringTime = timeStamps.get(interact.member.id) + cooldown_amount;
            if (expiringTime > currentTime) {
                const timeLeft = expiringTime - currentTime;
                const timeleftEmbed = new MessageEmbed()
                    .setAuthor(interact.member.tag, interact.member.displayAvatarURL({dynamic:true}))
                    .setColor(`RED`)
                    .setTitle(`${emojis.loading} Rate Limit for Command => ${command.name}`)
                    .setDescription(`Please wait \`${timeLeft}\` seconds before using this command`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp()
                return interact.reply({
                    embeds: [timeleftEmbed],
                    ephemeral: true
                });
            }
        }

        await timeStamps.set(interact.member.id, cooldown_amount);
        setTimeout(() => {
            timeStamps.delete(interact.member.id);
        }, cooldown_amount);

        if (command.admin) {
            if (interact.member.permissions.has('MANAGE_GUILD')) {
                const permsmissingEmbed = new MessageEmbed()
                    .setAuthor(interact.member.tag, interact.member.displayAvatarURL({dynamic:true}))
                    .setColor('RED')
                    .setTitle(`Command Failed! ${emojis.failed}`)
                    .setDescription(`You don't have enough permissions to use this command.`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp()
                return interact.reply({
                    embeds: [permsmissingEmbed],
                    ephemeral: true
                });
            }
        }
        // Using Try/Catch Feature to catch errors while running commands.
        try {
            command.executeSlash(client, interact, errorchannel);
        } catch (err) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(`${emojis.failed} Unkown Error Found`)
                .setDescription(`There was an Unkown Error while executing ${command.name}`)
                .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
                .setTimestamp()
            interact.reply({ 
                embeds: [errorembed], ephemeral:true
            });
            errorchannel.send({
                content:`Error:\n` + `\`${err}\``
            });
        }
    });
    
    client.on('ready', () => {
        client.guilds.fetch().then((list) => {
            list.forEach((guilds) => {
                const guildSettings = settingsSchema.findOne({ guildID: guilds.id});
                if (!guildSettings) {
                    try {
                        newguildsetup(client, guilds);
                    } catch (err) {
                        client.channels.cache.get(errorchannelID).send({
                            content:`Error:\n` + `\`${err}\``
                        })
                    }
                }
            })
        })
    })
};