const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
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
    await interaction.deferReply({ephemeral: true});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to look at other people\'s warnings',
      );
    const enabledms = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error!')
      .setDescription(
        'Please enable your dms with this server to that I can send you the information you requested!',
      );
    const warninginfo = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success')
      .setDescription('I have sent you a dm with your requested information!');
    const warnsDB = new Enmap({ name: 'warns' });
    const user = interaction.options.getMember('user')
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    if (user.id == interaction.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle('Warnings')
        .setColor('GREEN')
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
            .setColor('GREEN')
            .setDescription(
              'I have sent you a dm with your requested information!',
            ),
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
