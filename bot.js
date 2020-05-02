const logger = require('winston');
const auth = require('./auth.json');
const Discord = require('discord.js');
const cat = require('./helpers/cat.js');
const kanye = require('./helpers/kanye.js');
const drink = require('./helpers/drink.js');
const com = require('./helpers/command.js');
const meme = require('./helpers/mymeme.js');
const bpt = require('./helpers/bpt.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const got = require('got');

// Initalize the discord client instance
    const client = new Discord.Client();

// Prefix to tell RobBot a command has been entered
    const prefix = '!';

// Used for the twitch requests that require client_ud header
    const headers = {
        "Client-ID": auth.twitch_client_id
    }

// Used to trim the urban dictionary results
    const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;

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

    client.on('ready', function (evt) {
        logger.info('Connected as ' + auth.discord_client_id);
        client.user.setActivity('!command', {type: 'PLAYING'});
    });

    client.on('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'cat') {
            cat(message);
        } else if (command === 'urban') {
            if (!args.length) {
                return message.channel.send('You need to supply a search term!');
            }

            const query = querystring.stringify({term: args.join(' ')});

            const {list} = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

            if (!list.length) {
                return message.channel.send(`No results found for **${args.join(' ')}**.`);
            }

            const [answer] = list;

            const embed = new MessageEmbed()
                .setColor('#01853D')
                .setTitle(answer.word)
                .setURL(answer.permalink)
                .addFields(
                    {name: 'Definition', value: trim(answer.definition, 1024)},
                    {name: 'Example', value: trim(answer.example, 1024)},
                    {name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`}
                );

            message.channel.send(embed);
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
        } else if (command === 'twitch') {
            if (!args.length) {
                return message.channel.send('You need to supply a search term!');
            }

            const query = args.join(' ')
            const {data} = await fetch(`https://api.twitch.tv/helix/streams?client_id=` + auth.twitch_client_id + `&user_login=${query}`, {
                method: 'GET',
                headers: headers
            }).then(response => response.json());

            if (!data.length) {
                return message.channel.send('Streamer is not live: ' + query + '.');
            }

            const [stream] = data;
            const gameID = stream.game_id;
            const game = await fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {
                method: 'GET',
                headers: headers
            }).then(response => response.json());

            var strinng = game.data[0].box_art_url.slice(0, game.data[0].box_art_url.lastIndexOf('-')) + '.jpg';

            if (strinng.includes("/./")){
                strinng = strinng.replace("/./", "/" )
            }
            var string = strinng.split(' ').join('%20')
            console.log(string)

            const embed = new MessageEmbed()
                .setColor('#F687B3')
                .setDescription(`:red_circle: **${query} is currently live on Twitch!**`)
                .setTitle(stream.title)
                .setURL('https://www.twitch.tv/' + query)
                .setImage(string)
                .addFields(
                    {name: 'Streamer', value: stream.user_name},
                    {name: 'Game', value: game.data[0].name},
                    {name: 'View Count', value: stream.viewer_count}
                );
            message.channel.send(embed)
        } else if (command === 'command') {
            com(message);
        } else if (command === 'drink') {
            drink(message);
        } else if (command === 'kanye') {
            kanye(message);
        } else if (command === 'bpt') {
            bpt(message);
        }
        else if (command === 'loop'){
            console.log('ok.')
            var interval = setInterval (async function a() {
                const queryStr = ['lirik', 'Quin69', 'timthetatman']
                for(i = 0; i< queryStr.length; i++) {
                    const query = queryStr[i]
                    const {data} = await fetch(`https://api.twitch.tv/helix/streams?client_id=` + auth.twitch_client_id + `&user_login=${query}`, {
                        method: 'GET',
                        headers: headers
                    }).then(response => response.json());

                    if (!data.length) {
                        return message.channel.send('Streamer is not live: ' + query + '.');
                    }

                    const [stream] = data;
                    const gameID = stream.game_id;
                    const game = await fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {
                        method: 'GET',
                        headers: headers
                    }).then(response => response.json());

                    var strinng = game.data[0].box_art_url.slice(0, game.data[0].box_art_url.lastIndexOf('-')) + '.jpg';

                    if (strinng.includes("/./")){
                        strinng = strinng.replace("/./", "/" )
                    }

                    var string = strinng.split(' ').join('%20')
                    console.log(string)
                    const embed = new MessageEmbed()
                        .setColor('#F687B3')
                        .setDescription(`:red_circle: **${query} is currently live on Twitch!**`)
                        .setTitle(stream.title)
                        .setURL('https://www.twitch.tv/' + query)
                        .setImage(string)
                        .addFields(
                            {name: 'Streamer', value: stream.user_name},
                            {name: 'Game', value: game.data[0].name},
                            {name: 'View Count', value: stream.viewer_count}
                        );
                    message.channel.send(embed)
                    await new Promise(r => setTimeout(r, 20000));
                }
            }, 900000);
        }

    });

client.login(auth.token);
