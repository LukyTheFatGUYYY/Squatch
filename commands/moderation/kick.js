const moment = require('moment');
const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const { customAlphabet } = require('nanoid')
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks the selected user')
    .addUserOption(option => option.setName('user').setDescription('Please mention the user you would like to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you would like to kick the user').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const warnsDB = new Enmap({ name: 'warns' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;
    const validuser = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.enterValidUser);
    const stateareason = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.errorNoReason);
    const cantkickyourself = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.cantDoAnythingToYourself);
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.errorRolehierarchy);
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
    const emUserKicked = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.user.tag} (${moderator.id})`)
      .addField('Reason', `\`(kicked) - ${reason}\``)
    await warnLogs.send({ embeds: [emUserKicked] });
    const emUser = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('RED')
      .setThumbnail('https://i.imgur.com/3fxf41t.jpg')
      .setDescription(`You were kicked from ${server} for ${reason}, please don't do it again!`)
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
