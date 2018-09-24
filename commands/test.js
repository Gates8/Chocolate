const Command = require("../Base/Base.js");

class Test extends Command {
  constructor (tom) {
    super(tom, {
      name: "test",
      description: "Just a simple test message.",
      usage: "test",
      aliases: ["Test dummy"],
      permLevel: "Server Owner"
    });
  }

  async run (message, args, level){
    try{
      await message.channel.send("This is a test message.")
      .then (msg => msg.delete(5000))
      .catch(e => tom.logger.log(e.message));
    }
    catch(e) {
      console.log(e);
    }
  }
}
module.exports = Test;
