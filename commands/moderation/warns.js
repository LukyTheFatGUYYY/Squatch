const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');


module.exports = {
  name: 'warns',
  category: 'moderation',
  aliases: [],
  usage: '<User ID>',
  description: 'Get a list of cases',
  run: async (client, message, args, data) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to look at other people\'s warnings',
      );
    const enabledms = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error!')
      .setDescription(
        'Please enable your dms with this server to that I can send you the information you requested!',
      );
    const warnsDB = new Enmap({ name: 'warns' });
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    if (user.id == message.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor('GREEN')
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'You have not been warned before'
          }\``,
        );
      await message.author.send({ embeds: [em] }).catch((err) => message.reply({ embeds: [enabledms] }));
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
        .setTitle('Warnings')
        .setColor('GREEN')
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'User has not been warned before'
          }\``,
        );
      await message.member.send({ embeds: [em] }).catch((err) => message.reply({ embeds: [enabledms] }));
      await message.channel.send({
        embeds: [
          new MessageEmbed().setColor('RED').setDescription(warninginfo),
        ],
      });
    }
  },
};
