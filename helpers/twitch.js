const fetch = require('node-fetch');
const auth = require('../auth.json');
const { MessageEmbed } = require('discord.js');
const queryOnline = [];
const queryOffline = [];
const queryGame = [];
// Used for the twitch requests that require client_id header
const headers = {
    "Client-ID": auth.twitch_client_id,
    "Authorization": `Bearer `+auth.twitch_bearer_token
}

// The streamers we are checking for
var queryStr = ['lirik', 'summit1g', 'timthetatman', 'shotz', 'kitboga', 'quin69', 'nmplol', 'checkyowatch',
   'moonmoon', 'shroud', 'ninja', 'heyzeusherestoast']

module.exports = {

    twitch: async function twitch(client) {

        // loop every minute to check the status of the streamers
        for (i = 0; i < queryStr.length; i++) {
            const query = queryStr[i]
            const {data} = await fetch(`https://api.twitch.tv/helix/streams?user_login=${query}`, {
                method: 'GET',
                headers: headers
            }).then(response => response.json());


            const [stream] = data;
            //IF no data return(user offline) and they are not in the offline array, add them to offline array)
            if (!data.length && queryOffline.includes(query) === false) {
                queryOffline.push(query)
                if (queryOnline.includes(query) === true) { //if a user in this state was previously online, remove them from online array
                    rIndex = queryOnline.indexOf(query)
                    queryGame.splice(queryOnline.indexOf(query), 1)  //removes record of last known game user was playing
                    queryOnline.splice(rIndex, 1) // removes user from online, since they are offline
                }
            }
            //If data returned(user online) and they are not in the online array, post the new content
            else if (data.length && queryOnline.includes(query) === false) {

                const gameID = stream.game_id;
                queryGame.push(gameID) // adds record of the game the user is currently playing
                const game = await fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {
                    method: 'GET',
                    headers: headers
                }).then(response => response.json());

                var strinng = game.data[0].box_art_url.slice(0, game.data[0].box_art_url.lastIndexOf('-')) + '.jpg';

                if (strinng.includes("/./")) {
                    strinng = strinng.replace("/./", "/")
                }
                var string = strinng.split(' ').join('%20')

                const embed = new MessageEmbed()
                    .setColor('#5900ff')
                    .setDescription(`:red_circle: **${stream.user_name} is currently live on Twitch!**`)
                    .setTitle(stream.title)
                    .setURL('https://www.twitch.tv/' + query)
                    .setImage(string)
                    .addFields(
                        {name: 'Streamer', value: stream.user_name},
                        {name: 'Game', value: game.data[0].name},
                        {name: 'View Count', value: stream.viewer_count}
                    );
                client.channels.cache.find(channel => channel.name === 'twitch').send(embed);
                //add user to online array so we don't post content again until status has changed
                queryOnline.push(query)
                //remove user from offline array since they are online
                if (queryOffline.includes(query) === true) {
                    rIndex = queryOffline.indexOf(query)
                    queryOffline.splice(rIndex, 1)

                }
                await new Promise(r => setTimeout(r, 50));
            } else if (data.length && queryOnline.includes(query) === true && queryGame[queryOnline.indexOf(query)] !== stream.game_id) {
                //user enters this loop if the stream remained online, but switched games
                // console.log(queryOnline.indexOf(query))
                // console.log(queryGame[queryOnline.indexOf(query)])
                // console.log(stream.game_id)
                const gameID = stream.game_id;

                const game = await fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {
                    method: 'GET',
                    headers: headers
                }).then(response => response.json());

                var strinng = game.data[0].box_art_url.slice(0, game.data[0].box_art_url.lastIndexOf('-')) + '.jpg';

                if (strinng.includes("/./")) {
                    strinng = strinng.replace("/./", "/")
                }
                var string = strinng.split(' ').join('%20')

                const embed = new MessageEmbed()
                    .setColor('#5900ff')
                    .setDescription(`:red_circle: **${stream.user_name} changed games!**`)
                    .setTitle(stream.title)
                    .setURL('https://www.twitch.tv/' + query)
                    .setImage(string)
                    .addFields(
                        {name: 'Streamer', value: stream.user_name},
                        {name: 'Game', value: game.data[0].name},
                        {name: 'View Count', value: stream.viewer_count}
                    );
                client.channels.cache.find(channel => channel.name === 'twitch').send(embed);
                queryGame[queryOnline.indexOf(query)] = gameID // change record of game currently playing
            } else { //IF user is in either array, and no status has changed, do nothing
                console.log('-')
            }
        }
        console.log('Time completed: ' + new Date())
        console.log(queryOnline + ' online - twitch')
        console.log(queryOffline + ' offline - twitch')
        console.log(queryGame)

    },

    twitchList: function twitchList(message, args) {
        var queryOne = args.join(' ')
        qStr = queryOne.split(' ')
        var tAction = qStr[0].toLowerCase()

        if(qStr[1] === undefined){return message.channel.send(`provide query`);}
        else{var tStreamer = qStr[1].toLowerCase()}



        if (tAction === 'get' && tStreamer === 'list'){
            if(!queryStr.length){
                return message.channel.send(`we don't have that list yet`);
            }
            return message.channel.send(queryStr);
        }
        if (tAction === 'get' && tStreamer === 'online'){
            if(!queryOnline.length){
                return message.channel.send(`we don't have that list yet`);
            }
            return message.channel.send(queryOnline);
        }
        if (tAction === 'get' && tStreamer === 'offline'){
            if(!queryOffline.length){
                return message.channel.send(`we don't have that list yet`);
            }
            return message.channel.send(queryOffline);
        }
        if (tAction === 'get' && tStreamer === 'game'){
            if(!queryGame.length){
                return message.channel.send(`we don't have that list yet`);
            }
            return message.channel.send(queryGame);
        }
        if (tAction === 'add') {
            if (queryStr.includes(tStreamer)) {
                console.log(`${tStreamer} is already in list`)
                return message.channel.send(`${tStreamer} is already in list`)
            } else {
                queryStr.push(tStreamer)
                console.log(`${tStreamer} added to list`)
                return message.channel.send(`${tStreamer} added to list`)
            }
        }
        if (tAction === 'remove'){
            if (queryStr.includes(tStreamer)) {
                queryStr.splice(queryStr.indexOf(tStreamer),1)

                if (queryOnline.includes(tStreamer)){
                    rIndex = queryOnline.indexOf(tStreamer)
                    queryGame.splice(rIndex, 1)  //removes record of last known game user was playing
                    queryOnline.splice(rIndex, 1)
                }
                else{
                    queryOffline.splice(queryOffline.indexOf(tStreamer))
                }
                console.log(`${tStreamer} removed from list`)
                return message.channel.send(`${tStreamer} removed from list`)
            } else {
                console.log(`${tStreamer} is not in list`)
                return message.channel.send(`${tStreamer} is not in list`)
            }
        }
        else{
            return message.channel.send(`provide valid argument`)
        }
    }
}
