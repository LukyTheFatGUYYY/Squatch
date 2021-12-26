const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('emojiDelete', async (emoji) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Emoji Deleted')
      .setColor('GREEN')
      .setDescription('A custom emoji was deleted.')
      .addField('Emoji Name', emoji.name)
      .addField('Emoji ID', emoji.id.toString())
      .addField('Animted Emoji?', emoji.animated.toString());
    return logs.send({ embeds: [embed] });
  });
};
