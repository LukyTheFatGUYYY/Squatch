const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { staffrole } = require('../../config/constants/roles.json');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Get a list of warnings for a user')
    .addUserOption(option => option.setName('user').setDescription('Please mention a valid user').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;
    const enabledms = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.warningEnableDMs);
    const warninginfo = new Discord.MessageEmbed()
      .setColor(embedMSG.successfulColor)
      .setTitle(embedMSG.commandWentWellTitle)
      .setDescription(embedMSG.requestedInfo);
    const warnsDB = new Enmap({ name: 'warns' });
    const user = interaction.options.getMember('user')
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    if (user.id == interaction.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor(embedMSG.successfulColor)
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'You have not been warned before'
          }\``,
        );
      await interaction.editReply({ embeds: [em] }).catch((err) => interaction.channel.send({ embeds: [enabledms] }));
      await interaction.editReply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(embedMSG.successfulColor)
            .setDescription(embedMSG.requestedInfo),
        ],
      });
    } else {
      if (!interaction.member.roles.cache.has(staffrole)) return interaction.editReply({ embeds: [Prohibited] });
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor('GREEN')
        .setDescription(
          `\`${Object.keys(warnsDB.get(user.id).warns).length != 0
            ? Object.keys(warnsDB.get(user.id).warns).join('\n')
            : 'User has not been warned before'
          }\``,
        );
      await interaction.member.send({ embeds: [em] }).catch((err) => interaction.editReply({ embeds: [enabledms] }));
      await interaction.editReply({ embeds: [warninginfo] });
    }
  },
};
