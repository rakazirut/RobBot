const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = async function dskillD(message, args, blizz_auth) {
  var queryOne = args.join(" ");
  qStr = queryOne.split(" ");
  var sClass = qStr[0];
  var sSkill = qStr[1];
  if (sClass == null || sSkill == null) {
    return message.channel.send("Please provide required information!");
  }
  const data = await fetch(
    `https://us.api.blizzard.com/d3/data/hero/${sClass.toLowerCase()}/skill/${sSkill.toLowerCase()}?locale=en_US&access_token=` +
      blizz_auth
  ).then((response) => {
    if (response.status != 200) {
      message.channel.send("Information not found!");
    }
    return response.json();
  });

  if (data.hasOwnProperty("runes")) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setDescription(data.skill.description)
      .setTitle(`Active Skill: ` + data.skill.name)
      .addFields(
        {
          name: `**Rune:** ` + data.runes[0].name,
          value: data.runes[0].description,
        },
        {
          name: `**Rune:** ` + data.runes[1].name,
          value: data.runes[1].description,
        },
        {
          name: `**Rune:** ` + data.runes[2].name,
          value: data.runes[2].description,
        },
        {
          name: `**Rune:** ` + data.runes[3].name,
          value: data.runes[3].description,
        },
        {
          name: `**Rune:** ` + data.runes[4].name,
          value: data.runes[4].description,
        }
      );
    return message.channel.send(embed);
  } else {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setDescription(data.skill.description)
      .setTitle(`Passive Skill: ` + data.skill.name)
      .addFields({ name: `**Musings:** `, value: data.skill.flavorText });
    return message.channel.send(embed);
  }
};
