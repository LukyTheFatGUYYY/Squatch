const Discord = require('discord.js');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { announcement } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eannounce')
    .setDescription('sends an announcement with an everyone tag')
    .addStringOption(option => option.setName('title').setDescription('Please enter a title of the announcement').setRequired(true))
    .addStringOption(option => option.setName('announce').setDescription('Please enter a message for the announcement').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!')
      ;
    const success = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success')
      .setDescription('You sucessfully sent an announcement!')
      ;
    const AnnDesc = interaction.options.getString('announce');
    const AnnTitle = interaction.options.getString('title');
    if (!interaction.member.roles.cache.has(adminrole)) return interaction.editReply({ embeds: [Prohibited] });
    const announceChan = interaction.client.channels.cache.get(announcement);
    interaction.editReply({ embeds: [success] })
    const em = new Discord.MessageEmbed().setColor('PURPLE').setDescription(AnnDesc).setTitle(AnnTitle);
    await announceChan.send({ content: `@everyone`, embeds: [em] });
  },
};
