const Discord = require('discord.js');
const Fakerator = require('fakerator');
const fakerator = Fakerator();
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fakeprofile')
    .setDescription('bans the selected user')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you want to ban them').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    const fakeprofile = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Fake profile')
      .addFields(``);
      interaction.editReply({ embeds: [fakeprofile] });
  },
};
