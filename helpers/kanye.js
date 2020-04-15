const got = require('got');
const Discord = require('discord.js');

module.exports = function kanye(message) {
    const embed = new Discord.MessageEmbed();
    got('https://api.kanye.rest').then(response => {
        let content = JSON.parse(response.body);
            embed.setColor('#FFFFFF')
            embed.setDescription(content.quote)
            embed.setTitle(`Things Kanye says..`)
            embed.setImage('https://pngimage.net/wp-content/uploads/2018/06/kanye-west-head-png-5.png')
        message.channel.send(embed)
            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
        console.log('Bot responded with: ' + content.quote);
    }).catch(console.error);
}