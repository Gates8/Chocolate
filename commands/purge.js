const Base = require("../Base/Base.js");

class Purge extends Base {
  constructor (tom) {
    super(tom, {
      name: "purge",
      description: "Purges a set amount of messages.",
      category: "System",
      usage: "purge [number < 100]",
      aliases: ["p", "del"],
      permLevel: "Moderator"
    });
  }

  async run (message, args, level) {
    //command = this.tom.commands.get(command)
    if (isNaN(args[0])) return message.channel.send("Use tom help purge to get a better understanding of the command.");
    if (args[0] > 100) return message.channel.send("Use tom help purge to get a better understanding of the command.");

    //Deletes message under count of 100, or under 14 days old
    message.channel.bulkDelete(args[0] + 1)
      .then (messages => message.channel.send(`Successfully deleted \`${messages.size}/${args[0]}\` messages.`))
        .then (delMsg => delMsg.delete(10000))
      .catch(e => tom.logger.log(e.message, "error"));
  }
}

module.exports = Purge;
