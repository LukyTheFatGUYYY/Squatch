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
  run: async (_client, msg, args) => {
    msg.delete({timeout: 3000});
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
    const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    if (user.id == msg.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor('GREEN')
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'You have not been warned before'
          }\``,
        );
      await msg.author.send({ embeds: [em] }).catch((err) => msg.reply(enabledms));
      await msg.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              'I have sent you a dm with your requested information!',
            ),
        ],
      });
    } else {
      if (!msg.member.roles.cache.has(staffrole)) return msg.reply(Prohibited);
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor('GREEN')
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'User has not been warned before'
          }\``,
        );
      await msg.member.send(em).catch((err) => msg.reply(enabledms));
      await msg.channel.send({
        embeds: [
          new MessageEmbed().setColor('RED').setDescription(warninginfo),
        ],
      });
    }
  },
};
