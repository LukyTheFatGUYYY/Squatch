const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { ticketCategory } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('closes the specific ticket'),
  async execute(interaction, client) {
    await interaction.deferReply();
    const delete1 = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Deletion')
      .setDescription('The ticket will be deleted in 5 seconds');
    if (message.channel.parentId !== ticketCategory) {
      const m = await message.channel.send({ embeds: [delete1] });
      return setTimeout(() => m.delete(), 5000);
    }
    setTimeout(() => {
      message.channel.delete();
    }, 5000);
  },
};
