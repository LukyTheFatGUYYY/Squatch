const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const Discord = require('discord.js')

const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('unlocks a specific ticket'),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.editReply(`**${interaction.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !interaction.member.roles.cache.has(tickets.supportRoleID)) {
      return interaction.editReply(`**${interaction.tag}**, you do not have permission to unlock this ticket.`)
    }

    interaction.channel.permissionOverwrites.cache.forEach(function (p) {
      if (p.type === 'member') {
        var member = interaction.guild.members.cache.find(u => u.id === p.id)
        interaction.channel.permissionOverwrites.edit(member, {
          "VIEW_CHANNEL": true,
          "SEND_MESSAGES": true
        });
      }
    });

    let embed = new Discord.MessageEmbed()
      .setTitle('Ticket Unlocked  🔓')
      .setDescription(`The ticket has been successfully unlocked.`)
      .setColor("GREEN")
    interaction.editReply({
      embeds: [embed]
    });
  }
}