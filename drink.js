const got = require('got');
const Discord = require('discord.js');

module.exports = function drink(message) {
    const embed = new Discord.MessageEmbed();
    got('https://www.thecocktaildb.com/api/json/v1/1/random.php').then(response => {
        let content = JSON.parse(response.body);
            embed.setColor('#005072')
            embed.setDescription(`..lets get drunk bruh`)
            embed.setTitle(content.drinks[0].strDrink)
            embed.setImage(content.drinks[0].strDrinkThumb)
            embed.setURL('https://www.thecocktaildb.com/drink.php?c='+content.drinks[0].idDrink)
            embed.addFields(
                    { name: 'Category?', value: content.drinks[0].strCategory },
                    { name: 'Alcoholic?', value: content.drinks[0].strAlcoholic },
                    { name: 'Glass?', value: content.drinks[0].strGlass }

                );
        message.channel.send(embed)
            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
        console.log('Bot responded with: ' + content.drinks[0].strDrink);
    }).catch(console.error);
}