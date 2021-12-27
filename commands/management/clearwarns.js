const Enmap = require('enmap');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('clear all specific warnings')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to warn').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!');
    const includeuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        'Include the user of whome you want to clear the warning,please note that if they were previously banned that they will be unbanned.',
      );
    if (!interaction.member.roles.cache.has(adminrole)) return interaction.editReply({ embeds: [Prohibited] });
    const warnsDB = new Enmap({ name: 'warns' });
    const user = interaction.options.getUser('user')
    if (!user) return interaction.editReply({ embeds: [includeuser] });
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const userBanned = warnsDB.get(user.id).points >= 5;
    if (userBanned) {
      client.guilds.cache
        .get(serverID)
        .members.unban(user.id, `${interaction.tag} - warnings cleared`);
    }
    warnsDB.delete(user.id);
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const em = new MessageEmbed()
      .setTitle('Warnings cleared')
      .setColor('GREEN')
      .addField('Administrator', `${interaction.tag} (${interaction.id})`)
      .addField('User', `${user.tag} (${user.id})`)
      .addField('Unbanned?', userBanned ? 'Yes' : 'No')
    await clearedWarnsLog.send({ embeds: [em] });
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription(
            `I have successfully cleared all warnings on **${user.tag}**!`,
          ),
      ],
    });
  },
};
