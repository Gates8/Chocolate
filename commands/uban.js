const Base = require("../Base/Base.js");
const Discord = require("discord.js");

class Unban extends Base {
  constructor (tom) {
    super(tom, {
      name: "unban",
      description: "unans a specified user.",
      category: "Moderation",
      usage: "unban [user] [reason]",
      aliases: ["unbanish", "allow", "comeback"],
      permLevel: "Moderator"
    });
  }

  async run (message, args, level) {
    let tom = this.tom;
    let reason = args.slice(1).join(" ");
    let user = message.mentions.users;
    let modLog = message.guild.channels.find("name", "mod-log");
    let usage = "unban [user] [reason]";

    /*Initial checks for user, reason, mod channel, etc.*/

    //Mod Log Channel check
    if (!modLog) return message.reply(`Mod Log channel does not exist. You must create it.\n*Usage:${usage}*`)
      .then(delMsg => delMsg.delete(5000))
      .catch(e => tom.logger.log(e.message, "error"));

    //Permission Check
    if (!message.guild.member(tom.user).hasPermission("BAN_MEMBERS")) return message.reply("I do not have the correct permissions.")
      .then(delMsg => delMsg.delete(5000))
      .catch(e => tom.logger.log(e.message, "error"));

    //Username check
    if (user.size < 1) return message.reply(`You must mention a member to unban.\n*Usage:${usage}* `)
      .then(delMsg => delMsg.delete(5000))
      .catch(e => tom.logger.log(e.message, "error"));

    //Reason Check
    if (reason.length < 1) return message.reply(`You must supply a reason to unban a member.\n*Usage: ${usage}*`)
      .then(delMsg => delMsg.delete(5000))
      .catch(e => tom.logger.log(e.message, "error"));

    //Actually unban the user
    message.guild.member(user.first()).unban();

    //Sending to the mod-log for decency
    //Creating the RichEmbed to make the system look rad!!
    const embed = new Discord.RichEmbed()
      .setColor("#FFD700")
      .setTimestamp()
      .setThumbnail(user.first().displayAvatarURL)
      .addField("*Action:*", `Unbanned ${user.first()} from the server.`)
      .addField("*Reason:*", reason)
      .addField("*User:*", `${user.first().username}#${user.first().discriminator}`)
      .addField("*Moderator:*", `${message.author.username}#${message.author.discriminator}`)
    return tom.channels.get(modLog.id).send({ embed });

  }
}

module.exports = Unban;
