const discord = require('discord.js');
const { channelLog } = require('../config/constants/channel.json');

module.exports = (client) => {
  client.on('inviteCreate', async (invite) => {
    const logs = await client.channels.cache.get(channelLog);
    const embed = new discord.MessageEmbed()
      .setTitle('New Invite Created')
      .setColor('GREEN')
      .addField('Invite Code', invite.code)
      .addField('Invite URL', invite.url)
      .addField('Invite Channel', invite.channel.toString())
    if (invite.expiresAt) {
      embed.addField('Invite Expires At', invite.expiresAt.toString());
    }
    if (invite.inviter) {
      embed.addField('Inviter', `${invite.inviter.tag} | ${invite.inviter.id}`);
    }
    return logs.send({ embeds: [embed] });
  });
};
