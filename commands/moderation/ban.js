const moment = require('moment');
const Enmap = require('enmap');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { customAlphabet } = require('nanoid')
require('moment-duration-format');
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID, appeallink } = require('../../config/main.json');

module.exports = {
  name: 'ban',
  description: '<User ID/@mention> <reason>',
  aliases: [],
  category: 'moderation',
  clientPermissions: [],
  userPermissions: [],
  run: async (client, message, args, data) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const validuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid user');
    const stateareason = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid reason to ban the user');
    const cantbanyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant ban yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t ban that user due to role hierarchy');
    const warnsDB = new Enmap({ name: 'warns' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const server = client.guilds.cache.get(serverID);
    if (!message.member.roles.cache.has(staffrole)) return message.reply({ embeds: [Prohibited] });
    if (!message.mentions.members && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]);
    }
    const toWarn = message.mentions.users.first() || client.users.cache.get(args[0]);
    const moderator = message.member;
    if (!toWarn) return message.reply({ embeds: [validuser] });
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = args.join(' ').replace(args[0], '').trim();
    if (!reason) {
      return message.reply(
        stateareason,
      );
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) return message.reply({ embeds: [cantbanyourself] });
    if (
      server.members.cache.get(moderator.id).roles.highest.rawPosition
      <= (server.members.cache.get(toWarn.id)
        ? server.members.cache.get(toWarn.id).roles.highest.rawPosition
        : 0)
    ) {
      return message.reply(
        samerankorhigher,
      );
    }
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const em = new MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(banned) - ${reason}\``)
    await warnLogs.send({ embeds: [em] });
    const emUser = new MessageEmbed()
      .setTitle('Banned')
      .setColor('GREEN')
      .setAuthor('https://i.imgur.com/BSzzbNJ.jpg')
      .setDescription(`You were banned from **${server}** for ${reason}!`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Ban Appeal Server', `[Join Me](${appeallink})`);
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new MessageEmbed()
      .setDescription(`You have succesfully banned **${toWarn.tag}**.`)
      .setColor('GREEN');
    await message.channel.send({ embeds: [emChan] });
    warnsDB.set(
      toWarn.id,
      {
        moderator: moderator.id,
        reason: `(banned) - ${reason}`,
        date: moment(Date.now()).format('LL'),
      },
      `warns.${caseID}`,
    );
    return client.guilds.cache
      .get(serverID)
      .members.ban(toWarn, { reason });
  },
};
