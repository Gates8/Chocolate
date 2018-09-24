const Base = require("../Base/Base.js");

class Info extends Base {
  constructor (tom) {
    super(tom, {
      name: "info",
      description: "Gives some background info on the bot.",
      category: "Miscellaneous",
      usage: "info",
      aliases: ["i", "tominfo"],
      permLevel: "User"
    });
  }

  async run (message, level) {
    try{
      const mess = await message.author.send("You have requested info about this bot!!\nThe prefix \"tom\" is used because it is the name of the chocoholic from Spongebob.");
      //message.author.send(mess);
        }catch(e) {
      console.log(e.message);
    }
  }
}

module.exports = Info;
