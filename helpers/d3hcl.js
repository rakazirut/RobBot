const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = async function dhcl(message, args, blizz_auth) {
    var queryOne = args.join(' ')
    qStr = queryOne.split(' ')
    query = qStr[0].replace("#", "%23")
    var charClass

    const data = await fetch(`https://us.api.blizzard.com/d3/profile/${query}/?locale=en_US&access_token=` + blizz_auth
    ).then(response => {
        if (response.status != 200) {
            return message.channel.send(`Account not found!`)
        }
        return response.json()
    });

    data.heroes.forEach(hero => {
        if (hero == null) { return message.channel.send(`Hero not found!`) }
        if (hero.name === qStr[1]) {
            charClass = hero.class
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
        }
    })
    if (charClass == null) { return message.channel.send(`Hero not found!`) }

    const lbd = await fetch(`https://us.api.blizzard.com/data/d3/season/${qStr[2]}/leaderboard/rift-hardcore-${charClass}?access_token=` + blizz_auth
    ).then(response => {
        if (response.status != 200) {
            return message.channel.send(`No record found!`)
        }
        return response.json()
    });

    var found = false
    for (i = 0; i < lbd.row.length; i++) {
        if (lbd.row[i].player[0].data[0].string === qStr[0]) {
            found = true
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(lbd.title.en_US)
                .setTitle(`Hardcore Season ${qStr[2]} Leaderboard`)
                .addFields(
                    { name: 'Hero:', value: qStr[1] },
                    { name: 'Rank:', value: lbd.row[i].data[0].number },
                    { name: 'Rift Level:', value: lbd.row[i].data[1].number }
                )
            return message.channel.send(embed)
        }
    }
    if (found == false) { return message.channel.send(`No record found!`) }
}