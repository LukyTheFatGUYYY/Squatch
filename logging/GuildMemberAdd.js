const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Member Joined')
      .setColor('GREEN')
      .setDescription('A new member joined the server.')
      .addField('User', member.user.tag)
      .addField('User ID', member.id)
      .addField('User Joined At', member.joinedAt.toLocaleDateString())
      .addField('User Account Registered At', member.user.createdAt.toLocaleDateString())
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    return logs.send({ embeds: [embed] });
  });
};
