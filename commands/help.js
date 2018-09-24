const Base = require("../Base/Base.js");

/*
  The HELP command is used to display every command's name and description
  to the user, so that he may see what commands are available. The help
  command is also filtered by level, so if a user does not have access to
  a command, it is not shown to them. If a command name is given with the
  help command, its extended help is shown.
*/
class Help extends Base {
  constructor (tom) {
    super(tom, {
      name: "help",
      description: "Displays all the available commands for you.",
      category: "System",
      usage: "help [command]",
      aliases: ["h", "halp"],
      permLevel: "User"
    });
  }

  async run (message, args, level) {
    // If no specific command is called, show all filtered commands.
    if (!args[0]) {
      // Load guild settings (for prefixes and eventually per-guild tweaks)
      const settings = message.settings;

      // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
      const myCommands = message.guild ? this.tom.commands.filter(cmd => this.tom.levelCache[cmd.conf.permLevel] <= level) : this.tom.commands.filter(cmd => this.tom.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

      // Here we have to get the command names only, and we use that array to get the longest name.
      // This make the help commands "aligned" in the output.
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = "";
      let output = `= Command List =\n\n[Use ${this.tom.config.defaultSettings.prefix} help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${settings.prefix} ${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      message.author.send(output, {code:"asciidoc", split: { char: "\u200b" }});
      message.channel.send(`${message.author} check your DMs!`)
        .then(delMsg => delMsg.delete(10000));
    } else {
      // Show individual command's help.
      let command = args[0];
      if (this.tom.commands.has(command)) {
        command = this.tom.commands.get(command);
        if (level < this.tom.levelCache[command.conf.permLevel]) return;
        message.author.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}`, {code:"asciidoc"});
      }
    }
  }
}

module.exports = Help;