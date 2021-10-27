const {setup} = require('../database/quick-db')

module.exports = {
    name:'setowner',
    description:'IDK',
    owner:true,
}

module.exports.run = async(client, message, args) => {

    if(message.author.id ==! '321638481803739147') return message.reply(`Are you?`)

    const usertoadd = client.users.cache.get(message.mentions.users.first()).id || client.users.cache.get(args[0]).id

    if (!usertoadd) return

    await setup.set(`OWNERS_${usertoadd}`,true)

    await message.channel.send(`Added <@${usertoadd}> to owner`);

}