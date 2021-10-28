const fs = require('fs')
module.exports = (client) => {
    const commandfiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')); // filters out command files in commands folder
    for (const file of commandfiles) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command); // Reading Files 
            console.log(`Command => ${command.name} Loaded`) // Making sure that all file shows up in console
        } else continue;
    }
}