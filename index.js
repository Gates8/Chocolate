/*This is version 2 of Chocolate Bot. I am rewriting the init file to
be smarter and more efficient*/

//Loading things we need
const { Client, Collection } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

//SQL database stuff
const Enmap = require("enmap");
const EnmapSQLite = require("enmap-sqlite");

//file read stuff
const klaw = require("klaw");
const path = require("path");

/*This class is basically building the client functionality. As it stands, it currently
can load/unload a command, check permissions, and also read/write settings.*/
class Choco extends Client {
  constructor (options){
    super(options);

    //Config file contains bot token, prefix, author, author id, etc.
    this.config = require("./settings.js");

    //Putting the commands and alias into collections so they can be
    //catalouged
    this.commands = new Collection();
    this.aliases = new Collection();

    this.settings = new Enmap({ provider: new EnmapSQLite({ name: "settings" })});

    //adding some console logging
    this.logger = require ("./modules/Logger");
  }

  /*Now -- for some fucking permission level handling so you
  twats can't go rampant with this fucking thing*/

  permLevel (message) {
    let permlevel = 0;

    /*This thing here sorts the permission levels so it knows EXACTLY what your
      social status is. Actual, meaningful, comment: returns 1 if true, returns
      -1 if false.*/
    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while(permOrder.length) {
      const currentLevel = permOrder.shift();
      if(message.guild && currentLevel.guildOnly) continue;
      if(currentLevel.check(message)){
        permlevel = currentLevel.level;
        break;
      }
    }
    return permlevel;
  }

  /*Command Loader!@!@!@!@ So this thing will actually fucking do something!
  This allows for the loading and unloading of commands more efficiently.
  YAY EFFICIENCY*/

  loadCommand ( commandPath, commandName ){
    try{
      const properties = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      properties.conf.location = commandPath;
      if (properties.init) {
        properties.init(this);
      }
      //Setting the command name and handling aliases
      this.commands.set(properties.help.name, properties);
      properties.conf.aliases.forEach(alias => {
        this.aliases.set(alias, properties.help.name);
      });
      return false;
    }
    catch(e){
      return `Unable to load command ${commandName}: ${e}`;
    };
  }

async unloadCommand( commandPath, commandName ){
    let command;
    // Checking if the command exists by name and alias
    if(this.commands.has(commandName)) {
      command = this.commands.get(commandName);
      } else if (this.aliases.has(commandName)) {
        command = this.commands.get(this.aliases.get(commandName));
      }

    if (!command) return `The command \`${commandName}\` doesn't exist, nor does it have an alias.`;

    if (command.shutdown) {
      await command.shutdown(this);
      }

    //deleting command cache
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false
  }

/*Getting/wiritng settings
get settings based on the key value id.*/
getSettings(id) {
  //Allows for loading the default settings.
  const defaults = this.settings.get("default");
  let guild = this.settings.get(id);

  if (typeof guild != "object") guild = {};
  const returnObject = {};

  Object.keys(defaults).forEach((key) => {
    returnObject[key] = guild[key] ? guild[key] : defaults[key];
  });

  return returnObject;

  }

writeSettings(id, newSett) {
  const defaults = this.settings.get("default");
  let settings = this.settings.get(id);

  if (typeof settings != "object") settings = {};
  for (const key in newSett){
    if (defaults[key] !== newSett[key]){
      settings[key] = newSett[key];
      }
    else{
      delete settings[key];
      }
    }
  //Actually writing the settings!
  this.settings.set(id, settings);
  }
}

/* This is where the client is given a name and we start doing stuff with it. */
//Tom the Chocoholic
const tom = new Choco();//CLIENTY THING
console.log(tom.config.permLevels.map(p => `${p.level} : ${p.name}`));

//Getting el loggero
require("./modules/Logger");

//Getting the helper functions
require("./modules/functions.js")(tom);

/* Beginning the init function so we can begin loading commands into memoryyyy*/

const init = async () => {
  /* Using klaw (walk) to go through the commands directory and load them into
  memory*/
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if(!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = tom.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) tom.logger.error(response);
    tom.logger.log(`Loaded command: ${cmdFile.name}`);
  });


  /*Event loading in progresss*/

  const evtFiles = await readdir("./events");
  tom.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    tom.logger.log(`Loading event: ${eventName}`);
    //getting and loading events
    const event = new (require(`./events/${file}`))(tom);
    //turning on the events
    tom.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  })


  //Getting a command count
  const cmdFileCount = await readdir("./commands")
  tom.logger.log(`Loading a total of ${cmdFileCount.length} commands.`, "log")

  //Caching the permissions
  tom.levelCache = {};
  for (let i = 0; i < tom.config.permLevels.length; i++){
    const thisLevel = tom.config.permLevels[i];
    tom.levelCache[thisLevel.name] = thisLevel.level;
  }


  /*Finally, logging the bot onto the server!!!!*/
  tom.login(process.env.token);

};

//Main initialization!
init();

tom.on("disconnect", () => tom.logger.warn("Tom is disconnecting..."))
  .on("connect", () => tom.logger.log("Tom has connected successfuly", "log"))
  .on("reconnect", () => tom.logger.log("Tom is reconnecting with reality....", "log"))
  .on("error", e => tom.logger.error(e))
  .on("warn", info => tom.logger.warn(info));
tom.logger.log(`Succesfully acquired some Chocolate\nConnected to: ${tom.user}`);
