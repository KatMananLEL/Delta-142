const { MessageEmbed } = require('discord.js');

const {inspect} = require('util')

const emojixd = require(`../aesthetics/emoji.json`)

module.exports = {
    name: 'eval',
    description: 'Evalutes things xd',
    owner:true,
}

module.exports.run = async (client, message, args) => {

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
                
                client.channels.cache.get('893073190035816458').send(`${e}`) 
            
                message.channel.send(`Error sent to: <#893073190035816458>`)

        })

        }

        else {

            message.channel.send('Imagine Evaluating your brain cells--- I mean air.');

        }

    }

    catch (e) {

        message.channel.send(`Error Sent to: <#893073190035816458>`);

        client.channels.cache.get('893073190035816458').send(`Error while evaluating: \`${e}\``)

    }


}