const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = async function dhero(message, args, blizz_auth) {
    var queryOne = args.join(' ')
    qStr = queryOne.split(' ')
    query = qStr[0].replace("#", "%23")
    const data = await fetch(`https://us.api.blizzard.com/d3/profile/${query}/?locale=en_US&access_token=` + blizz_auth
    ).then(response => response.json());

    for (i = 0; i < data.heroes.length; i++) {
        if (data.heroes[i].name === qStr[1]) {
            var hId = data.heroes[i].id
            const hero = await fetch(`https://us.api.blizzard.com/d3/profile/${query}/hero/${hId}?locale=en_US&access_token=` + blizz_auth
            ).then(response => response.json());
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(data.battleTag + ` Hero`)
                .setTitle(hero.name)
                .addFields(
                    {name: 'Class:', value: hero.class},
                    {name: 'Paragon Level:', value: hero.paragonLevel},
                    {name: 'Highest Solo GR:', value: hero.highestSoloRiftCompleted},
                    {
                        name: 'Gear:', value: `**Helm:** ` + hero.items.head.name + `\n` +
                            `**Amulet:** ` + hero.items.neck.name + `\n` +
                            `**Chest:** ` + hero.items.torso.name + `\n` +
                            `**Shoulder:** ` + hero.items.shoulders.name + `\n` +
                            `**Leg:** ` + hero.items.legs.name + `\n` +
                            `**Belt:** ` + hero.items.waist.name + `\n` +
                            `**Gloves:** ` + hero.items.hands.name + `\n` +
                            `**Bracers:** ` + hero.items.bracers.name + `\n` +
                            `**Boots:** ` + hero.items.feet.name + `\n` +
                            `**Rings:** ` + hero.items.leftFinger.name + ` **||** ` + hero.items.rightFinger.name + `\n` +
                            `**Main Hand:** ` + hero.items.mainHand.name + `\n` +
                            `**Off Hand:** ` + hero.items.offHand.name
                    },
                    {
                        name: 'Active Skills:',
                        value:
                            hero.skills.active[0].skill.name + ' - ' + hero.skills.active[0].rune.name + `\n` +
                            hero.skills.active[1].skill.name + ' - ' + hero.skills.active[1].rune.name + `\n` +
                            hero.skills.active[2].skill.name + ' - ' + hero.skills.active[2].rune.name + `\n` +
                            hero.skills.active[3].skill.name + ' - ' + hero.skills.active[3].rune.name + `\n` +
                            hero.skills.active[4].skill.name + ' - ' + hero.skills.active[4].rune.name + `\n` +
                            hero.skills.active[5].skill.name + ' - ' + hero.skills.active[5].rune.name

                    },
                    {
                        name: 'Passive Skills:',
                        value:
                            hero.skills.passive[0].skill.name + `\n` +
                            hero.skills.passive[1].skill.name + `\n` +
                            hero.skills.passive[2].skill.name + `\n` +
                            hero.skills.passive[3].skill.name
                    }
                );
            message.channel.send(embed)
            return
        } else if (data.heroes[i].name !== qStr[1]) {
            console.log('-')
        }


    }
    message.channel.send(`Hero not found!`);

}