const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');


module.exports = async function daccount(message, args, blizz_auth) {
    var query = args.join(' ');
    query = query.replace("#", "%23")
    const data = await fetch(`https://us.api.blizzard.com/d3/profile/${query}/?locale=en_US&access_token=` + blizz_auth
    ).then(response => response.json());
    var resp = []
    var lastPlayed
    for (i = 0; i < data.heroes.length; i++) {
        var id = data.heroes[i].id
        resp.push(data.heroes[i].name)
        if (id === data.lastHeroPlayed) {
            lastPlayed = data.heroes[i].name
        }

    }
    const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setDescription(`Account Info`)
        .setTitle(data.battleTag)
        .addFields(
            { name: 'Overall HC Paragon:', value: data.paragonLevelHardcore },
            { name: 'Current Season HC Paragon:', value: data.paragonLevelSeasonHardcore },
            {
                name: 'Total Kills:', value:
                    `Softcore: ` + data.kills.monsters + `\n` +
                    `Hardcore: ` + data.kills.hardcoreMonsters + `\n` +
                    `Elites: ` + data.kills.elites
            },
            { name: 'Heroes:', value: resp },
            { name: 'Last Played Hero:', value: lastPlayed }
        )

    return message.channel.send(embed)
}