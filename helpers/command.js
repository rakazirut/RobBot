const Discord = require('discord.js');

module.exports = function command(message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#EFFF00')
        .setDescription(`Some of the things I can do`)
        .setTitle('RobBot Commands')
        .addFields(
            { name: 'Is Rob a fag?', value: 'ex: !rob' },
            { name: 'Is Tom a fag?', value: 'ex: !tom' },
            { name: 'Cats, bro.', value: 'ex: !cat' },
            { name: 'Look up what words mean.', value: 'ex: !urban bluewaffle' },
            { name: 'Any lit streams?', value: 'ex: !twitch lirik' },
            { name: 'WWKS?', value: 'ex: !kanye' },
            { name: 'BlackPeopleTwitter', value: 'ex: !bpt' },
            { name: 'Memes', value: 'ex: !meme' },
            { name: 'Get drunk?', value: 'ex: !drink' },
            { name: 'Youtube', value: 'ex: !yt bustin' },
            { name: 'Diablo 3 Command Info', value: 'ex: !d3' }
        );
    message.channel.send(embed)
}