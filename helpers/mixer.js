const fetch = require('node-fetch');
const auth = require('../auth.json');
const { MessageEmbed } = require('discord.js');
const queryOnline = [];
const queryOffline = [];
const queryGame = [];


module.exports = async function mixer(client) {
    const mixerUser = ['shroud', 'ninja'];
    for(i = 0; i< mixerUser.length; i++) {
        const query = mixerUser[i]
        const data = await fetch(`https://mixer.com/api/v1/channels/${query}`).then(response => response.json());

        //IF data.online is false(user offline) and they are not in the offline array, add them to offline array)
        if (data.online === false && queryOffline.includes(query)===false) {
            queryOffline.push(query)
            if (queryOnline.includes(query) === true) { //if a user in this state was previously online, remove them from online array
                rIndex = queryOnline.indexOf(query)
                queryGame.splice(queryOnline.indexOf(query),1)  //removes record of last known game user was playing
                queryOnline.splice(rIndex, 1) // removes user from online, since they are offline
            }
        }

//If data returned(user online) and they are not in the online array, post the new content
        else if(data.online === true && queryOnline.includes(query)===false){
            const embed = new MessageEmbed()
                .setColor('#00eaff')
                .setDescription(`:red_circle: **${data.token} is currently live on Mixer!**`)
                .setTitle(data.name)
                .setURL(`https://mixer.com/${query}`)
                .setImage(data.type.coverUrl)
                .addFields(
                    {name: 'Streamer', value: data.token},
                    {name: 'Game', value: data.type.name},
                    {name: 'View Count', value: data.viewersCurrent}
                );
            client.channels.cache.find(channel => channel.name === 'twitch').send(embed);
            queryOnline.push(query)
            queryGame.push(data.type.id)
            //remove user from offline array since they are online
            if(queryOffline.includes(query)===true){
                rIndex = queryOffline.indexOf(query)
                queryOffline.splice(rIndex,1)
            }
            await new Promise(r => setTimeout(r, 50));
        }
        //user enters this loop if the stream remained online, but switched games
        else if(data.online === true && queryOnline.includes(query)===true && queryGame[queryOnline.indexOf(query)]!==data.type.id) {
            const embed = new MessageEmbed()
                .setColor('#00eaff')
                .setDescription(`:red_circle: **${data.token} is currently live on Mixer!**`)
                .setTitle(data.name)
                .setURL(`https://mixer.com/${query}`)
                .setImage(data.type.coverUrl)
                .addFields(
                    {name: 'Streamer', value: data.token},
                    {name: 'Game', value: data.type.name},
                    {name: 'View Count', value: data.viewersCurrent}
                );
            client.channels.cache.find(channel => channel.name === 'twitch').send(embed);
            queryGame[queryOnline.indexOf(query)] = data.type.id
        }
        else{ //IF user is in either array, and no status has changed, do nothing
            console.log('-')
        }

    }
    console.log('current time ' + new Date())
    console.log(queryOnline+' online - mixer')
    console.log(queryOffline+' offline - mixer')
    console.log(queryGame)
}
