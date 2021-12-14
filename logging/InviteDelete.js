const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('inviteDelete', async (invite) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('Invite Deleted')
      .setColor('GREEN')
      .addField('Invite Code', invite.code, true)
      .addField('Invite URL', invite.url, true)
      .addField('Invite Channel', invite.channel.toString());
    if (invite.uses) {
      embed.addField('Invite Uses', invite.uses);
    }
    if (invite.inviter) {
      embed.addField('Inviter', `${invite.inviter.tag} | ${invite.inviter.id}`);
    }
    return logs.send({ embeds: [embed] });
  });
};
