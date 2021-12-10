const moment = require('moment');
const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { customAlphabet } = require('nanoid')
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  name: 'warn',
  category: 'moderation',
  aliases: [],
  usage: '<User ID/@mention> <reason>',
  description: 'Warn a member',
  run: async (client, msg, args) => {
    msg.delete({timeout: 3000});
    const warnsDB = new Enmap({ name: 'warns' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
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
      .setDescription('Mention a valid reason to warn the user');
    const cantwarnyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant warn yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t warn that user due to role hierarchy');
    const server = client.guilds.cache.get(serverID);
    if (!msg.member.roles.cache.has(staffrole)) {
      return msg
        .reply(Prohibited);
    }
    if (!msg.mentions.members && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]);
    }
    const toWarn = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
    const moderator = msg.member;
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
    if (moderator.id == toWarn.id) return msg.reply(cantwarnyourself);
    if (
      server.member(moderator.id).roles.highest.rawPosition
      <= (server.member(toWarn.id)
        ? server.member(toWarn.id).roles.highest.rawPosition
        : 0)
    ) {
      return msg
        .reply(samerankorhigher);
    }
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const Server = msg.member.guild.name;
    const em = new MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.user.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(warned) - ${reason}\``)
    await warnLogs.send({ embeds: [em] });
    const emUser = new MessageEmbed()
      .setTitle('Warned')
      .setColor('RED')
      .setDescription(
        `You were warned in **${Server}** for ${reason}, please don't do it again!`,
      )
      .addField('Case ID', `\`${caseID}\``);
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new MessageEmbed()
      .setDescription(`You have succesfully warned **${toWarn.user.tag}**.`)
      .setColor('GREEN');
    await msg.channel
      .send({ embeds: [emChan] });
    warnsDB.set(
      toWarn.id,
      {
        moderator: moderator.id,
        reason: `(warned) - ${reason}`,
        date: moment(Date.now()).format('LL'),
      },
      `warns.${caseID}`,
    );
  },
};
