const got = require("got");
const Discord = require("discord.js");

module.exports = async function topStory(client, subredditInfo) {
  const embed = new Discord.MessageEmbed();
  let headlines = [];
  got(subredditInfo.subRedditUrlTop + "?limit=" + subredditInfo.postLimit).then(
    (response) => {
      let content = JSON.parse(response.body);
      let charLim = 225;

      for (let i = 0; i < subredditInfo.postLimit; i++) {
        let title = content.data.children[i].data.title;
        if (title.length >= charLim) {
          title = title.substring(0, charLim) + "...";
        }
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
      embed.setTitle(subredditInfo.embeddedTitle);
      embed.setURL(subredditInfo.embeddedURL);
      embed.setDescription(
        subredditInfo.embeddedDescription + `${new Date().toDateString()}`
      );

      headlines.forEach((story, i) => {
        embed.addFields({
          name: `${i + 1}: ${story.title}`,
          value: `\n\n**[Link to post](${story.url})** \n👍 ${story.upvotes} 👎 ${story.downvotes} 💬 ${story.numComments}`,
        });
      });

      client.channels.fetch(subredditInfo.channelID).then((channel) => {
        channel.send(embed);
      });
    }
  );
};
