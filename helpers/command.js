const Discord = require('discord.js');

module.exports = function command(message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#EFFF00')
        .setDescription(`Some of the things I can do`)
        .setTitle('RobBot Commands')
        .addFields(
            { name: 'Is Rob?', value: 'ex: !rob' },
            { name: 'Is Tom?', value: 'ex: !tom' },
            { name: 'Cats, bro.', value: 'ex: !cat' },
            { name: 'Look up what words mean.', value: 'ex: !urban dance' },
            { name: 'WWKS?', value: 'ex: !kanye' },
            { name: 'BlackPeopleTwitter', value: 'ex: !bpt' },
            { name: 'Memes', value: 'ex: !meme' },
            { name: 'Get drunk?', value: 'ex: !drink' },
            { name: 'Youtube', value: 'ex: !yt bustin' },
            { name: 'reminder', value: 'note: the number is seconds until you should be reminded.\nex: !remind 30 your-message-stubbed' },
            { name: 'Diablo 3 Command Info', value: 'ex: !d3' }
        );
    message.channel.send(embed)
}