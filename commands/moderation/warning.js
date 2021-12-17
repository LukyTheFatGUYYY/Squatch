const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');

module.exports = {
  name: 'warning',
  category: 'moderation',
  aliases: [],
  usage: '<Case ID> <User ID>',
  description: 'Get information about a case',
  run: async (client, message, args, data, prefix) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const enabledms = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error!')
      .setDescription(
        'Please enable your dms with this server to that I can send you the information you requested!',
      );
    const caseidincorrect = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(`Please do ${prefix}warning (caseid) (user id)`);
    const warninginfo = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success')
      .setDescription('I have sent you a dm with your requested information!');
    const warnsDB = new Enmap({ name: 'warns' });
    const user = client.users.cache.get(args[1]) || message.member;
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const caseID = args[0];
    if (!warnsDB.get(user.id).warns[caseID]) return message.reply({ embeds: [caseidincorrect] });
    if (user.id == message.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor('GREEN')
        .addField('Reason', warnsDB.get(user.id).warns[caseID].reason)
        .addField('Date', warnsDB.get(user.id).warns[caseID].date);
      await message.member.send({ embeds: [em] }).catch((err) => message.reply({ embeds: [enabledms] }));
      await message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              'I have sent you a dm with your requested information!',
            ),
        ],
      });
    } else {
      if (!message.member.roles.cache.has(staffrole)) return message.reply({ embeds: [Prohibited] });
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor("ORANGE")
        .addField('Reason', warnsDB.get(user.id).warns[caseID].reason)
        .addField('Moderator ID', warnsDB.get(user.id).warns[caseID].moderator)
        .addField('Date', warnsDB.get(user.id).warns[caseID].date);
      await message.member.send({ embeds: [em] }).catch((err) => message.reply({ embeds: [enabledms] }));
      await message.channel.send({ embeds: [warninginfo] });
    }
  },
};
