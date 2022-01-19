require('dotenv').config({ path: './config/credentials.env' });
const Discord = require('discord.js');
const fs = require('fs');
const Nuggies = require('nuggies');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('database/database.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);

const client = new Discord.Client({
	intents: 32767, // every intents
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();


const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
	else client.on(event.name, (...args) => event.execute(client, ...args));
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

// these two lines of code stops your bot from crashing from certain errors :)
process.on("uncaughtException", error => console.error(error));
process.on("unhandledRejection", error => console.error(error));


const defaultGiveawayMessages = {
	dmWinner: true,
	giveaway: '🎉🎉 **GIVEAWAY!** 🎉🎉',
	giveawayDescription: '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): `{winners}`\n\nRequirements: {requirements}',
	endedGiveawayDescription: '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): {winners}',
	giveawayFooterImage: 'https://cdn.discordapp.com/emojis/843076397345144863.png',
	winMessage: 'congrats {winners}! you won `{prize}`!! Total `{totalParticipants}` members participated and your winning percentage was `{winPercentage}%`',
	rerolledMessage: 'Rerolled! {winner} is the new winner of the giveaway!', // only {winner} placeholder
	toParticipate: '**Click the Enter button to enter the giveaway!**',
	newParticipant: 'You have successfully entered for this giveaway! your win percentage is `{winPercentage}%` among `{totalParticipants}` other participants', // no placeholders | ephemeral
	alreadyParticipated: 'you already entered this giveaway!', // no placeholders | ephemeral
	noParticipants: 'There are not enough people in the giveaway!', // no placeholders
	noRole: 'You do not have the required role(s)\n{requiredRoles}\n for the giveaway!', // only {requiredRoles} | ephemeral
	dmMessage: 'You have won a giveaway in **{guildName}**!\nPrize: [{prize}]({giveawayURL})',
	noWinner: 'Not enough people participated in this giveaway.', // no {winner} placerholder
	alreadyEnded: 'The giveaway has already ended!', // no {winner} placeholder
	dropWin: '{winner} Won The Drop!!',
};

Nuggies.Messages(client, { giveawayOptions: defaultGiveawayMessages })
// Connect to the database
Nuggies.connect(""); // put the connection to mongodb here
Nuggies.handleInteractions(client)
Nuggies.giveaways.startAgain(client);


db.run(`CREATE TABLE IF NOT EXISTS userData(userId INTEGER, tag TEXT, username TEXT, ticketsOpenNow INTEGER, ticketsOpened INTEGER, messagesSent INTEGER)`);
db.run(`CREATE TABLE IF NOT EXISTS ticketData(channelId INTEGER, channelName TEXT, ticketId INTEGER, authorId INTEGER, guildId INTEGER, ticketType TEXT, opened TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS guildData(guildId INTEGER, ticketCount INTEGER, memberCount INEGER)`);

client.login(process.env.TOKEN);
