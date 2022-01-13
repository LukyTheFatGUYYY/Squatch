const Discord = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears a selected amount of messages')
    .addIntegerOption(option => option.setName('clear').setDescription('Enter the total number of messages you would like to clear, Please note it must be below 100').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const logs = await client.channels.cache.get(channelLog);
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const MessageDeletion = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please type in the amount of messages you would like to delete');
    const MessageLimit = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('The limit of messages you can delete at once is 100');
    if (!interaction.member.roles.cache.has(staffrole)) return interaction.editReply({ embeds: [Prohibited] });

    const DeleteTotal = interaction.options.getInteger('clear')

    if (!DeleteTotal) return interaction.editReply({ embeds: [MessageDeletion] });

    if (DeleteTotal > 100) return interaction.editReply({ embeds: [MessageLimit] });

    interaction.channel.bulkDelete(DeleteTotal, true).then((Amount) => {
      const Successfullydeleted = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('**Messages Deleted!**')
        .addField(
          '**Moderator**',
          `${interaction.user.tag} (${interaction.id})`,
        )
        .addField('**Messages Deleted**', Amount.size.toString())
        .addField('**In Channel**', `<#${interaction.channel.id}>`);
      logs.send({ embeds: [Successfullydeleted] });
      return interaction.editReply({ embeds: [Successfullydeleted] });
    });
  },
};
