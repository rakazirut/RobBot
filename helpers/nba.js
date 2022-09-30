const got = require("got");
const Discord = require("discord.js");

module.exports = async function nba(message) {
  const embed = new Discord.MessageEmbed();
  const attachment = new Discord.MessageAttachment('./resources/nba_reddit.png', 'nba_reddit.png');
  let headlines = [];
  got("https://www.reddit.com/r/nba/top/.json?limit=5").then((response) => {
    let content = JSON.parse(response.body);

    for (let i = 0; i < 5; i++) {
      let title = content.data.children[i].data.title;
      let link = content.data.children[i].data.permalink;
      let url = `https://reddit.com${link}`;
      let upvotes = content.data.children[i].data.ups;
      let downvotes = content.data.children[i].data.downs;
      let numComments = content.data.children[i].data.num_comments;
      let story = {
        title: title,
        url: url,
        upvotes: upvotes,
        downvotes: downvotes,
        numComments: numComments,
      };
      headlines.push(story);
    }
    embed.setTitle(`NBA Top Posts`);
    embed.setURL("https://www.reddit.com/r/nba");
    embed.setDescription(`Top NBA Posts from ${new Date().toDateString()}`);
    embed.attachFiles(attachment)
    embed.setThumbnail('attachment://nba_reddit.png');

    headlines.forEach((story, i) => {
      embed.addFields({
        name: `${i+1}: ${story.title}`,
        value: `\n\n**[Link to post](${story.url})** \n👍 ${story.upvotes} 👎 ${story.downvotes} 💬 ${story.numComments}`,
      });
    });

    message.channel
      .send(embed)
      .then((sent) => console.log(`Sent a reply to ${sent.author.username}`));
    console.log("Bot responded with: ");
  });
};
