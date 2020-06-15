
const auth = require('../auth.json');
module.exports = function remind(message, args){
    // date = new Date()
    // dtRemind = new Date()
    // dtRemind.setSeconds( dtRemind.getSeconds() + args[0] );
    var millis = args[0] * 1000
    setTimeout(function two() {message.channel.send(`<@` + message.author.id + `> `+args[1]);}, millis);
    return
}