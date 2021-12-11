const moment = require('moment');
require('moment-duration-format');

module.exports = {
  name: 'userinfo',
  description: 'userinfo',
  aliases: [],
  category: 'info',
  clientPermissions: [],
  userPermissions: [],
  run: (client, message, args, data) => {
    const { args } = data;
    const server = message.guild;
    const statusMoji = {
      dnd: '<:red_circle:>',
      offline: '<:black_circle:>',
      online: '<:green_circle:>',
      idle: '<:yellow_circle:>',
    };
    const statusName = {
      dnd: 'Do not Disturb',
      offline: 'Offline',
      online: 'Online',
      idle: 'Idle',
    };
    const device = {
      mobile: '<:telephone:>',
      browser: '<:computer:>',
      desktop: '<:desktop:>',
    };
    let member;
    if (args[0]) {
      member = server.members.cache.get(args[0])
        || server.members.cache.find((m) => m.user.username.toLowerCase() == args[0].toLowerCase())
        || server.members.cache.find((m) => m.user.tag.toLowerCase() == args[0].toLowerCase())
        || server.members.cache.find((m) => m.displayName.toLowerCase() == args[0].toLowerCase())
        || message.mentions.members.first() || false;
    }
    if (!args[0]) member = message.member;
    if (member) {
      const em = new MessageEmbed()
        .setAuthor(`${member.displayName}'s information`, member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor("PURPLE")
        .addField('Username', member.user.username, true)
        .addField('Tag', member.user.tag, true)
        .addField(`Created At [${moment(member.user.createdTimestamp).fromNow()}]`, moment(member.user.createdTimestamp).format('LLL'))
        .addField(`Joined Server At [${moment(member.joinedTimestamp).fromNow()}]`, moment(member.joinedTimestamp).format('LLL'))
        .addField('Status', `${statusMoji[member.user.presence.status]} ${statusName[member.user.presence.status]}`, true)
        .addField('Main Device', `${device[Object.keys(member.user.presence.clientStatus)[0]]} ${Object.keys(member.user.presence.clientStatus)[0].toProperCase()}`, true);
      if (member.user.presence.activities[0] && member.user.presence.activities[0].name !== 'Custom Status') em.addField('Activity', `${member.user.presence.activities[0].type.toProperCase()} ${member.user.presence.activities[0].name}`);
      if (message.member.id != member.id) {
        em.setFooter(`Requested by ${message.member.displayName}`);
      }
      message.channel.send({ embeds: [em] });
    } else {
      let user = message.author;
      if (args[0]) user = client.users.cache.get(args[0]) || message.author;
      const em = new MessageEmbed()
        .setAuthor(`${user.username}'s information`, user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor("PURPLE")
        .addField('Username', user.username, true)
        .addField('Tag', user.tag, true)
        .addField(`Created At [${moment(user.createdTimestamp).fromNow()}]`, moment(user.createdTimestamp).format('LLL'))
        .setFooter(`Requested by ${message.member.displayName}`);
        message.channel.send({ embeds: [em] });
    }
  },
};
