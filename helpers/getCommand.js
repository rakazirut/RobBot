const cat = require('./cat.js');
const auth = require('../auth.json');
const kanye = require('./kanye.js');
const urban = require('./urban.js');
const drink = require('./drink.js');
const com = require('./command.js');
const meme = require('./mymeme.js');
const bpt = require('./bpt.js');
const yt = require('./yt.js');
const remind = require('./remind.js');
const bbot = require('./bbot.js');
const d3 = require('./d3.js');
const daccount = require('./d3account.js');
const dhero = require('./d3hero.js');
const dhcl = require('./d3hcl.js');
const dsl = require('./d3skillList.js');
const dsd = require('./d3skillDetail.js');

module.exports = function getChatCommand(args, command, message) {
    // if a command is entered, the bot will respond accordingly
    switch (command) {
        case 'cat':
            cat(message);
            break;
        case 'tom':
            return message.channel.send('Hey Tom!');
        case 'rob':
            return message.channel.send('Hi Rob!');
        case 'connor':
            return message.channel.send('Sup Connor?');
        case 'goodbot':
            return message.channel.send(`Thanks, Dad! :slight_smile:`);
        case 'meme':
            meme(message);
            break;
        case 'badbot':
            bbot(message);
            break;
        case 'command':
            com(message);
            break;
        case 'drink':
            drink(message);
            break;
        case 'kanye':
            kanye(message);
            break;
        case 'bpt':
            bpt(message);
            break;
        case 'd3':
            d3(message);
            break;
        case 'remind':
            if (!args.length) {
                return message.channel.send('You need to supply seconds and reminder message!');
            }
            var query = args.join(' ');
            qStr = query.split(' ');
            remind(message, qStr);
            break;
        case 'yt':
            if (!args.length) {
                return message.channel.send('You need to supply search term!');
            }
            var query = args.join(' ');
            yt(message, query);
            break;
        case 'urban':
            if (!args.length) {
                return message.channel.send('You need to supply a search term!');
            }
            urban(message, args);
            break;
        case 'account':
            if (!args.length) {
                return message.channel.send('You need to supply a BattleTag! (ex: WhiskeyRomeo#1730)');
            }
            daccount(message, args, auth.blizzard_bearer_token);
            break;
        case 'hero':
            if (!args.length) {
                return message.channel.send('You need to supply a BattleTag and HeroName! (ex: !hero WhiskeyRomeo#1730 BackClapper)');
            }
            dhero(message, args, auth.blizzard_bearer_token);
            break;
        case 'hcl':
            if (!args.length) {
                return message.channel.send('You need to supply a BattleTag, HeroName, and Season! (ex: !hcl WhiskeyRomeo#1730 BackClapper 20)');
            }
            dhcl(message, args, auth.blizzard_bearer_token);
            break;
        case 'skill_detail':
            if (!args.length) {
                return message.channel.send('You need to supply a Class Type and Skill Name (ex: !skill_detail barbarian bash)');
            }
            dsd(message, args, auth.blizzard_bearer_token);
            break;
        case 'skill_list':
            if (!args.length) {
                return message.channel.send('You need to supply a Class Type (ex: !skill_list barbarian)');
            }
            dsl(message, args, auth.blizzard_bearer_token);
            break;
    }
};