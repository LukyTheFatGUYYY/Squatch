const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('channelCreate', async (channel) => {
    const logs = await client.channels.cache.get(channelLog);
    if (channel.type === 'GUILD_TEXT') {
      const embed = new discord.MessageEmbed()
        .setTitle('Channel Created')
        .setColor('GREEN')
        .setDescription('A new channel was created.')
        .addField('Channel', channel.toString(), true)
        .addField('Channel ID', channel.id.toString(), true);
      return logs.send({ embeds: [embed] });
    }
  });
};