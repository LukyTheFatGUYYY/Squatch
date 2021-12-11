const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { announcement } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  name: 'eannounce',
  description: 'everyone announcements',
  aliases: [],
  category: 'management',
  clientPermissions: [],
  userPermissions: [],
  run: async (client, message, args, data) => {
    message.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!');
    const Description = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        'Make sure to include a description for the announcement! (Must be longer than 5 words)',
      );
    if (!message.member.roles.cache.has(adminrole)) return message.reply({ embeds: [Prohibited] });
    const announceChan = message.client.channels.cache.get(announcement);
    await announceChan.message.fetch();
    if (data.length < 5) return message.reply(Description);
    const AnnDesc = data.join(' ').trim();
    const em = new MessageEmbed().setColor('PURPLE').setDescription(AnnDesc);
    await announceChan.send({ content: `<@&${serverID}>`, embeds: [em] });
  },
};
