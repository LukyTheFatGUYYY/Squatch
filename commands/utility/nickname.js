const Discord = require('discord.js');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Allows you to change a nickname of another user')
    .addUserOption(option => option.setName('user').setDescription('Please mention a username').setRequired(true))
    .addStringOption(option => option.setName('newnickname').setDescription('Please enter a new username').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    let mentionMember = interaction.options.getMember('user')
    let newNickname = interaction.options.getString('newnickname');
    const mentionuser = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription(`Mention the user you want to change the nickname`)
      .setColor("RED");
    const nicknamechange = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription(`Input the new nickname for the user you mentioned`)
      .setColor("RED");
    const cantchangeit = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription(`Can't change nickname of this user, does he have a higher role? Is the server creator? Have I got the permission to change his nickname?`)
      .setColor("RED");
    if (!mentionMember) {
      return interaction.editReply({ embeds: [mentionuser] });
    }
    if (!newNickname) {
      return interaction.editReply({ embeds: [nicknamechange] });
    }
    try {
      mentionMember.setNickname(newNickname);
    } catch (error) {
      interaction.editReply({ embeds: [cantchangeit] });
    }
    interaction.editReply(`Changed nickname of ${mentionMember} to **${newNickname}**`);
  },
};