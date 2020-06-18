const Discord = require('discord.js');

module.exports = function d3(message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setDescription('Specialized functions related to D3 Hardcore Seasonal')
        .setTitle(`Diablo 3 Commands`)
        .addFields(
            {
                name: '!account:', value: `Returns information related to the user account.\n` +
                    `**Example:** !account WhiskeyRomeo#1730`
            },
            {
                name: '!hero:', value: 'Returns information related to the specified hero for an account.\n' +
                    `**Example:** !hero WhiskeyRomeo#1730 BackClapper`
            },
            {
                name: '!hcl:',
                value: `Returns (if applicable) the Solo GR Leaderboard position for the specified hero and season.\n` +
                    `**Example:** !hcl WhiskeyRomeo#1730 BackClapper 20`
            },
            {
                name: '!skill_list:', value: `Returns list of skills for the given class\n` +
                    `**Example:** !skill_list demon-hunter\n` +
                    `**Class List:** barbarian, crusader, demon-hunter, monk, necromancer, witch-doctor, wizard`
            },
            {
                name: '!skill_detail:', value: `Returns additional detail of skill for the given class\n` +
                    `**Example:** !skill_detail demon-hunter cluster-arrow`
            }
        )
    return message.channel.send(embed)
}