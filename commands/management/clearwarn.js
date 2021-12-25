const Enmap = require('enmap');
require('moment-duration-format');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('clearwarn')
  .setDescription('clears a specific warning')
  .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to warn').setRequired(true))
  .addStringOption(option => option.setName('caseid').setDescription('Please enter the Case ID').setRequired(true)),
async execute(interaction, client) {
  await interaction.deferReply();
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!');
    const insertID = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please insert the ID of the case you want to clear');
    const includeuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        'Please include the user in which you want to unban, please note if they were banned they will be unbanned',
      );
    const wrongid = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        '"I could not find a case with this ID, please make sure you filled it in correctly (case senstive)"',
      );
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
    const em = new MessageEmbed()
      .setTitle('Warning cleared')
      .setColor('GREEN')
      .addField('Adminstrator', `${interaction.tag} (${interaction.id})`)
      .addField('User', `${user.tag} (${user.id})`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Case Points', `\`${parseInt(casePoints).toLocaleString()}\``)
      .addField('Case Reason', `\`${caseReason}\``)
      .addField('Unbanned?', userBanned ? 'Yes' : 'No')
    await clearedWarnsLog.send({ embeds: [em] });
    return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              `I have successfully cleared warning **${caseID}** from **${user.tag}**!`,
            ),
        ],
      });
  },
};
