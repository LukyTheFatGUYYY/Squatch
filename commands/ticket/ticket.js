const Discord = require('discord.js');
const { ticketCategory } = require('../../config/constants/channel.json');

module.exports = {
  name: 'ticket',
  description: 'creates a dedicated ticket',
  aliases: [],
  category: 'ticket',
  clientPermissions: [],
  userPermissions: [],
  run: (message, data) => {
    const welcome = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Welcome ${message.author.username}`)
      .setDescription('Support will be with you shortly.\nTo close this ticket please react with <:envelope:>');

    const onechannel = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Error')
      .setDescription('You already have a ticket open');

    const ch = message.guild.channels.cache.find((ch) => ch.name === message.author.username);
    if (ch) return message.channel.send({ embeds: [onechannel] });

    message.guild.channels.create(`${message.author.username}`, {
      type: 'text',
      parent: ticketCategory,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS', 'ATTACH_FILES'],
        },
        {
          id: message.guild.roles.cache.find((role) => role.id === ticketsupportrole),
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
      ],
    }).then(async (channel) => {
      const viewchannel = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Ticket')
        .setDescription(`You can view your ticket at <#${channel.id}>`);

      message.channel.send({ embeds: [viewchannel] }).then((message) => message.delete({ timeout: 10000 }));
      channel.send(welcome).then((message) => {
        message.react('<:envelope:>');
        const filter = (reaction, user) => user.id === message.author.id && reaction.emoji.name === ':envelope:';
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
