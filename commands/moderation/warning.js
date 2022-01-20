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
    .setName('warning')
    .setDescription('Get information about a warning')
    .addUserOption(option => option.setName('user').setDescription('Please mention a valid user').setRequired(true))
    .addStringOption(option => option.setName('caseid').setDescription('Please enter the Case ID').setRequired(true)),
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
    const caseidincorrect = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.pleaseEnterID);
    const warninginfo = new Discord.MessageEmbed()
      .setColor(embedMSG.sucessfulColor)
      .setTitle(embedMSG.commandWentWellTitle)
      .setDescription(embedMSG.requestedInfo);
    const warnsDB = new Enmap({ name: 'warns' });
    let usermention = interaction.options.getMember('userid');
    const user = client.users.cache.get(usermention || interaction.member);
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const caseID = interaction.options.getString('caseid');
    if (!warnsDB.get(user.id).warns[caseID]) return interaction.editReply({ embeds: [caseidincorrect] });
    if (user.id == interaction.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor('GREEN')
        .addField('Reason', warnsDB.get(user.id).warns[caseID].reason)
        .addField('Date', warnsDB.get(user.id).warns[caseID].date);
      await interaction.member.send({ embeds: [em] }).catch((err) => interaction.editReply({ embeds: [enabledms] }));
      await interaction.channel.send({ embeds: [warninginfo] });
    } else {
      if (!interaction.member.roles.cache.has(staffrole)) return interaction.editReply({ embeds: [Prohibited] });
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor("ORANGE")
        .addField('Reason', warnsDB.get(user.id).warns[caseID].reason)
        .addField('Moderator ID', warnsDB.get(user.id).warns[caseID].moderator)
        .addField('Date', warnsDB.get(user.id).warns[caseID].date);
      await interaction.member.send({ embeds: [em] }).catch((err) => interaction.editReply({ embeds: [enabledms] }));
      await interaction.channel.send({ embeds: [warninginfo] });
    }
  },
};
