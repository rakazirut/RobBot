module.exports = function remind(message, args) {
  var millis = args[0] * 1000;
  setTimeout(function two() {
    message.channel.send(`<@` + message.author.id + `> ` + args[1]);
  }, millis);
  return;
};
