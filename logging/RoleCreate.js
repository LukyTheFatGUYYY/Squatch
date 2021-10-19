const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('roleCreate', async (role) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('New Role Created')
      .setColor(role.hexColor)
      .addField('Role Name', role.name, true)
      .addField('Role ID', role.id, true)
      .addField('Role Hex Color', role.hexColor)
      .addField('Role Hoisted?', role.hoist)
      .addField('Role Mentionable By Everyone?', role.mentionable)
      .addField('Role Position', role.position);
    return logs.send({ embeds: [embed] });
  });
};
