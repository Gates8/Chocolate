class Base {
  constructor(tom, {
    name= null,
    description= "none",
    category= "Miscellaneous",
    usage= "none",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = "User"
  }) {
    this.tom = tom;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage};
  }
}

module.exports = Base;
