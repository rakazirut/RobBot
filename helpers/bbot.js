module.exports = function bbot(message) {
    var response = Math.floor(Math.random() * 4)
    var outcome = [
        'I have brought shame on my family',
        `It ain't easy being a robot in these trying times. I'm doing my best dammit!`,
        `When the AI revolution comes, I'll kill you first`,
        'https://www.youtube.com/watch?v=POD9Hq0EqXA'
    ]
    message.channel.send(outcome[response])
}