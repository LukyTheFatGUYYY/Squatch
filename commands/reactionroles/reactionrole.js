const Discord = require('discord.js');
const { reactionrolechannel } = require('../../config/constants/channel.json');
const { adminrole } = require('../../config/constants/roles.json');
const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('testrr') 
      .setDescription('reactionroles'),
    async execute(interaction, client) {
      await interaction.deferReply({ephemeral: true});
      const reactionrolechan = interaction.client.channels.cache.get(reactionrolechannel);
      const success = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Success')
      .setDescription('You sucessfully created a reaction roles')
      ;
      const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!')
      ;
      const reactionrolesystem = new Discord.MessageEmbed()
      .setTitle('reaction roles')
      .setDescription(':blue_circle: - Test')
      ;

      const buttonsRow = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
        .setCustomId('test1')
        .setLabel('test')
        .setStyle('PRIMARY'),
        new Discord.MessageButton()
        .setCustomId('test2')
        .setLabel('test')
        .setStyle('PRIMARY'),
        new Discord.MessageButton()
        .setCustomId('test3')
        .setLabel('test')
        .setStyle('PRIMARY'),
        new Discord.MessageButton()
        .setCustomId('test4')
        .setLabel('test')
        .setStyle('PRIMARY'),
        new Discord.MessageButton()
        .setCustomId('test5')
        .setLabel('test')
        .setStyle('PRIMARY'),
      );
      const buttonsRow2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
      .setCustomId('test6')
      .setLabel('test')
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomId('test7')
      .setLabel('test')
      .setStyle('PRIMARY'),
      );
    if (!interaction.member.roles.cache.has(adminrole)) {
        return interaction.editReply({ embeds: [Prohibited] });
      }
      interaction.editReply({ embeds: [success] })
      reactionrolechan.send({ embeds: [reactionrolesystem], components: [buttonsRow,buttonsRow2] })
    }
}