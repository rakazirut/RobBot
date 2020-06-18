const logger = require('winston');
const auth = require('./auth.json');
const Discord = require('discord.js');
const cron = require('cron');
const cat = require('./helpers/cat.js');
const tw = require('./helpers/twitch.js');
const kanye = require('./helpers/kanye.js');
const mix = require('./helpers/mixer.js');
const urban = require('./helpers/urban.js');
const drink = require('./helpers/drink.js');
const com = require('./helpers/command.js');
const meme = require('./helpers/mymeme.js');
const bpt = require('./helpers/bpt.js');
const yt = require('./helpers/yt.js');
const remind = require('./helpers/remind.js');
const bbot = require('./helpers/bbot.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let i = 0;
var blizz_auth;

// Create blizzard access token function
function createAccessToken(apiKey, apiSecret, region = 'us') {
    return new Promise((resolve, reject) => {
        let credentials = Buffer.from(`${apiKey}:${apiSecret}`);

        const requestOptions = {
            host: `${region}.battle.net`,
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials.toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let responseData = '';

        function requestHandler(res) {
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                let data = JSON.parse(responseData);
                resolve(data)
                blizz_auth = data.access_token  // Store Bearer Token for d3 functions
                console.log('new blizz_auth created on '+ new Date())
            });
        }

        let request = require('https').request(requestOptions, requestHandler);
        request.write('grant_type=client_credentials');
        request.end();

        request.on('error', (error) => {
            reject(error);
        });
    });
}

createAccessToken(auth.blizzard_client_id,auth.blizzard_client_secret, 'us') //initally created blizz_auth on boot

let bAuthRegen = new cron.CronJob('0 0 0,12 * * *', function()
{createAccessToken(auth.blizzard_client_id,auth.blizzard_client_secret, 'us')} ); // fires every day, at 00:00:00 and 12:00:00
bAuthRegen.start();                                                                     // keeps blizz_auth alive

// Initalize the discord client instance
const client = new Discord.Client();

// Start twitch check cron fires every uneven minute
let twitchCheck = new cron.CronJob('1-59/2 * * * *', function () {
    tw(client);
});
twitchCheck.start();

// Start Mixer check cron fires every even minute
let mixCheck = new cron.CronJob('*/2 * * * *', function () {
    mix(client);
});
mixCheck.start();

// Prefix to tell RobBot a command has been entered
const prefix = '!';

// Client will connect
client.once('ready', () => {
    logger.info('Ready!');
});

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// client establishes connection and is listening for events/commands
client.on('ready', function (evt) {
    logger.info('Connected as ' + auth.discord_client_id);
    client.user.setActivity('!command', {type: 'PLAYING'});
    //client.channels.cache.find(channel => channel.name === 'bot-testing').send("Hello there!");
});

// if a command is entered, the bot will respond accordingly
client.on('message', async message => {
    //if a message contains a instance of word 'game' and is a multiple of 5 relative to i, post auto response
    // why?
    if (!message.content.startsWith(prefix) && message.content.includes('game')) {
        console.log(i)
        if (i % 5 === 0) {
            i++;
            return message.channel.send(`I failed gym class 3 times 'cause I don't play no games!`);
        } else {
            i++;
            return;
        }

    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;  //if the command is entered, but is not recognized  or is sent by the bot, do nothing


    const args = message.content.slice(prefix.length).split(/ +/); // split the ! from the command
    const command = args.shift().toLowerCase(); // convert the command to lower so we recognize commands regardless of how it was entered

    if (command === 'cat') {
        cat(message);
    } else if (command === 'tom') {
        return message.channel.send('..kids a fag!');
    } else if (command === 'rob') {
        return message.channel.send('..kids not a fag!');
    } else if (command === 'connor') {
        return message.channel.send('..not entirely sure, might be a fag.');
    } else if (command === 'goodbot') {
        return message.channel.send(`Thanks, Dad! :slight_smile:`);
    } else if (command === 'meme') {
        meme(message);
    } else if (command === 'badbot') {
        bbot(message);
    } else if (command === 'command') {
        com(message);
    } else if (command === 'drink') {
        drink(message);
    } else if (command === 'kanye') {
        kanye(message);
    } else if (command === 'bpt') {
        bpt(message);
    } else if (command === 'remind'){
        if (!args.length){
            return message.channel.send('You need to supply seconds and reminder message!');
        }
        var query = args.join(' ');
        qStr = query.split(' ');
        console.log(message.author.username);
        remind(message, qStr);
    } else if (command === 'yt') {
        if (!args.length){
            return message.channel.send('You need to supply search term!');
        }
        var query = args.join(' ');
        yt(message, query);
    } else if (command === 'urban') {
        if (!args.length) {
            return message.channel.send('You need to supply a search term!');
        }
        urban(message, args);
    } else if (command === 'account') {     //Start D3 specific commands
        if (!args.length) {
            return message.channel.send('You need to supply a BattleTag! (ex: WhiskeyRomeo#1730');
        }
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
                {name: 'Overall HC Paragon:', value: data.paragonLevelHardcore},
                {name: 'Current Season HC Paragon:', value: data.paragonLevelSeasonHardcore},
                {
                    name: 'Total Kills:', value:
                        `Softcore: ` + data.kills.monsters + `\n` +
                        `Hardcore: ` + data.kills.hardcoreMonsters + `\n` +
                        `Elites: ` + data.kills.elites
                },
                {name: 'Heroes:', value: resp},
                {name: 'Last Played Hero:', value: lastPlayed}
            )

        return message.channel.send(embed)
    } else if (command === 'hero') {
        if (!args.length) {
            return message.channel.send('You need to supply a BattleTag and HeroName! (ex: !hero WhiskeyRomeo#1730 BackClapper');
        }
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
    } else if (command === 'hcl') {
        if (!args.length) {
            return message.channel.send('You need to supply a BattleTag, HeroName, and Season! (ex: !hcl WhiskeyRomeo#1730 BackClapper 20');
        }
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
    } else if (command === 'skill_detail') {
        if (!args.length) {
            return message.channel.send('You need to supply a Class Type and Skill Name (ex: !skill barbarian bash');
        }
        var queryOne = args.join(' ')
        qStr = queryOne.split(' ')
        var sClass = qStr[0].toLowerCase()
        var sSkill = qStr[1].toLowerCase()
        const data = await fetch(`https://us.api.blizzard.com/d3/data/hero/${sClass}/skill/${sSkill}?locale=en_US&access_token=` + blizz_auth
        ).then(response => response.json());

        if (data.hasOwnProperty('runes')) {
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(data.skill.description)
                .setTitle(`Active Skill: ` + data.skill.name)
                .addFields(
                    {name: `**Rune:** ` + data.runes[0].name, value: data.runes[0].description},
                    {name: `**Rune:** ` + data.runes[1].name, value: data.runes[1].description},
                    {name: `**Rune:** ` + data.runes[2].name, value: data.runes[2].description},
                    {name: `**Rune:** ` + data.runes[3].name, value: data.runes[3].description},
                    {name: `**Rune:** ` + data.runes[4].name, value: data.runes[4].description}
                )
            return message.channel.send(embed)
        } else {
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(data.skill.description)
                .setTitle(`Passive Skill: ` + data.skill.name)
                .addFields(
                    {name: `**Musings:** `, value: data.skill.flavorText}
                )
            return message.channel.send(embed)
        }

    } else if (command === 'skill_list') {
        if (!args.length) {
            return message.channel.send('You need to supply a Class Type (ex: !skill_list barbarian');
        }
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
                {name: `**Active Skills:** `, value: skillListActive},
                {name: `**Passive Skills:** `, value: skillListPassive}
            )
        return message.channel.send(embed)

    } else if (command === 'd3') {
        const embed = new MessageEmbed()
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
    //End D3 specific commands
});
client.login(auth.token);

