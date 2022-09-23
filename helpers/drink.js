const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = async function drink(message) {
    const embed = new Discord.MessageEmbed();
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json());
    let directions = []
    for (let i = 1; i < 16; i++) {
        let ingredient = `strIngredient${i}`
        let measure = `strMeasure${i}`
        if (data.drinks[0][ingredient] != null) {
            let step = {
                ingredient: data.drinks[0][ingredient],
                measure:data.drinks[0][measure]
            }
            directions.push(step)
        }
    }

    embed.setColor('#005072')
    embed.setDescription(`..lets get drunk bruh`)
    embed.setTitle(data.drinks[0].strDrink)
    embed.setImage(data.drinks[0].strDrinkThumb)
    embed.setURL('https://www.thecocktaildb.com/drink.php?c=' + data.drinks[0].idDrink)
    embed.addFields(
        {
            name: 'Category?',
            value: data.drinks[0].strCategory
        }, 
        {
            name: 'Alcoholic?',
            value: data.drinks[0].strAlcoholic
        }, 
        {
            name: 'Glass?',
            value: data.drinks[0].strGlass
        },
        {
            name: 'Directions',
            value: data.drinks[0].strInstructions
        }

    );
    directions.forEach(val => {
        embed.addFields({
            name: val.ingredient,
            value: val.measure,
            inline: true
        })
    })
    message.channel.send(embed)
        .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
    console.log('Bot responded with: ' + data.drinks[0].strDrink);
}