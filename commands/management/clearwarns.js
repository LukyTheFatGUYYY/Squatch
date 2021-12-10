const Enmap = require('enmap');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  name: 'clearwarns',
  category: 'management',
  aliases: [],
  usage: '<User ID>',
  description: 'Clear all warnings of a user',
  run: async (client, msg, args) => {
    msg.delete({timeout: 3000});
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be an administrator to use this command!');
    const includeuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        'Include the user of whome youy want to clear the warning,please note that if they were previously banned that they will be unbanned.',
      );
    const wrongid = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(
        '"I could not find a case with this ID, please make sure you filled it in correctly (case senstive)"',
      );
    if (!msg.member.roles.cache.has(adminrole)) return msg.reply(Prohibited);
    const warnsDB = new Enmap({ name: 'warns' });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch((err) => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply(includeuser);
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const userBanned = warnsDB.get(user.id).points >= 5;
    if (userBanned) {
      client.guilds.cache
        .get(serverID)
        .members.unban(user.id, `${msg.author.tag} - warnings cleared`);
    }
    warnsDB.delete(user.id);
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const em = new MessageEmbed()
      .setTitle('Warnings cleared')
      .setColor('GREEN')
      .addField('Administrator', `${msg.author.tag} (${msg.author.id})`)
      .addField('User', `${user.tag} (${user.id})`)
      .addField('Unbanned?', userBanned ? 'Yes' : 'No')
    await clearedWarnsLog.send({ embeds: [em] });
    return msg.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription(
            `I have successfully cleared all warnings on **${user.tag}**!`,
          ),
      ],
    });
  },
};
