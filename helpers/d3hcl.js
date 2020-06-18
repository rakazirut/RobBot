const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = async function dhcl(message, args, blizz_auth) {
    var queryOne = args.join(' ')
    qStr = queryOne.split(' ')
    query = qStr[0].replace("#", "%23")
    var charClass

    const data = await fetch(`https://us.api.blizzard.com/d3/profile/${query}/?locale=en_US&access_token=` + blizz_auth
    ).then(response => response.json());

    if (data.code === 'NOTFOUND') {
        return message.channel.send(`Account not found!`)
    }


    for (i = 0; i < data.heroes.length; i++) {
        if (data.heroes[i].name === qStr[1]) {
            charClass = data.heroes[i].class
        } else if (data.heroes[i].name !== qStr[1]) {
            console.log('-')
        } else {
            return message.channel.send(`Hero not found!`)
        }

    }

    switch (charClass) {
        case "witch-doctor":
            charClass = 'wd'
            break
        case "demon-hunter":
            charClass = 'dh'
            break
        default:
            break
    }
    const lbd = await fetch(`https://us.api.blizzard.com/data/d3/season/${qStr[2]}/leaderboard/rift-hardcore-${charClass}?access_token=` + blizz_auth
    ).then(response => response.json());
    for (i = 0; i < lbd.row.length; i++) {
        if (lbd.row[i].player[0].data[0].string === qStr[0]) {

            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(lbd.title.en_US)
                .setTitle(`Hardcore Season ${qStr[2]} Leaderboard`)
                .addFields(
                    {name: 'Hero:', value: qStr[1]},
                    {name: 'Rank:', value: lbd.row[i].data[0].number},
                    {name: 'Rift Level:', value: lbd.row[i].data[1].number}
                )
            return message.channel.send(embed)

        }
    }
}