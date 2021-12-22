require('dotenv').config({ path: './config/credentials.env' });
const Discord = require('discord.js');
const fs = require('fs');
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const client = new Discord.Client({
  intents: 32767, // every intents
});


//Dont touch these
const config = require('./config/main.json');
require('./commands/_loader')(client.commands).then(() => client.emit('commandsAndEventsLoaded', 0));//Command handler


require('./events/_loader')(client).then(() => client.emit('commandsAndEventsLoaded', 1)); //Event Handler
//const handler = fs.readdirSync("./handler").filter(file => file.endsWith('.js'));
//const functions = fs.readdirSync("./functions").filter(file => file.endsWith('.js'));
//const commandFolders = fs.readdirSync("./commands");
//(async () => {
	//for (file of handler) {
		//require(`./handler/${file}`)(client);
	//}
	//client.handleEvents(functions, "./functions");
	//client.handleCommands(commandFolders, "./commands");

//})();

//Dont touch this
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

client.login(process.env.TOKEN);
