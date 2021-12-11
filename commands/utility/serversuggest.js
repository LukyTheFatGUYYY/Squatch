const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { suggestchannel } = require('../../config/constants/channel.json');

module.exports = {
  name: 'serversuggest',
  description: 'server suggestions!',
  aliases: [],
  category: 'utility',
  clientPermissions: [],
  userPermissions: [],
  run: (client, msg, data) => {
    const { args } = data;
    message.delete();
    const suggestmsg = args.join(' ');
    const noarg = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Error')
      .setFooter(`${message.author.username}`);
    if (!suggestmsg) return message.channel.send(noarg).then((message) => message.delete({ timeout: 10000 }));
    const suggestembed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('New Suggestion')
      .setDescription(`${suggestmsg}`)
      .setFooter(`Suggested by ${message.author.username}!`);
    if (suggestchannel) {
      message.member.guild.channels.cache.get(suggestchannel).send(suggestembed).then(async (message) => {
        await message.react('👍');
        await message.react('👎');
      });
    }
  },
};
