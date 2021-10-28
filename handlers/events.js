const fs = require('fs')
module.exports = (client) => {
    const waifu = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));
    for(const tanlines of waifu) {
        const flushness = require(`../events/${tanlines}`)
        const waifuname = tanlines.split('.')[0]
        client.on(waifuname, flushness.bind(null, client))
        console.log(`Event => ${waifuname} Loaded`)
    }
}