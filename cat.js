const got = require('got');
const Discord = require('discord.js');

module.exports = function cat(message) {
    const embed = new Discord.MessageEmbed();
    got('https://aws.random.cat/meow').then(response => {
        let content = JSON.parse(response.body);
        embed.setColor('#EC805B')
        embed.setTitle("Cats bro")
        embed.setImage(content.file)
        message.channel.send(embed)
            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
        console.log('Bot responded with: ' + content);
    }).catch(console.error);
}