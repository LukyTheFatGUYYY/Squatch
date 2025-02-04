const Enmap = require('enmap');
require('moment-duration-format');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Clears a specific warning')
    .addUserOption(option => option.setName('user').setDescription('Please mention a user that should have a warning cleared').setRequired(true))
    .addStringOption(option => option.setName('caseid').setDescription('Please enter the Case ID for the warning you would like to delete').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
    const insertID = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.pleaseEnterID);
    const includeuser = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.enterValidUser);
    const wrongid = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.cantFindValidCase);
    if (!interaction.member.roles.cache.has(adminrole)) return interaction.editReply({ embeds: [Prohibited] });
    const warnsDB = new Enmap({ name: 'warns' });
    const user = interaction.options.getUser('user')
    if (!user) return interaction.editReply({ embeds: [includeuser] });
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const caseID = interaction.options.getString('caseid');
    if (!caseID) return interaction.editReply({ embeds: [insertID] });
    if (!warnsDB.get(user.id).warns[caseID]) return interaction.editReply({ embeds: [wrongid] });
    const casePoints = warnsDB.get(user.id).warns[caseID].points;
    const caseReason = warnsDB.get(user.id).warns[caseID].reason;
    const newPoints = warnsDB.get(user.id).points - casePoints;
    warnsDB.delete(user.id, `warns.${caseID}`);
    warnsDB.set(user.id, newPoints, 'points');
    const userBanned = warnsDB.get(user.id).points < 5;
    if (userBanned) {
      client.guilds.cache
        .get(user.id)
        .members.unban(user.id, `${interaction.tag} - warnings cleared`)
        .catch((err) => err);
    }
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const clearedWarnsSuccessfully = new MessageEmbed()
      .setTitle('Warning cleared')
      .setColor('GREEN')
      .addField('Adminstrator', `${interaction.tag} (${interaction.id})`)
      .addField('User', `${user.tag} (${user.id})`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Case Points', `\`${parseInt(casePoints).toLocaleString()}\``)
      .addField('Case Reason', `\`${caseReason}\``)
      .addField('Unbanned?', userBanned ? 'Yes' : 'No')
    await clearedWarnsLog.send({ embeds: [clearedWarnsSuccessfully] });
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription(`I have successfully cleared warning **${caseID}** from **${user.tag}**!`),
      ],
    });
  },
};
