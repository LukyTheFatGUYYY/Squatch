const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('lists information about yourself or another user')
    .addUserOption(option => option.setName('user').setDescription('Please mention a user you would like the information for')),
  async execute(interaction, client) {
    await interaction.deferReply();
    const statusMoji = {
      dnd: ':red_circle:',
      offline: ':black_circle:',
      online: ':green_circle:',
      idle: ':yellow_circle:',
    };
    const statusName = {
      dnd: 'Do not Disturb',
      offline: 'Offline',
      online: 'Online',
      idle: 'Idle',
    };
    const device = {
      mobile: ':telephone:',
      browser: ':computer:',
      desktop: ':desktop:',
    };
    const member = interaction.options.getMember("user") ?? interaction.member
    if (member) {
      const em = new Discord.MessageEmbed()
        .setAuthor(`${member.displayName}'s information`)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor("PURPLE")
        .addField('Username', member.user.username, true)
        .addField('Tag', member.user.tag, true)
        .addField(`Created At [${moment(member.user.createdTimestamp).fromNow()}]`, moment(member.user.createdTimestamp).format('LLL'))
        .addField(`Joined Server At [${moment(member.joinedTimestamp).fromNow()}]`, moment(member.joinedTimestamp).format('LLL'))
        .addField('Status', `${statusMoji[member.presence.status]} ${statusName[member.presence.status]}`, true)
        .addField('Main Device', `${device[Object.keys(member.presence.clientStatus)[0]]} ${Object.keys(member.presence.clientStatus)[0]}`, true);
      if (interaction.member.id != member.id) {
        em.setFooter(`Requested by ${interaction.member.tag}`);
      }
      interaction.editReply({ embeds: [em] });
    } else {
      let user = interaction.options.getMember("user") ?? interaction.member
      const em = new Discord.MessageEmbed()
        .setAuthor(`${user.username}'s information`)
        .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor("PURPLE")
        .addField('Username', user.username, true)
        .addField('Tag', user.tag, true)
        .addField(`Created At [${moment(user.createdTimestamp).fromNow()}]`, moment(user.createdTimestamp).format('LLL'))
        .setFooter(`Requested by ${interaction.member.displayName}`);
      interaction.editReply({ embeds: [em] });
    }
  },
};
