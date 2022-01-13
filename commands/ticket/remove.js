const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const Discord = require('discord.js')

const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('removes the selected user')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.editReply(`**${interaction.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !interaction.member.roles.cache.has(tickets.supportRoleID)) {
      return interaction.editReply(`**${interaction.tag}**, you do not have permission to remove users from this ticket.`)
    }

    let member = interaction.options.getUser('user');

    //if(message.channel.permissionOverwrites.cache.has(member.id)) {
    //  return new MsgError(`**${message.author.tag}**, you cannot add the same user twice!`)
    //}
    try {
      const permissionOverwrite = interaction.channel.permissionOverwrites.cache.get(member.id);
      if (permissionOverwrite) {
        permissionOverwrite.delete().catch(console.error);
      }
    } catch (err) {
      return interaction.editReply(`**${interaction.user.tag}**, there was an error whilst trying to remove the user from the ticket.`)
    }

    let embed = new Discord.MessageEmbed()
      .setTitle('User Removed')
      .setDescription(`<@${member.id}> has been successfully removed from the ticket.`)
      .setColor("GREEN")
    interaction.editReply({
      embeds: [embed]
    });
  }
}