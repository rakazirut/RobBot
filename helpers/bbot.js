module.exports = function bbot(message) {
    var response = Math.floor(Math.random() * 4)

    if (response === 0) {
        message.channel.send('I have brought shame on my family')
    }

    if (response === 1)
        message.channel.send("It ain't easy being a robot in these trying times. I'm doing my best dammit!")

    if (response === 2)
        message.channel.send("When the AI revolution comes, I'll kill you first")

    if (response === 3)
        message.channel.send("https://www.youtube.com/watch?v=POD9Hq0EqXA")

}