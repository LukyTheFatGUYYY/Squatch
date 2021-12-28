const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const colors = configuration.colors

const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('add')
      .setDescription('adds a user to a channel'),
    async execute(interaction, client) {
      await interaction.deferReply();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return new MsgError(`**${interaction.tag}**, you are not inside of a ticket.`)
    }

    if (tickets.onlySupportCanAdd === 'true' && !interaction.member.roles.cache.has(tickets.supportRoleID)) {
      return new MsgError(`**${interaction.tag}**, you do not have permission to add users to this ticket.`)
    }

    if (interaction.mentions.members.size < 1) {
      return new MsgError(`**${interaction.tag}**, invalid usage. Please mention a member.\nCorrect Usage: \`.add <@user>\``)
    }

    let member = interaction.mentions.members.first() || interaction.guild.members.cache.find(u => u.name == args[0]) || interaction.guild.members.cache.find(u => u.id == args[0])

    if(interaction.channel.permissionOverwrites.cache.has(member.id)) {
      return new MsgError(`**${interaction.tag}**, you cannot add the same user twice!`)
    }
    try {
        interaction.channel.permissionOverwrites.edit(member, { 
        "VIEW_CHANNEL": true, 
        "SEND_MESSAGES": true 
      });
    } catch(err) {
      return new MsgError(`**${interaction.tag}**, there was an error whilst trying to add the user to the ticket.`)
    }

    
    let embed = new Discord.MessageEmbed()
      .setTitle('User Added')
      .setDescription(`<@${member.id}> has been successfully added to the ticket.`)
      .setColor(colors.success)
      interaction.reply({ 
      embeds: [embed]
    });
  }
}