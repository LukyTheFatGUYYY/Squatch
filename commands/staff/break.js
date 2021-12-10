const Enmap = require('enmap');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
require('moment-duration-format');
const { staffrole, adminrole, breakrole } = require('../../config/constants/roles.json');
const { serverID } = require('../../config/main.json');
const { requestbreak } = require('../../config/constants/channel.json');

module.exports = {
  name: 'break',
  description: 'Staff breaks',
  aliases: [],
  category: 'staff',
  clientPermissions: [],
  userPermissions: [],
  run: (client, message, data) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be a staff member to use this command!');
    const stateatime = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please state for how long you will be on break (e.g 2Days)');
    const stateareason = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please state why you are going on break (e.g "I have to learn for a test")');
    const successfullyenteredit = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success!')
      .setDescription('Your break request has been added to the queue, please wait for it be approved before actually going on break!');
    const alreadyononemate = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You are already on break or got one pending, please end your break first or wait for it to be approved or denied!');
    const statewhojesus = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription("I'd appreciate it if you'd tell me who's break you want to approve...");
    const idisincorrectjesuschrist = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('The ID you submitted either is not in the database or is not pending a break approval!');
    const statewhotodenyjesus = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription("I'd appreciate it if you'd tell me who's break you want to deny...");
    const idisincorrectdenyjesuschrist = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('The ID you submitted either is not in the database or is not pending a break approval!');
    const youarentonabreak = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You are not currently on break!');
    const iendedyourbreak = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Welcome back!')
      .setDescription('I have ended your break, welcome back!');
    const usageonthiscommand123 = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Request a break')
      .setDescription('Request <time (no spaces: 2days)> <reason (away from home on vacation)>');
    const youhavetobeinacertainchannelpatternup = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(`I'm sorry but you have to be in <#${requestbreak}> to use this!`);
    if (!staffrole) return message.reply(Prohibited).then((d) => d.delete({ timeout: 7000 })).then(message.delete({ timeout: 3000 }));
    if (!adminrole && message.channel.id != requestbreak) return message.reply(youhavetobeinacertainchannelpatternup).then((d) => d.delete({ timeout: 7000 })).then(message.delete({ timeout: 3000 }));
    const breaksDB = new Enmap({ name: 'breaks' });
    breaksDB.ensure(message.author.id, {
      ID: message.author.id, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A',
    });
    const action = args[0];
    const requestedAt = Date.now();
    const duration = args[1];
    const reason = args.slice(2);
    const breakRole = client.guilds.cache.get(serverID).roles.cache.get(breakrole);
    const breakQueue = client.channels.cache.get(requestbreak);
    if (action && action == 'request') {
      if (breaksDB.get(message.author.id).status == 'N/A') {
        if (!duration) return message.reply(stateatime).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
        if (reason.length < 2) return message.reply(stateareason).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
        breaksDB.set(message.author.id, {
          ID: message.author.id, requestedAt, status: 'pending', reason: reason.join(' '), duration,
        });
        message.reply(successfullyenteredit).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
        const em = new MessageEmbed()
          .setTitle(`${message.author.username}'s Break Request`)
          .addField('Duration:', duration)
          .addField('Reason:', reason.join(' '))
          .setFooter(`${message.author.username}'s ID: ${message.author.id}`);
        return breakQueue.send({ embeds: [em] });
      }
      return message.reply(alreadyononemate).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
    } if (action && action == 'approve' && adminrole) {
      const thatRequested = args[1];
      if (!thatRequested) return message.reply({ embeds: [statewhojesus] }).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
      if (!breaksDB.get(thatRequested) && breaksDB.get(thatRequested).status != 'pending') return message.reply({ embeds: [idisincorrectdenyjesuschrist] }).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
      const oldRequestedAt = breaksDB.get(thatRequested).requestedAt;
      const oldReason = breaksDB.get(thatRequested).reason;
      const oldDuration = breaksDB.get(thatRequested).duration;
      breaksDB.set(thatRequested, {
        ID: thatRequested, requestedAt: oldRequestedAt, status: 'approved', reason: oldReason, duration: oldDuration,
      });
      client.guilds.cache.get(serverID).member(thatRequested).roles.add(breakRole);
      const em = new MessageEmbed()
        .setTitle(`Approved ${client.users.cache.get(thatRequested).username}'s Break Request`)
        .setColor('GREEN');
      breakQueue.send({ embeds: [em] });
      const confirmEm = new MessageEmbed()
        .setTitle('Your break request has been approved!')
        .setColor('GREEN');
      return client.users.cache.get(thatRequested).send({ embeds: [confirmEm] });
    } if (action && action == 'deny' && adminrole) {
      const thatRequested = args[1];
      if (!thatRequested) return message.reply(statewhotodenyjesus).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
      if (!breaksDB.get(thatRequested) && breaksDB.get(thatRequested).status != 'pending') return message.reply(idisincorrectdenyjesuschrist).then((d) => d.delete({ timeout: 10000 })).then(message.delete({ timeout: 3000 }));
      breaksDB.set(thatRequested, {
        ID: thatRequested, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A',
      });
      const em = new MessageEmbed()
        .setTitle(`Denied ${client.users.cache.get(thatRequested).username}'s Break Request`)
        .setColor('RED');
      breakQueue.send({ embeds: [em] });
      const deniedEm = new MessageEmbed()
        .setTitle('Your break request has been denied!')
        .setColor('RED');
      return client.users.cache.get(thatRequested).send({ embeds: [deniedEm] });
    } if (action && action == 'end') {
      if (breaksDB.get(message.author.id).status != 'approved') return message.channel.send({ embeds: [youarentonabreak] });
      breaksDB.set(message.author.id, {
        ID: message.author.id, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A',
      });
      message.member.roles.remove(breakRole);
      return message.channel.send({ embeds: [iendedyourbreak] });
    }
    return message.channel.send({ embeds: [usageonthiscommand123] });
  },
};
