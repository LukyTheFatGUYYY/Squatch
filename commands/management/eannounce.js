const Discord = require('discord.js');
require('moment-duration-format');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.tickets
const { adminrole, roleID } = require('../../config/constants/roles.json');
const { announcement } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eannounce')
    .setDescription('Send an announcement with an everyone tag')
    .addStringOption(option => option.setName('title').setDescription('Enter what the title of the announcement should be').setRequired(true))
    .addStringOption(option => option.setName('announce').setDescription('Enter the text that should go into the announcement').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;
    const success = new Discord.MessageEmbed()
      .setColor(embedMSG.successfulColor)
      .setTitle(embedMSG.commandWentWellTitle)
      .setDescription(embedMSG.commandWentWellDesc)
      ;
    const AnnDesc = interaction.options.getString('announce');
    const AnnTitle = interaction.options.getString('title');
    if (!interaction.member.roles.cache.has(adminrole)) {
      return interaction.editReply({ embeds: [Prohibited] });
    }
    const announceChan = interaction.client.channels.cache.get(announcement);
    interaction.editReply({ embeds: [success] })
    const announcementEmbed = new Discord.MessageEmbed().setColor('PURPLE').setDescription(AnnDesc).setTitle(AnnTitle);
    await announceChan.send({ content: `<@&${roleID}>`, embeds: [announcementEmbed] });
  },
};
