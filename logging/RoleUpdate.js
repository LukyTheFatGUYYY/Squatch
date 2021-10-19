const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('roleUpdate', async (Old, New) => {
    const logs = await client.channels.cache.get(channelLog);
    if (Old.hexColor !== New.hexColor || Old.name !== New.name || Old.hoist !== New.hoist || Old.mentionable !== New.mentionable) {
      const embed = new discord.MessageEmbed()
        .setTitle('Role Updated')
        .setColor(New.hexColor);

      if (Old.name !== New.name) {
        embed.addField('Old Role Name', Old.name);
        embed.addField('New Role Name', New.name);
      } else {
        embed.addField('Role Name', Old.name);
      }
      if (Old.hexColor !== New.hexColor) {
        embed.addField('Old Role Hex Color', Old.hexColor);
        embed.addField('New Role Hex Color', New.hexColor);
      }
      if (Old.hoist !== New.hoist) {
        embed.addField('Old Role Hoisted?', Old.hoist);
        embed.addField('New Role Hoisted?', New.hoist);
      }
      if (Old.mentionable !== New.mentionable) {
        embed.addField('Old Role Mentionable By Everyone?', Old.mentionable);
        embed.addField('New Role Mentionable By Everyone?', Old.mentionable);
      }
      return logs.send({ embeds: [embed] });
    }
  });
};
