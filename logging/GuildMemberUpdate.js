const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('guildMemberUpdate', async (Old, New) => {
    const logs = await client.channels.cache.get(channelLog);
    if (Old.user.tag !== New.user.tag || Old.displayName !== New.displayName || Old.user.username !== New.user.username) {
      const embed = new discord.MessageEmbed()
        .setTitle('Member Updated')
        .setColor('GREEN');
      if (Old.user.tag !== New.user.tag) {
        embed.addField('Old User Tag', Old.user.tag);
        embed.AddField('New User Tag', New.user.tag);
      } else {
        embed.addField('User Tag', Old.user.tag);
      }
      if (Old.displayName !== New.displayName) {
        embed.addField('Old Nickname', Old.nickname.toString());
        embed.addField('New Nickname', New.nickname.toString());
      }
      if (Old.user.username !== New.user.username) {
        embed.addField('Old Username', Old.user.username);
        embed.addField('New Username', New.user.username);
      }

      embed.setThumbnail(New.user.displayAvatarURL({ dynamic: true }));
      return logs.send({ embeds: [embed] });
    }
  });
};
