const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { suggestchannel } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('give the server a suggestion!')
    .addStringOption(option => option.setName('suggestion').setDescription('Please enter your suggestion').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const suggestmsg = interaction.options.getString('suggestion');
    const noarg = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Error')
    ;
    if (!suggestmsg) return interaction.editReply({ embeds: [noarg] })
    const suggestembed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('New Suggestion')
      .setDescription(`${suggestmsg}`)
      .setFooter({ name: `Suggested by ${interaction.user.tag}!` });
    if (suggestchannel) {
      interaction.member.guild.channels.cache.get(suggestchannel).send({ embeds: [suggestembed] }).then(async (interaction) => {
        await interaction.react('👍');
        await interaction.react('👎');
      });
    }
  },
};