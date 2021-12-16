const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  name: 'clear',
  aliases: ['purge', 'Clear', 'Purge'],
  category: 'moderation',
  description: 'clear a certain amount of messages!',
  usage: 'Clear <Amounts Of Messages>',
  run: async (client, message, args, data) => {
    message.delete({timeout: 3000});
    const logs = await client.channels.cache.get(channelLog);
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const MessageDeletion = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please type in the amount of messages you would like to delete');
    const MessageLimit = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('The limit of messages you can delete at once is 100');
    if (!message.member.roles.cache.has(staffrole)) return message.channel.send(Prohibited);

    if (!args[0]) return message.channel.send({ embeds: [MessageDeletion] });

    if (args[0] > 100) return message.channel.send({ embeds: [MessageLimit] });

    message.channel.bulkDelete(args[0], true).then((Amount) => {
      const Embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('**Messages Deleted!**')
        .addField(
          '**Moderator**',
          `${message.author.tag} (${message.author.id})`,
        )
        .addField('**Messages Deleted**', Amount.size.toString())
        .addField('**In Channel**', `<#${message.channel.id}>`);
        logs.send({ embeds: [Embed] });
      return message.channel
        .send({ embeds: [Embed] });
    });
  },
};
