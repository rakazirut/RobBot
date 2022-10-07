const getChatCommand = require("./helpers/getCommand.js");
// const createBlizzToken = require("./helpers/blizzardAuth.js");
const logger = require("winston");
const Discord = require("discord.js");
const cron = require("cron");
const auth = require("./auth.json");
const nba = require("./helpers/data/subreddits/nba.json");
const topStory = require("./helpers/topstory.js");

// Initalize the discord client instance
const client = new Discord.Client();

// initally created auth.blizzard_bearer_token on boot
createBlizzToken();

//------------------------Cron Jobs----------------------------------

// fires every day, at 00:00:00 and 11:00:00
let bAuthRegen = new cron.CronJob("0 0 0,11 * * *", () => {
  createBlizzToken();
});
bAuthRegen.start();

// Subreddit Top Stories - NBA - fires every day at 8:00am EST
let nbaCron = new cron.CronJob("0 12 * * *", () => {
  topStory(client, nba);
});
nbaCron.start();

//-------------------------------------------------------------------

// Client will connect
client.once("ready", () => {
  logger.info("Ready!");
});

// Configure logger settings
logger.add(new logger.transports.Console());

// client establishes connection and is listening for events/commands
client.on("ready", () => {
  logger.info("Connected as " + auth.discord_client_id);
  client.user.setActivity("!command", {
    type: "PLAYING",
  });
});

// Prefix to tell RobBot a command has been entered
const prefix = "!";

// if a command is entered, the bot will respond accordingly
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; //if the command is entered, but is not recognized  or is sent by the bot, do nothing
  const args = message.content.slice(prefix.length).split(/ +/); // split the ! from the command
  const command = args.shift().toLowerCase(); // convert the command to lower so we recognize commands regardless of how it was entered
  getChatCommand(args, command, message);
});

client.login(auth.token);
 