const Base = require("../Base/Base.js");
const Discord = require("discord.js");
const cFortnite = require("fortnite");
const fortnite = new cFortnite(process.env.fortnite);

class Fortnite extends Base {
  constructor (tom) {
    super(tom, {
      name: "fortnite",
      description: "Allows you to look up Fortnite stats.",
      category: "Gaming",
      usage: "fortnite [user] [solo|duo|squad|lifetime] [xbox|pc|ps4]",
      aliases: ["fort"],
      permLevel: "User"
    });
  }

  async run (message, args){
    let tom = this.tom;
    let usage = "fortnite [user] [solo|duo|squad|lifetime] [xbox|pc|ps4]";
    //deletes the command
    await message.delete(2000);

    let cUser = message.author.id;
    let un = args[0];
    let gMode = args[1];
    let plat = args[2] || "pc";

    //cooldown so it does not go over the api restrictions
  /*  let cooldown = new Set();
    let cooldownSec = 5;

    if(cooldown.has(cUser)){
      message.delete()
      return message.reply("You have to wait 5 seconds between each lookup.");
    } else{
      //Add user to the cooldown set
      cooldown.add(cUser);
      //Setting Timeout function
      setTimeout(() => {
        cooldown.delete(cUser);
      }, cooldownSec * 1000)
    }
*/
    //just general checks
    if (!un) return message.reply(`provide a username.\n*Usage: ${usage}*`)
      .then(del => del.delete(8000))
      .catch(e => tom.logger.log(e.message, "error"));

    if(!gMode) return message.reply(`provide a game mode.\n*Usage: ${usage}*`)
      .then(del => del.delete(8000))
      .catch(e => tom.logger.log(e.message, "error"));

    let data = fortnite.user(un, plat)
      .then(data => {
        let stats = data.stats;
        //Getting each mode and displaying correct info.
        switch(gMode){
          case "solo":
            let solo = stats.solo;
            let score = solo.score;
            let matches = solo.matches;
            let kills = solo.kills;
            let kd = solo.kd;
            let wins = solo.wins;
            let top3 = solo.top_3;

            const soloEmbed = new Discord.RichEmbed()
              .setTitle(`Solo Fortnite Stats -- ${plat.toUpperCase()}`)
              .setAuthor(`${un}'s`)
              .setColor("#FFD700")
              .addField("Score",score,true)
              .addField("Matches Played",matches,true)
              .addField("Kills",kills,true)
              .addField("K/D ratio",`${kd}%`,true)
              .addField("Wins",wins,true)
              .addField("Times in Top 3",top3,true);
            message.channel.send(soloEmbed);
            break;
          case "duo":
            let duo = stats.duo;
            let dScore = duo.score;
            let dMatches = duo.matches;
            let dKills = duo.kills;
            let dKd = duo.kd;
            let dWins = duo.wins;
            let dTop3 = duo.top_3;

            const duoEmbed = new Discord.RichEmbed()
              .setTitle(`Duos Fortnite Stats -- ${plat.toUpperCase()}`)
              .setAuthor(`${un}'s`)
              .setColor("#FFD700")
              .addField("Score",dScore,true)
              .addField("Matches Played",dMatches,true)
              .addField("Kills",dKills,true)
              .addField("K/D ratio",`${dKd}%`,true)
              .addField("Wins",dWins,true)
              .addField("Times in Top 3",dTop3,true);
            message.channel.send(duoEmbed);
            break;
          case "squad":
            let squad = stats.squad;
            let sScore = squad.score;
            let sMatches = squad.matches;
            let sKills = squad.kills;
            let sKd = squad.kd;
            let sWins = squad.wins;
            let sTop3 = squad.top_3;

            const squadEmbed = new Discord.RichEmbed()
              .setTitle(`Squads Fortnite Stats -- ${plat.toUpperCase()}`)
              .setAuthor(`${un}'s`)
              .setColor("#FFD700")
              .addField("Score",sScore,true)
              .addField("Matches Played",sMatches,true)
              .addField("Kills",sKills,true)
              .addField("K/D ratio",`${sKd}%`,true)
              .addField("Wins",sWins,true)
              .addField("Times in Top 3",sTop3,true);
            message.channel.send(squadEmbed);
            break;
          case "lifetime":
            let life = stats.lifetime;
            let lScore = life[6]['Score'];
            let lMatches = life[7]['Matches Played'];
            let lWins = life[8]['Wins'];
            let lWinPer = life[9]["Win%"];
            let lKills = life[10]['Kills'];
            let lKd = life[11]['K/d'];

            const lifeEmbed = new Discord.RichEmbed()
              .setTitle(`Lifetime Fortnite Stats -- ${plat.toUpperCase()}`)
              .setAuthor(`${un}'s`)
              .setColor("#FFD700")
              .addField("Score",lScore,true)
              .addField("Matches Played",lMatches,true)
              .addField("Kills",lKills,true)
              .addField("K/D ratio",`${lKd}%`,true)
              .addField("Wins",lWins,true)
              .addField("Win %",lWinPer,true);
            message.channel.send(lifeEmbed);
            break;
          default:
            message.reply("Enter one of the following game modes: \n*solo|duo|squad|lifetime*");
        }

      });
  }
}

module.exports = Fortnite;
