const Enmap = require('enmap');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { customAlphabet } = require('nanoid')
require('moment-duration-format');
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  name: 'bean',
  description: '<User ID/@mention> <reason>',
  aliases: [],
  category: 'moderation',
  clientPermissions: [],
  userPermissions: [],
  run: async (client, msg, args) => {
    msg.delete({timeout: 3000});
    const warnsDB = new Enmap({ name: 'warns' });
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be in the moderation team to be able to use this command!');
    const validuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid user');
    const stateareason = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid reason to ban the user');
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const server = client.guilds.cache.get(serverID);
    if (!msg.member.roles.cache.has(staffrole)) {
      return msg
        .reply(Prohibited);
    }
    if (!msg.mentions.members && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]);
    }
    const toWarn = msg.mentions.users.first() || client.users.cache.get(args[0]);
    const moderator = msg.member;
    const Server = msg.member.guild.name;
    if (!toWarn) {
      return msg
        .reply(validuser);
    }
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = args.join(' ').replace(args[0], '').trim();
    if (!reason) {
      return msg
        .reply(stateareason);
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const emUser = new MessageEmbed()
      .setTitle('Beaned')
      .setAuthor('https://i.imgur.com/BSzzbNJ.jpg')
      .setColor('GREEN')
      .setDescription(`You were beaned from **${Server}** for ${reason}!`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Bean Appeal Link', '[Join Me]()');
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new MessageEmbed()
      .setDescription(`You have succesfully beaned **${toWarn.tag}**.`)
      .setColor('GREEN');
    return await msg.channel
      .send({ embeds: [emChan] });
  },
};
