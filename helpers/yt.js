const fetch = require('node-fetch');
const auth = require('../auth.json');
module.exports = async function yt(message, args){
    const data = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${args}&key=` + auth.google_api_key
    ).then(response => response.json());
    var vid_id = data.items[0].id.videoId
    return message.channel.send(`https://www.youtube.com/watch?v=${vid_id}`)
}