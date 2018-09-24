const Base = require("../Base/Base.js");
const Discord = require("discord.js");

class Level extends Base {
  constructor (tom) {
    super(tom, {
      name: "level",
      description: "Gives you your current User Level.",
      category: "User",
      usage: "level",
      aliases: ["l", "user", "userinfo"],
      permLevel: "User"
    });
  }

  async run (message, args, level) {
    let uLevel = this.tom.config.permLevels.find(l => l.level === level).name;
    let user = message.author;
    let lvlMsg = `Your curent permission level is \n*${level} - ${uLevel}*`;

    const lEmbed = new Discord.RichEmbed()
      .setTitle("Permission Level")
      .setColor("#0000FF")
      .setThumbnail(user.displayAvatarURL)
      .addField("User:", `${user.username}`)
      .addField("Permission Level:", `${lvlMsg}`)
    return message.channel.send(lEmbed);

  }
}

module.exports = Level;
