require('discord-reply');
const configuration = require('../../config/ticket/ticket.json')
const tickets = configuration.tickets
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('creates a specific ticket'),
  async execute(interaction, client) {
    await interaction.deferReply();

    if (!interaction.channel.name.startsWith('ticket-')) {
      return new MsgError(`**${interaction.author.tag}**, you are not inside of a ticket.`)
    }



    if (tickets.onlySupportCanClose === 'true' && interaction.author.roles.includes(tickets.supportRoleID) === true || tickets.onlySupportCanClose === 'false' || client.author.includes(interactionid)) {

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle('Closing Ticket')
        .setDescription('This ticket will be closed in 10 seconds.')
        .setTimestamp()
        .setFooter(`Closed by ${interaction.tag}`, `${interaction.user.avatarURL()}`)  

      const btnCancelClose = new MessageButton()
        .setLabel('Cancel Close')
        .setCustomId('cancel_close')
        .setStyle('PRIMARY');

      const row = new MessageActionRow()
        .addComponents(
          btnCancelClose
        )

      await message.channel.send({
        embeds: [embed]
      });
        setTimeout(() => message.channel.delete(), 10000);
      return;

    } else {
      
      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle('Insufficient Permission')
        .setDescription('You do not have permission to close this ticket.')
  
      message.reply({
        embeds: [embed]
      });
    }
  }
};