const Discord = require('discord.js');
const { ticketCategory } = require('../../config/constants/channel.json');
const { ticketsupportrole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Opens a ticket'),
async execute(interaction, client) {
  await interaction.deferReply();
    const welcome = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Welcome ${interaction.username}`)
      .setDescription('Support will be with you shortly.\nTo close this ticket please react with <:envelope:>');

    const onechannel = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Error')
      .setDescription('You already have a ticket open');

    const ch = interaction.guild.channels.cache.find((ch) => ch.name === interaction.username);
    if (ch) return interaction.channel.send({ embeds: [onechannel] });

    interaction.guild.channels.create(`${interaction.username}`, {
      type: 'text',
      parent: ticketCategory,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS', 'ATTACH_FILES'],
        },
        {
          id: interaction.guild.roles.cache.find((role) => role.id === ticketsupportrole),
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
      ],
    }).then(async (channel) => {
      const viewchannel = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Ticket')
        .setDescription(`You can view your ticket at <#${channel.id}>`);

        interaction.channel.send({ embeds: [viewchannel] }).then((interaction));
      channel.send(welcome).then((message) => {
        message.react('<:envelope:>');
        const filter = (reaction, user) => user.id === interaction.author.id && reaction.emoji.name === ':envelope:';
        message.awaitReactions(filter, { max: 1 }).then(async (cls) => {
          const delete1 = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Deletion')
            .setDescription('Ticket Will be deleted in 5 seconds');

          await message.channel.send({ embeds: [delete1] });
          setTimeout(() => {
            message.channel.delete();
          }, 5000);
        });
      });
    });
  },
};
