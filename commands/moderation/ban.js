const moment = require('moment');
const Enmap = require('enmap');
const Discord = require('discord.js');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  customAlphabet
} = require('nanoid')
require('moment-duration-format');
const {
  staffrole
} = require('../../config/constants/roles.json');
const {
  channelLog
} = require('../../config/constants/channel.json');
const {
  serverID,
  appeallink
} = require('../../config/main.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans the mentioned user')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you would like to ban them').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription(
        'You have to be in the moderation team to be able to use this command!',
      );
    const validuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid user');
    const stateareason = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid reason to ban the user');
    const cantbanyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant ban yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t ban that user due to role hierarchy');
    const warnsDB = new Enmap({
      name: 'warns'
    });
    const cannedMsgs = new Enmap({
      name: 'cannedMsgs'
    });
    const server = interaction.guild
    if (!interaction.member.roles.cache.has(staffrole)) {
      interaction.editReply({
        embeds: [Prohibited]
      });
    }
    const toWarn = interaction.options.getUser('user')
    const moderator = interaction.member;
    if (!toWarn)
      interaction.editReply({
        embeds: [validuser]
      });
    warnsDB.ensure(toWarn.id, {
      warns: {}
    });
    let reason = interaction.options.getString('reason');
    if (!reason) {
      interaction.editReply({
        embeds: [stateareason]
      });
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id)
      interaction.editReply({
        embeds: [cantbanyourself]
      });
    if (
      server.members.cache.get(moderator.id).roles.highest.rawPosition <=
      (server.members.cache.get(toWarn.id) ?
        server.members.cache.get(toWarn.id).roles.highest.rawPosition :
        0)
    ) {
      interaction.editReply(({
        embeds: [samerankorhigher]
      }));
    }
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const em = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(banned) - ${reason}\``)
    await warnLogs.send({
      embeds: [em]
    });
    const emUser = new Discord.MessageEmbed()
      .setTitle('Banned')
      .setColor('GREEN')
      .setThumbnail('https://i.imgur.com/BSzzbNJ.jpg')
      .setDescription(`You were banned from **${server}** for ${reason}!`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Ban Appeal Server', `[Join Me](${appeallink})`);
    await toWarn.send({
      embeds: [emUser]
    }).catch((err) => err);
    const emChan = new Discord.MessageEmbed()
      .setDescription(`You have succesfully banned **${toWarn.tag}**.`)
      .setColor('GREEN');
    await interaction.editReply({
      embeds: [emChan]
    });
    warnsDB.set(
      toWarn.id, {
      moderator: moderator.id,
      reason: `(banned) - ${reason}`,
      date: moment(Date.now()).format('LL'),
    },
      `warns.${caseID}`,
    );
    return client.guilds.cache
      .get(serverID)
      .members.ban(toWarn, {reason, days: 7}); //the days section is how many days worth of message should be deleted when the user is banned, must be 0-7 otherwise theres going to be an error
  }
};