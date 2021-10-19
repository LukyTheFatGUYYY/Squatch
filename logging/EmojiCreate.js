const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('emojiCreate', async (emoji) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Emoji Added')
      .setColor('GREEN')
      .setDescription('A custom emoji was added to the server.')
      .addField('Emoji Name', emoji.name, true)
      .addField('Emoji ID', emoji.id, true)
      .addField('Animted Emoji?', emoji.animated);
    emoji.author ? embed.addField('Added By', emoji.author.tag) : null;
    return logs.send({ embeds: [embed] });
  });
};
