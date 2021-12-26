const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('roleDelete', async (role) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Role Deleted')
      .setColor(role.hexColor)
      .addField('Role Name', role.name)
      .addField('Role ID', role.id)
      .addField('Role Hex Color', role.hexColor)
      .addField('Role Was Hoisted?', role.hoist.toString())
      .addField('Role Was Mentionable By Everyone?', role.mentionable.toString())
      .addField('Role Position', role.position.toString());
    return logs.send({ embeds: [embed] });
  });
};
