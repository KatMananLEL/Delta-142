const { MessageButton } = require("discord.js");

const emoji = require(`./emoji.json`)

const verifybutton = new MessageButton()
            .setEmoji(emoji.success)
            .setLabel('Yes')
            .setStyle('SUCCESS')

const closebutton = new MessageButton()
            .setEmoji(emoji.failed)
            .setLabel(`Close`)
            .setStyle('DANGER')

const leftpagebutton = new MessageButton()
            .setEmoji(emoji.arrow_left)
            .setLabel('Previous Page')
            .setStyle('SECONDARY')

const rightpagebutton = new MessageButton()
            .setEmoji(emoji.arrow_right)
            .setLabel('Next Page')
            .setStyle('SECONDARY')
    
const cancelbutton = new MessageButton()
            .setEmoji(emoji.failed)
            .setLabel('Cancel')
            .setStyle('DANGER')

module.exports = {verifybutton, closebutton, rightpagebutton, leftpagebutton, cancelbutton}