const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const Discord = require('discord.js');

const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('lock')
      .setDescription('locks the channel'),
    async execute(interaction, client) {
      await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.editReply(`**${interaction.user.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !interaction.member.roles.cache.has(tickets.supportRoleID)) {
      return interaction.editReply(`**${interaction.user.tag}**, you do not have permission to lock this ticket.`)
    }

    interaction.channel.permissionOverwrites.cache.forEach(function(p) {
      if (p.type === 'member') {
        var member = interaction.guild.members.cache.find(u => u.id === p.id)
        interaction.channel.permissionOverwrites.edit(member, {
          "VIEW_CHANNEL": true,
          "SEND_MESSAGES": false
        });
      }
    });
    
    let embed = new Discord.MessageEmbed()
      .setTitle('Ticket Locked  🔒')
      .setDescription(`This ticket has been locked until further notice.`)
      .setColor(tickets.successfulColor)
      interaction.editReply({ 
      embeds: [embed]
    });
  }
}