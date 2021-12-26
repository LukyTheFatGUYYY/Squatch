const moment = require('moment');
const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const { customAlphabet } = require('nanoid')
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('kicks the selected user')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you want to kick them').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const warnsDB = new Enmap({ name: 'warns' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
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
      .setDescription('Mention a valid reason to kick the user');
    const cantkickyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant kick yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t kick that user due to role hierarchy');
    const server = client.guilds.cache.get(serverID);
    if (!interaction.member.roles.cache.has(staffrole)) {
      interaction.editReply({
        embeds: [Prohibited]
      });
    }
    const toWarn = interaction.options.getUser('user')
    const moderator = interaction.member;
    if (!toWarn) {
      interaction.editReply({
        embeds: [validuser]
      });
    }
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = interaction.options.getString('reason');
    if (!reason) {
      interaction.editReply({
        embeds: [stateareason]
      });
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) interaction.editReply({
      embeds: [cantkickyourself]
    });
    if (
      server.members.cache.get(moderator.id).roles.highest.rawPosition
      <= (server.members.cache.get(toWarn.id)
        ? server.members.cache.get(toWarn.id).roles.highest.rawPosition
        : 0)
    ) {
      interaction.editReply({
        embeds: [samerankorhigher]
      });
    }
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const em = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(kicked) - ${reason}\``)
    await warnLogs.send({ embeds: [em] });
    const emUser = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('RED')
      .setImage('https://i.imgur.com/3fxf41t.jpg')
      .setDescription(
        `You were kicked from ${server} for ${reason}, please don't do it again!`,
      )
      .addField('Case ID', `\`${caseID}\``);
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new Discord.MessageEmbed()
      .setDescription(`You have succesfully kicked **${toWarn.tag}**.`)
      .setColor("GREEN");
    await interaction.editReply({ embeds: [emChan] });
    warnsDB.set(
      toWarn.id,
      {
        moderator: moderator.id,
        reason: `(kicked) - ${reason}`,
        date: moment(Date.now()).format('LL'),
      },
      `warns.${caseID}`,
    );
    return interaction.guild.members.cache.get(toWarn.id).kick(reason);
  },
};
