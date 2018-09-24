const Command = require("../Base/Base.js");

class Ping extends Command {
  constructor (tom) {
    super(tom, {
      name: "ping",
      description: "Latency and API response times.",
      usage: "ping",
      aliases: ["pong"]
    });
  }

  async run (message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send("🏓 Ping!");
      msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.tom.ping)}ms.)`);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Ping;
