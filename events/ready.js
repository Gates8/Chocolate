module.exports = class {
  constructor( tom ) {
    this.tom = tom;
  }

  async run () {

    await this.tom.wait(1000);

    //Getting the app info
    this.tom.appInfo = await this.tom.fetchApplication();
    setInterval( async () => {
      this.tom.appInfo = await this.tom.fetchApplication();
    }, 60000);

    //Checking if the default settings are laoded
    if (!this.tom.settings.has("default")) {
      if (!this.tom.config.defaultSettings) throw new Error("defaultSettings not present in config.js or settings db. Bot cannot load.");
      this.tom.settings.set("default", this.tom.config.defaultSettings);
    }

    //Setting the bots activity as help command.
    this.tom.user.setActivity(`${this.tom.settings.get("default").prefix} help | ${this.tom.guilds.size} Servers`);

    //Logging that the bot is ready to accept commands
    this.tom.logger.log(`${this.tom.user.tag}, ready to serve ${this.tom.users.size} users in ${this.tom.guilds.size} servers.`);
  }
};
