require('moment-duration-format');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'lists a users avater',
  aliases: [],
  category: 'utility',
  clientPermissions: [],
  userPermissions: [],
  run: async (client, message, args, data) => {
    const server = message.guild;
    let member;
    if (!args[0]) member = message.member;
    if (args[0]) {
      member = server.members.cache.get(args[0])
        || server.members.cache.find((m) => m.user.username.toLowerCase() == args[0].toLowerCase())
        || server.members.cache.find((m) => m.user.tag.toLowerCase() == args[0].toLowerCase())
        || server.members.cache.find((m) => m.displayName.toLowerCase() == args[0].toLowerCase())
        || message.mentions.members.first() || message.member;
    }
    const em = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Showing ${member.displayName}'s avatar`)
      .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true }));
    if (message.member.id != member.id) {
      em.setFooter(`Requested by ${message.member.displayName}`);
    }
    message.channel.send({ embeds: [em] });
  },
};
