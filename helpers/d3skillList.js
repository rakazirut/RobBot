const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = async function dskillList(message, args, blizz_auth) {
    var queryOne = args.join(' ')
    queryOne = queryOne.toLowerCase()
    const data = await fetch(`https://us.api.blizzard.com/d3/data/hero/${queryOne}?locale=en_US&access_token=` + blizz_auth
    ).then(response => response.json());
    var skillListActive = []
    var skillListPassive = []
    console.log(queryOne)
    for (i = 0; i < data.skills.active.length; i++) {
        skillListActive.push(data.skills.active[i].slug)
    }
    for (i = 0; i < data.skills.passive.length; i++) {
        skillListPassive.push(data.skills.passive[i].slug)
    }


    const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setDescription('Use !skill_detail with class and skill name for additional details\n' +
            '**Example:** !skill_detail witch-doctor spirit-walk')
        .setTitle(data.slug + ' skills')
        .addFields(
            { name: `**Active Skills:** `, value: skillListActive },
            { name: `**Passive Skills:** `, value: skillListPassive }
        )
    return message.channel.send(embed)
}