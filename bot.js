// Importing and loading all modules
const mongoose = require('mongoose');
const { Client, Intents, Collection } = require('discord.js'); // Importing Clients, Collections and Intents from discord.
const handler = ['commands','events']; // It's not any module but just for no reason, i pulled up my handler's name here in list.
const {errorchannelID} = require('./config.json');
const client = new Client({ 
    disableMentions: 'all', // Disabling Mentions for safety purpose for now. Will enable it future soon
    intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES], // Setting up intents 
    partials: ['CHANNEL','GUILD_MEMBER','MESSAGE','REACTION','USER'] // Setting up Partials
});
client.commands = new Collection(); // Collection of Commands
client.events = new Collection(); // For Events and stuff
require('dotenv').config();

// Configuration Done, Time to Load Handlers
client.on('ready', () => {
    handler.forEach(events =>{ 
        require(`./handlers/${events}`)(client)
        console.log(`Handler => ${events} Loaded`)
    });
})

// After Loading Handlers, Logging into the bot and database
client.login(process.env.TOKEN);
mongoose.connect(process.env.SRV_URL).then(() => {
    console.log(`Database Loaded successfully!`);
}).catch((errors) => {
    console.log(errors); // Logging errors in console.
});