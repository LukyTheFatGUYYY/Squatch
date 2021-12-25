require('dotenv').config({ path: './config/credentials.env' });
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
  intents: 32767, // every intents
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

//Dont touch these
const config = require('./config/main.json');

require('./events/_loader')(client).then(() => client.emit('commandsAndEventsLoaded', 1)); //Event Handler
const handler = fs.readdirSync("./handler").filter(file => file.endsWith('.js'));
const functions = fs.readdirSync("./functions").filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync("./commands");
(async () => {
	for (file of handler) {
		require(`./handler/${file}`)(client);
	}
	client.handleEvents(functions, "./functions");
	client.handleCommands(commandFolders, "./commands");

})();


client.login(process.env.TOKEN);
