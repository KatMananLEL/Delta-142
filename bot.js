const { setup } = require('./database/quick-db.js')
const mongoose = require('mongoose')
const Discord = require('discord.js')
require('dotenv').config()
const handler = ['commands','events']
const client = new Discord.Client({ disableMentions: 'all', intents: [Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES] })
client.commands = new Discord.Collection(); // Making Collections for Commmand files
client.pages = new Discord.Collection(); // For Editing Command's Message which has more than 2 Pages
client.events = new Discord.Collection();

handler.forEach(thick_milf =>{ 
    require(`./handlers/${thick_milf}`)(client)
    console.log(`Handler => ${thick_milf} Loaded`)
})

mongoose.connect(process.env.SRV_URL).then(() => {
    console.log(`Logged-in to Database`)
}).catch((err) => {
    client.channels.cache.get(setup.get('ERROR_LOGS')).send(`Error While Logging Into Database \n` + `\`${err}\``)
})

client.login(process.env.TOKEN)