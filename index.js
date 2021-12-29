require('dotenv').config({ path: './config/credentials.env' });
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
	intents: 32767, // every intents
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();


const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);

	if (event.once) client.once(event.name, (...args) => event.execute(client, args));
	else client.on(event.name, (...args) => event.execute(client, args));
}



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
