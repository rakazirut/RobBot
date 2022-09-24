const got = require("got");
const Discord = require("discord.js");

module.exports = function meme(message) {
  const embed = new Discord.MessageEmbed();
  got("https://meme-api.herokuapp.com/gimme")
    .then((response) => {
      let file = JSON.parse(response.body);
      embed.setColor("#220F38");
      embed.setTitle(file.title);
      embed.setURL(file.postLink);
      embed.setImage(file.url);
      embed.addFields({ name: "Subreddit", value: file.subreddit });
      message.channel
        .send(embed)
        .then((sent) => console.log(`Sent a reply to ${sent.author.username}`));
      console.log("Bot responded with: " + file.title);
    })
    .catch(console.error);
};
