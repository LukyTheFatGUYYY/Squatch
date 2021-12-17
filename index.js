const mongoose = require('mongoose');
// const connection = mongoose.connect('link', {useNewUrlParser: true, useUnifiedTopology: true})
// Load environment variables (tokens, passwords, etc.)
require('dotenv').config({ path: './config/credentials.env' });
// Discord bot stuff
const Discord = require('discord.js');
const SQLite = require("better-sqlite3")
const sql = new SQLite('./mainDB.sqlite')

const client = new Discord.Client({
  intents: 32767, // every intents
});
const config = require('./config/main.json');

client.on("ready", () => {
  client.user.setActivity(`the server`, {type: 'WATCHING'});
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
const talkedRecently = new Map();
require('./events/_loader')(client).then(() => client.emit('commandsAndEventsLoaded', 1)); //Event Handler
require('./commands/_loader')(client.commands).then(() => client.emit('commandsAndEventsLoaded', 0));//Command handler

//on every message thats sent
client.on('messageCreate', async (message) => {
  if (
    !message.content.startsWith(config.prefix)
    || message.author.bot
    || message.webhookID
  ) { return; }
  const args = message.content.slice(config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const commandCategory = client.commands.find((category) => category.has(commandName));

  if (!commandCategory) {
    if (config.unknownCommandMessage) { message.channel.send(config.unknownCommandMessage); }
    return;
  }

  const command = commandCategory.find((command) => command.name === commandName || command.aliases && command.aliases.includes(commandName));
  try {
    let erroredUsage = false;
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.channel.send(
        ':x: This command can only be used in a server!',
      );
    }

    if (
      command.userPermissions
      && !message.member.permissions.has(command.userPermissions)
    ) {
      return message.channel.send(
        `:x: You don\'t have the required permissions to run this command.\nRequired permissions: ${command.userPermissions
          .map((el) => `\`${el}\``)
          .join(', ')}`,
      );
    }
    if (
      command.clientPermissions
      && !message.guild.me.permissions.has(command.clientPermissions)
    ) {
      return message.channel.send(
        `:x: To run that command I need the following permission(s): ${command.clientPermissions
          .map((el) => `\`${el}\``)
          .join(', ')}`,
      );
    }
    if (command.args && args.length < command.args) {
      message.channel.send(
        `:x: This command requires ${command.args} arguments.`,
      );
      erroredUsage = true;
    }

    message.reply = (ct) => {
      if (typeof ct !== 'object' && ct !== null) {
        return message.channel.send(`<@!${message.author.id}>\n`, ct);
      }
      return message.channel.send({
        content: `<@!${message.author.id}>`,
        embeds: [ct],
      });
    };

    if (erroredUsage && command.usage) {
      return message.channel.send(
        `Correct usage: ${config.prefix}${command.name} ${command.usage}`,
      );
    }
    command.run(client, message, args, { config, db: {} });
  } catch (err) {
    message.channel
      .send(`:x: An error occured while running that command. Please contact 
\`${client.users.cache.get('892083694829994046').tag}\`.`);
    console.error(err);
  }
});



const levelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'levels';").get();
if (!levelTable['count(*)']) {
  sql.prepare("CREATE TABLE levels (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER, totalXP INTEGER);").run();
}

client.getLevel = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
client.setLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP);");
// Role table for levels
const roleTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roles';").get();
if (!roleTable['count(*)']) {
  sql.prepare("CREATE TABLE roles (guildID TEXT, roleID TEXT, level INTEGER);").run();
}
// Settings table
const settingsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'settings';").get();
if (!settingsTable['count(*)']) {
  sql.prepare("CREATE TABLE settings (guild TEXT PRIMARY KEY, levelUpMessage TEXT, customXP INTEGER, customCooldown INTEGER);").run();
}

const channelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channel';").get();
if (!channelTable['count(*)']) {
  sql.prepare("CREATE TABLE channel (guild TEXT PRIMARY KEY, channel TEXT);").run();
}


// RankCard table (WORK IN PROGRESS, STILL IN THE WORKS)
// const rankCardTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'rankCardTable';").get();
// if (!rankCardTable['count(*)']) {
// sql.prepare("CREATE TABLE rankCardTable (id TEXT PRIMARY KEY, user TEXT, guild TEXT, image BLOB, fontColor TEXT, barColor TEXT, overlay TEXT);").run();
// }

// XP Messages 
client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  // get level and set level
  const level = client.getLevel.get(message.author.id, message.guild.id)
  if (!level) {
    let insertLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (?,?,?,?,?,?);");
    insertLevel.run(`${message.author.id}-${message.guild.id}`, message.author.id, message.guild.id, 0, 0, 0)
    return;
  }
  let customSettings = sql.prepare("SELECT * FROM settings WHERE guild = ?").get(message.guild.id);
  let channelLevel = sql.prepare("SELECT * FROM channel WHERE guild = ?").get(message.guild.id);
  const lvl = level.level;
  let getXpfromDB;
  let getCooldownfromDB;

  if (!customSettings) {
    getXpfromDB = 16; // Default
    getCooldownfromDB = 1000;
  } else {
    getXpfromDB = customSettings.customXP;
    getCooldownfromDB = customSettings.customCooldown;
  }

  // xp system
  const generatedXp = Math.floor(Math.random() * getXpfromDB);
  const nextXP = level.level * 2 * 250 + 250
  // message content or characters length has to be more than 4 characters also cooldown
  if (talkedRecently.get(message.author.id)) {
    return;
  } else { // cooldown is 10 seconds
    level.xp += generatedXp;
    level.totalXP += generatedXp;


    // level up!
    if (level.xp >= nextXP) {
      level.xp = 0;
      level.level += 1;

      let levelUpMsg;
      let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("PURPLE")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))

      if (!customSettings) {
        embed.setDescription(`**Congratulations** ${message.author}! You have now leveled up to **level ${level.level}**`);
        levelUpMsg = `**Congratulations** ${message.author}! You have now leveled up to **level ${level.level}**`;
      } else {
        function antonymsLevelUp(string) {
          return string
            .replace(/{member}/i, `${message.member}`)
            .replace(/{xp}/i, `${level.xp}`)
            .replace(/{level}/i, `${level.level}`)
        }
        embed.setDescription(antonymsLevelUp(customSettings.levelUpMessage.toString()));
        levelUpMsg = antonymsLevelUp(customSettings.levelUpMessage.toString());
      }
      // using try catch if bot have perms to send EMBED_LINKS      
      try {
        if (!channelLevel || channelLevel.channel == "Default") {
          message.channel.send({ embeds: [embed] });
        } else {
          let channel = message.guild.channels.cache.get(channelLevel.channel)
          const permissionFlags = channel.permissionsFor(message.guild.me);
          if (!permissionFlags.has("SEND_MESSAGES") || !permissionFlags.has("VIEW_CHANNEL")) return;
          channel.send(embed);
        }
      } catch (err) {
        if (!channelLevel || channelLevel.channel == "Default") {
          message.channel.send(levelUpMsg);
        } else {
          let channel = message.guild.channels.cache.get(channelLevel.channel)
          const permissionFlags = channel.permissionsFor(message.guild.me);
          if (!permissionFlags.has("SEND_MESSAGES") || !permissionFlags.has("VIEW_CHANNEL")) return;
          channel.send(levelUpMsg);
        }
      }
    };
    client.setLevel.run(level);
    // add cooldown to user
    talkedRecently.set(message.author.id, Date.now() + getCooldownfromDB);
    setTimeout(() => talkedRecently.delete(message.author.id, Date.now() + getCooldownfromDB))
  }
  // level up, time to add level roles
  const member = message.member;
  let Roles = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND level = ?")

  let roles = Roles.get(message.guild.id, lvl)
  if (!roles) return;
  if (lvl >= roles.level) {
    if (roles) {
      if (member.roles.cache.get(roles.roleID)) {
        return;
      }
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return
      }
      member.roles.add(roles.roleID);
    }
  }
})


client.login(process.env.TOKEN);
