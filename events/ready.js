const {setup, owner} = require('../database/quick-db.js')
module.exports = (client) => {
    client.user.setActivity(`to d.help`, {
        type: 'LISTENING'
    });
    setup.set(`ERROR_LOGS`, '893073190035816458')
    owner.set('OWNER_321638481803739147', true)
    console.log(`Loaded all files for ${client.user.tag}`);
}