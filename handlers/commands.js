// Importing Modules to use here
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { clientID } = require('../config.json');
// Loading Commands and making em ready to be exported.
module.exports =(client) => {
    const commandfiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')); // Reading Directories be like
    const ArrayofSlashCommands = []; // Just like the name says, it's a complete array of slash commands
    commandfiles.forEach((file) => {
        const command = require(`../commands/${file}`); // Importing commands one by one :D
        // For Message Event
        if (command.name && command.run) {
            client.commands.set(command.name.toLowerCase(), command); // Setting up files in the collection
            console.log(`Message Command => ${command.name} Loaded`) // Making sure that all file shows up in console so that i dont have to die at the last moment
        }
        // For Interaction Event
        if (command.name && command.executeSlash) {
            const commandBuilder = command.register.toJSON()
            ArrayofSlashCommands.push(commandBuilder);
            console.log(`Interaction Command Deployed => ${command.name}`) // Making sure that it's deployed by console's log
        };
    })
    const rest = new REST({
        version:'9'
    }).setToken(process.env.TOKEN);
    // Time to create function to deploy slash commands
    async function SlashCommand(client, rest, clientID, Routes, ArrayofSlashCommands) {
        console.log('Deploying Slash Commands');
        await rest.put(
            Routes.applicationCommands(clientID), {
                body: ArrayofSlashCommands // Loading Slash commands in here.
            }
        );
        console.log(`Slash Commands Deployed Successfully for ${client.user.tag}. `)
    };
    try {
        SlashCommand(client, rest, clientID, Routes, ArrayofSlashCommands);
    } catch (err) {
        console.log(err)
    };
};