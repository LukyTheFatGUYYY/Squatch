const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

const { staffrole } = require('../../config/constants/roles.json');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('warning')
  .setDescription('Get information about a case')
  .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to warn').setRequired(true))
  .addStringOption(option => option.setName('caseid').setDescription('Please enter the Case ID').setRequired(true)),
async execute(interaction, client) {
  await interaction.deferReply();
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const enabledms = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error!')
      .setDescription(
        'Please enable your dms with this server to that I can send you the information you requested!',
      );
    const caseidincorrect = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(`Please do ${prefix}warning (caseid) (user id)`);
    const warninginfo = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success')
      .setDescription('I have sent you a dm with your requested information!');
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
      await interaction.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              'I have sent you a dm with your requested information!',
            ),
        ],
      });
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
