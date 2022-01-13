const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const colors = configuration.colors
const Discord = require('discord.js')

const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('adds a user to a channel')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.editReply(`**${interaction.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !interaction.member.roles.cache.has(tickets.supportRoleID)) {
      return interaction.editReply(`**${interaction.tag}**, you do not have permission to add users to this ticket.`)
    }


    let member = interaction.options.getUser('user');

    if (interaction.channel.permissionOverwrites.cache.has(member.id)) {
      return interaction.editReply(`**${interaction.tag}**, you cannot add the same user twice!`)
    }
    try {
      interaction.channel.permissionOverwrites.edit(member, {
        "VIEW_CHANNEL": true,
        "SEND_MESSAGES": true
      });
    } catch (err) {
      return interaction.editReply(`**${interaction.tag}**, there was an error whilst trying to add the user to the ticket.`)
    }


    let embed = new Discord.MessageEmbed()
      .setTitle('User Added')
      .setDescription(`<@${member.id}> has been successfully added to the ticket.`)
      .setColor("GREEN")
      ;
    interaction.editReply({
      embeds: [embed]
    });
  }
}