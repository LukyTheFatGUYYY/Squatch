const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('guildMemberRemove', async (member) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Member Left')
      .setColor('GREEN')
      .setDescription('A member left the server.')
      .addField('User', member.user.tag, true)
      .addField('User ID', member.id, true)
      .addField('User Account Registered At', member.user.createdAt)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    return logs.send({ embeds: [embed] });
  });
};
