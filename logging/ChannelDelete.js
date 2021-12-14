const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('channelDelete', async (channel) => {
    const logs = await client.channels.cache.get(channelLog);
    if (channel.type === 'GUILD_TEXT') {
      const embed = new discord.MessageEmbed()
        .setTitle('Channel Deleted')
        .setColor('GREEN')
        .setDescription('A channel was deleted.')
        .addField('Channel Name', channel.name, true)
        .addField('Channel ID', channel.id.toString(), true);
      if (channel.topic) {
        embed.addField('Channel Topic', channel.topic);
      }
      embed.addField('NSFW', channel.nsfw.toString());
      return logs.send({ embeds: [embed] });
    }
  });
};
