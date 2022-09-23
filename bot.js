const getChatCommand = require('./helpers/getCommand.js')
const logger = require('winston');
const Discord = require('discord.js');
const cron = require('cron');

function fileWrite(fileName, file) {
    const fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err)
        console.log(JSON.stringify(file))
        console.log('writing to ' + fileName)

    })
}

// Create twitch access token function
async function createTwitchAuth(clientId, clientSecret) {
    const fetch = require('node-fetch');
    const filename = './auth.json';
    const file = require(filename);
    const list = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: 'POST'
    }).then(response => response.json())
    file.twitch_bearer_token = list.access_token
    fileWrite(filename, file)
}

// Create blizzard access token function
function createAccessToken(apiKey, apiSecret, region = 'us') {
    return new Promise((resolve, reject) => {
        let credentials = Buffer.from(`${apiKey}:${apiSecret}`);
        const requestOptions = {
            host: `oauth.battle.net`,
            path: '/token',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials.toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let responseData = '';

        function requestHandler(res) {
            const filename = './auth.json';
            const file = require(filename);
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                let data = JSON.parse(responseData);
                resolve(data)
                file.blizzard_bearer_token = data.access_token // Store Bearer Token for d3 functions
                fileWrite(filename, file)
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

createAccessToken(auth.blizzard_client_id,auth.blizzard_client_secret, 'us') //initally created auth.blizzard_bearer_token on boot
// createTwitchAuth(auth.twitch_client_id,auth.twitch_client_secret) //initally created twitch_auth on boot

let bAuthRegen = new cron.CronJob('0 0 0,12 * * *', function()
{createAccessToken(auth.blizzard_client_id,auth.blizzard_client_secret, 'us')} ); // fires every day, at 00:00:00 and 12:00:00
bAuthRegen.start();                                                                     // keeps auth.blizzard_bearer_token alive

// let tAuthRegen = new cron.CronJob('0 0 1 * *', function()
// {createTwitchAuth(auth.twitch_client_id,auth.twitch_client_secret)} ); // fires every month, at 00:00:00
// tAuthRegen.start();                                                                     // keeps twitch_auth alive


// Initalize the discord client instance
const client = new Discord.Client();

// Start twitch check cron fires every uneven minute
// let twitchCheck = new cron.CronJob('1-59/2 * * * *', function () {
//     tw(client);
// });
// twitchCheck.start();

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
    client.user.setActivity('!command', {
        type: 'PLAYING'
    });
    //client.channels.cache.find(channel => channel.name === 'bot-testing').send("Hello there!");
});

// if a command is entered, the bot will respond accordingly
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //if the command is entered, but is not recognized  or is sent by the bot, do nothing

    const args = message.content.slice(prefix.length).split(/ +/); // split the ! from the command
    const command = args.shift().toLowerCase(); // convert the command to lower so we recognize commands regardless of how it was entered

    getChatCommand(args,command,message)
    
});
client.login(auth.token);
    