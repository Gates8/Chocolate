/* Message handler to actually detect the prefix and such */

module.exports = class {
  constructor (tom) {
    this.tom = tom;
  }


async run (message) {
  //Checking the bot against other and itself
  if (message.author.bot) return;

  //Cancelling attempts if the bot cannot communicate
  if (!message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;


  //getting settings for the server.0
  const settings = message.guild ? this.tom.getSettings(message.guild.id) : this.tom.settings.get("default");

  message.settings = settings;

  //Checking for the prefix
  const prefixMention = new RegExp(`^@!?${this.tom.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My current prefix is: \`${settings.prefix}\``);
  }

  //Ignoring messages that do not start with the prefix.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  //Separating commands and arguments
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //Checking if the member is invisible or not on the guild and fetching them.
  if (message.guild && !message.member) await message.guild.fetchMember(message.author);

  //Getting the user's permission level.
  const level = this.tom.permLevel(message);

  //Checking if the command actually exists.
  const cmd = this.tom.commands.get(command) || this.tom.commands.get(this.tom.aliases.get(command));
  if (!cmd) return;//If command does not exist, returns

  //Checking if a command is guildOnly or not a.k.a able to be used in DMs
  if (cmd && !message.guild && cmd.conf.guildOnly) {
    return message.channel.send("This command is unavailable via PM. Please run in a guild");
  }

  //Checking the perm level of the user running the command.
  if (level < this.tom.levelCache[cmd.conf.permLevel]){
    if (settings.systemNotice == "true") {
      return message.channel.send(`You do not have permission to use this command.
        Your permission level is: ${level} (${this.tom.config.permLevels.find(l => l.level === level).name})
        This command requires level: ${this.tom.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }
  //to be deprecated
  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }

  this.tom.logger.log(`${this.tom.config.permLevels.find(l => l.level === level).name} ${message.author.username}
  (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

  //running el commando
  cmd.run(message, args, level);
  }
};
