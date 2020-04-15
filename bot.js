const logger = require('winston');
const auth = require('./auth.json');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

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
    logger.info('Connected as '+auth.discord_client_id);
    client.user.setActivity('!command', { type: 'PLAYING' });
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'cat') {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        const embed = new MessageEmbed()
            .setColor('#EC805B')
            .setTitle("Cats bro")
            .setImage(file)

        message.channel.send(embed);
    } 

    else if (command === 'urban') {
        if (!args.length) {
            return message.channel.send('You need to supply a search term!');
        }

        const query = querystring.stringify({ term: args.join(' ') });

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

        if (!list.length) {
            return message.channel.send(`No results found for **${args.join(' ')}**.`);
        }

        const [answer] = list;

        const embed = new MessageEmbed()
            .setColor('#01853D')
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addFields(
                { name: 'Definition', value: trim(answer.definition, 1024) },
                { name: 'Example', value: trim(answer.example, 1024) },
                { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` }
            );

        message.channel.send(embed);
    }

    else if (command === 'tom'){
        return message.channel.send('..kids a fag!');
    }

    else if (command === 'rob'){
        return message.channel.send('..kids not a fag!');
    }

    else if (command === 'goodbot'){
        return message.channel.send(`Thanks, Dad! :slight_smile:`);
    }

    else if (command === 'meme'){
        const file  = await fetch('https://meme-api.herokuapp.com/gimme').then(response => response.json());
        const embed = new MessageEmbed()
            .setColor('#220F38')
            .setTitle(file.title)
            .setURL(file.postLink)
            .setImage(file.url)
            .addFields(
                { name: 'Subreddit', value: file.subreddit }
            );
        message.channel.send(embed) 
    }

    else if (command === 'twitch'){
        if (!args.length) {
            return message.channel.send('You need to supply a search term!');
        }

        const query = args.join(' ')
        const { data }  = await fetch(`https://api.twitch.tv/helix/streams?client_id=`+auth.twitch_client_id+`&user_login=${query}`, {method: 'GET', headers: headers}).then(response => response.json());
        
        if (!data.length) {
            return message.channel.send('Streamer is not live: '+query+'.');
        }

        const [stream] = data;
        const gameID = stream.game_id;
        const game = await fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {method: 'GET', headers: headers}).then(response => response.json());

        var strinng = game.data[0].box_art_url.slice(0, game.data[0].box_art_url.lastIndexOf('-'))+'.jpg';

        const embed = new MessageEmbed()
            .setColor('#F687B3')
            .setDescription(`:red_circle: **${query} is currently live on Twitch!**`)
            .setTitle(stream.title)
            .setURL('https://www.twitch.tv/'+query)
            .setImage(strinng)
            .addFields(
                { name: 'Streamer', value: stream.user_name },
                { name: 'Game', value: game.data[0].name },
                { name: 'View Count', value: stream.viewer_count }
            );
        message.channel.send(embed)
    }

    else if (command === 'command'){
        const embed = new MessageEmbed()
            .setColor('#EFFF00')
            .setDescription(`Some of the things I can do`)
            .setTitle('RobBot Commands')
            .addFields(
                { name: 'Is Rob a fag?', value: 'ex: !rob' },
                { name: 'Is Tom a fag?', value: 'ex: !tom' },
                { name: 'Cats, bro.', value: 'ex: !cat' },
                { name: 'Look up what words mean.', value: 'ex: !urban bluewaffle' },
                { name: 'Any lit streams?', value: 'ex: !twitch lirik' },
                { name: 'WWKS?', value: 'ex: !kanye' },
                { name: 'Get drunk?', value: 'ex: !drink' }
            );
        message.channel.send(embed)
    }

    else if (command === 'drink'){
        const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`).then(response => response.json());

        const embed = new MessageEmbed()
            .setColor('#005072')
            .setDescription(`..lets get drunk bruh`)
            .setTitle(data.drinks[0].strDrink)
            .setImage(data.drinks[0].strDrinkThumb)
            .setURL('https://www.thecocktaildb.com/drink.php?c='+data.drinks[0].idDrink)
            .addFields(
                { name: 'Category?', value: data.drinks[0].strCategory },
                { name: 'Alcoholic?', value: data.drinks[0].strAlcoholic },
                { name: 'Glass?', value: data.drinks[0].strGlass }

            );
        message.channel.send(embed)  
    }

    else if (command === 'kanye'){
        const data = await fetch(`https://api.kanye.rest`).then(response => response.json());

        const embed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setDescription(data.quote)
            .setTitle(`Things Kanye says..`)
            .setImage('https://pngimage.net/wp-content/uploads/2018/06/kanye-west-head-png-5.png')

        message.channel.send(embed)
    }
});

client.login(auth.token);
