const { MessageEmbed } = require('discord.js');
const {inspect} = require('util')
const emojixd = require(`../aesthetics/emoji.json`)
const {setup, blacklist, owner} = require('../database/quick-db.js')
const settingsSchema = require('../database/models/settingsSchema.js')
module.exports = {
    name: 'eval',
    description: 'Evalutes things xd',
    owner:true,
}
module.exports.run = async (client, message, args, errorchannel) => {
    const guildsettings = settingsSchema.findOne({guild_ID: message.guild.id})
    try {
        const toEval = args.join(' ');
        const evaluated = inspect(await Promise.resolve(eval(toEval, { depth: 0 })));

        if (toEval) {
            message.react(emojixd.success);
            return message.reply({embeds:[
                new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Evaluate`)
                .setDescription(`\`\`\`javascript\n${evaluated}\n\`\`\``)
                .setTimestamp()
                .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({dynamic:true})}`)
            ]}).catch(e => {
                errorchannel.send(`${e}`) 
                message.channel.send(`Error sent to: <#${errorchannel.id}>`)
            })
        } else {
            message.channel.send('Imagine Evaluating your brain cells--- I mean air.');
        }
    }
    catch (e) {
        message.channel.send(`Error Sent to: <#${errorchannel.id}>`);
        errorchannel.send(`Error while evaluating: \`${e}\``)
    }
}