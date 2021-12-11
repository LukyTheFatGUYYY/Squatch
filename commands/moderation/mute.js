const moment = require('moment');
const Enmap = require('enmap');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { customAlphabet } = require('nanoid')
require('moment-duration-format');
const {
  staffrole
} = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID, Appealserver } = require('../../config/main.json');

module.exports = {
  name: 'mute',
  category: 'moderation',
  aliases: [],
  usage: '<User ID/@mention> <duration (seconds)> <reason>',
  description: 'Mute a member',
  run: async (client, message, args, data) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor("RED")
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
      .setDescription('Mention a valid reason to mute the user');
    const cantmuteyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant mute yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t mute that user due to role hierarchy');
    const durationtime = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        'How long would you like to mute the user for (write 0 if you wish to permanently mute the user)',
      );
    const warnsDB = new Enmap({ name: 'warns' });
    const mutedDB = new Enmap({ name: 'mutes' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const server = client.guilds.cache.get(serverID);
    if (!message.member.roles.cache.has(staffrole)) {
      return message
        .reply({ embeds: [Prohibited] });
    }
    const toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const moderator = message.member;
    if (!toWarn) {
      return message
        .reply({ embeds: [validuser] });
    }
    warnsDB.ensure(toWarn.id, { warns: {} });
    mutedDB.ensure(toWarn.id, {
      roles: [], duration: 0, mutedAt: 0, id: 0,
    });
    let duration = args[1];
    if (!duration) {
      return message
        .reply({ embeds: [durationtime] });
    }
    if (!/^\d+$/.test(duration)) {
      return message
        .reply({ embeds: [durationtime] })
        .then((d) => d.delete({ timeout: 5000 }))
        .then(message.delete({ timeout: 2000 }));
    }
    if (duration == '0') duration = '100000000000';
    let reason = args
      .join(' ')
      .replace(args[0], '')
      .replace(args[1], '')
      .trim();
    if (!reason) {
      return message
        .reply({ embeds: [stateareason] });
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) return message.reply({ embeds: [cantmuteyourself] });
    if (
      server.member(moderator.id).roles.highest.rawPosition
      <= (server.member(toWarn.id)
        ? server.member(toWarn.id).roles.highest.rawPosition
        : 0)
    ) {
      return message
        .reply({ embeds: [samerankorhigher] });
    }
    const warnLogs = server.channels.cache.get(channelLog);
    mutedDB.set(toWarn.id, {
      roles: message.guild
        .member(toWarn.id)
        .roles.cache.array()
        .filter(
          (r) => r.id != '720661480143454340' && r.id != '757759707674050591',
        )
        .map((r) => r.id),
      duration: duration * 1000,
      mutedAt: Date.now(),
      id: toWarn.id,
    });
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const em = new MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('ORANGE')
      .addField('Member', `${toWarn.user.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(muted) - ${reason}\``)
      .addField(
        'Duration',
        moment
          .duration(duration, 'seconds')
          .format('d [days], h [hours], m [minutes] [and] s [seconds]'),
      )
      .setFooter(`By: ${moderator.user.tag} (${moderator.id})`)
    await warnLogs.send({ embeds: [em] });
    const emUser = new MessageEmbed()
      .setTitle('Muted')
      .setColor('ORANGE')
      .setAuthor('https://i.imgur.com/wNUUjmG.png')
      .setDescription(
        `You were muted in **${server}** for ${reason}, please don't do it again!`,
      )
      .addField(
        'Duration',
        moment
          .duration(duration, 'seconds')
          .format('d [days], h [hours], m [minutes] [and] s [seconds]'),
      )
      .addField('Case ID', `\`${caseID}\``)
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new MessageEmbed()
      .setDescription(`You have succesfully muted **${toWarn.user.tag}**.`)
      .setColor('ORANGE')
    await message.channel
      .send({ embeds: [emChan] });
    warnsDB.set(
      toWarn.id,
      {
        moderator: moderator.id,
        reason: `(muted) - ${reason}`,
        date: moment(Date.now()).format('LL'),
      },
      `warns.${caseID}`,
    );
    return message.guild.member(toWarn.id).roles.set(['795934921717710879']);
  },
};
