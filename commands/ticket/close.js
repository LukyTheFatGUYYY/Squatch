require('discord-reply');
const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord.js')

const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('closes the ticket the command is ran into'),
  async execute(interaction, client) {
    await interaction.deferReply();

    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.editReply(`**${interaction.user.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanClose === 'true' && interaction.member.roles.cache.has(tickets.supportRoleID) === true || tickets.onlySupportCanClose === 'false' || client.user.includes(interactionid)) {

      const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle('Closing Ticket')
        .setDescription('This ticket will be closed in 10 seconds.')
        .setTimestamp()
        .setFooter(`Closed by ${interaction.user.tag}`, `${interaction.user.avatarURL()}`)  

      const btnCancelClose = new MessageButton()
        .setLabel('Cancel Close')
        .setCustomId('cancel_close')
        .setStyle('PRIMARY');

      const row = new MessageActionRow()
        .addComponents(
          btnCancelClose
        )

      await interaction.editReply({
        embeds: [embed]
      });
        setTimeout(() => interaction.channel.delete(), 10000);
      return;

    } else {
      
      const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle('Insufficient Permission')
        .setDescription('You do not have permission to close this ticket.')
  
        interaction.editReply({
        embeds: [embed]
      });
    }
  }
};