const Discord = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.tickets
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
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;
    const MessageDeletion = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.messageDeletion);
    const MessageLimit = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.messageLimit);
    if (!interaction.member.roles.cache.has(staffrole)) return interaction.editReply({ embeds: [Prohibited] });

    const DeleteTotal = interaction.options.getInteger('clear')

    if (!DeleteTotal) return interaction.editReply({ embeds: [MessageDeletion] });

    if (DeleteTotal > 100) return interaction.editReply({ embeds: [MessageLimit] });

    interaction.channel.bulkDelete(DeleteTotal, true).then((Amount) => {
      const Successfullydeleted = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('**Messages Deleted!**')
        .addField('**Moderator**', `${interaction.user.tag} (${interaction.id})`)
        .addField('**Messages Deleted**', Amount.size.toString())
        .addField('**In Channel**', `<#${interaction.channel.id}>`);
      logs.send({ embeds: [Successfullydeleted] });
      return interaction.editReply({ embeds: [Successfullydeleted] });
    });
  },
};
