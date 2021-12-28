const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets

const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('remove')
      .setDescription('removes the selected user'),
    async execute(interaction, client) {
      await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return new MsgError(`**${interaction.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !message.member.roles.cache.has(tickets.supportRoleID)) {
      return new MsgError(`**${interaction.tag}**, you do not have permission to remove users from this ticket.`)
    }

    if (interaction.mentions.members.size < 1) {
      return new MsgError(`**${interaction.tag}**, invalid usage. Please mention a member.\nCorrect Usage: \`.remove <@user>\``)
    }

    let member = interaction.mentions.members.first() || interaction.guild.members.cache.find(u => u.name == args[0]) || message.guild.members.cache.find(u => u.id == args[0])

    //if(message.channel.permissionOverwrites.cache.has(member.id)) {
    //  return new MsgError(`**${message.author.tag}**, you cannot add the same user twice!`)
    //}
    try {
      const permissionOverwrite = interaction.channel.permissionOverwrites.cache.get(member.id);
      if (permissionOverwrite) {
        permissionOverwrite.delete().catch(console.error);
      }
    } catch(err) {
      return new MsgError(`**${interaction.author.tag}**, there was an error whilst trying to remove the user from the ticket.`)
    }
    
    let embed = new Discord.MessageEmbed()
      .setTitle('User Removed')
      .setDescription(`<@${member.id}> has been successfully removed from the ticket.`)
      .setColor("GREEN")
      interaction.reply({ 
      embeds: [embed]
    });
  }
}