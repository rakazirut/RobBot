const logger = require('winston');
const auth = require('./auth.json');
const Discord = require('discord.js');
const cron = require('cron');
const cat = require('./helpers/cat.js');
const tw = require('./helpers/twitch.js');
const kanye = require('./helpers/kanye.js');
const urban = require('./helpers/urban.js');
const drink = require('./helpers/drink.js');
const com = require('./helpers/command.js');
const meme = require('./helpers/mymeme.js');
const bpt = require('./helpers/bpt.js');
const yt = require('./helpers/yt.js');
const remind = require('./helpers/remind.js');
const bbot = require('./helpers/bbot.js');
const d3 = require('./helpers/d3.js');
const daccount = require('./helpers/d3account.js');
const dhero = require('./helpers/d3hero.js');
const dhcl = require('./helpers/d3hcl.js');
const dsl = require('./helpers/d3skillList.js');
const dsd = require('./helpers/d3skillDetail.js');
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
    if (!message.content.startsWith(prefix) || message.author.bot) return;  //if the command is entered, but is not recognized  or is sent by the bot, do nothing

    const args = message.content.slice(prefix.length).split(/ +/); // split the ! from the command
    const command = args.shift().toLowerCase(); // convert the command to lower so we recognize commands regardless of how it was entered

    if (command === 'cat') { cat(message);}
    else if (command === 'tom') { return message.channel.send('..kids a fag!');}
    else if (command === 'rob') { return message.channel.send('..kids not a fag!');}
    else if (command === 'connor') { return message.channel.send('..not entirely sure, might be a fag.');}
    else if (command === 'goodbot') { return message.channel.send(`Thanks, Dad! :slight_smile:`);}
    else if (command === 'meme') { meme(message);}
    else if (command === 'badbot') { bbot(message);}
    else if (command === 'command') { com(message);}
    else if (command === 'drink') { drink(message);}
    else if (command === 'kanye') { kanye(message);}
    else if (command === 'bpt') { bpt(message);}
    else if (command === 'remind'){
        if (!args.length){
            return message.channel.send('You need to supply seconds and reminder message!');
        }
        var query = args.join(' ');
        qStr = query.split(' ');
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
        daccount(message,args,blizz_auth);
    } else if (command === 'hero') {
        if (!args.length) {
            return message.channel.send('You need to supply a BattleTag and HeroName! (ex: !hero WhiskeyRomeo#1730 BackClapper');
        }
        dhero(message,args,blizz_auth);
    } else if (command === 'hcl') {
        if (!args.length) {
            return message.channel.send('You need to supply a BattleTag, HeroName, and Season! (ex: !hcl WhiskeyRomeo#1730 BackClapper 20');
        }
        dhcl(message,args,blizz_auth);
    } else if (command === 'skill_detail') {
        if (!args.length) {
            return message.channel.send('You need to supply a Class Type and Skill Name (ex: !skill barbarian bash');
        }
        dsd(message,args,blizz_auth);
    } else if (command === 'skill_list') {
        if (!args.length) {
            return message.channel.send('You need to supply a Class Type (ex: !skill_list barbarian');
        }
        dsl(message,args,blizz_auth);
    } else if (command === 'd3') { d3(message);}
});
client.login(auth.token);