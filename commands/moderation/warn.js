const Enmap = require('enmap');
require('moment-duration-format');
const Discord = require('discord.js');
const moment = require('moment');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { customAlphabet } = require('nanoid')
const { staffrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn the selected user')
    .addUserOption(option => option.setName('user').setDescription('Please mention the user you would like to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you would to warn the user').setRequired(true)),
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
      .setDescription('Mention a valid reason to warn the user');
    const cantwarnyourself = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You cant warn yourself');
    const samerankorhigher = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You can\'t warn that user due to role hierarchy');
    const server = client.guilds.cache.get(serverID);
    if (!interaction.member.roles.cache.has(staffrole)) {
      return interaction.editReply({ embeds: [Prohibited] });
    }
    const toWarn = interaction.options.getUser('user')
    const moderator = interaction.member;
    if (!toWarn) {
      return interaction.editReply({ embeds: [validuser] });
    }
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = interaction.options.getString('reason');
    if (!reason) {
      return interaction.editReply({ embeds: [stateareason] });
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) return interaction.editReply({ embeds: [cantwarnyourself] });
    if (
      server.members.cache.get(moderator.id).roles.highest.rawPosition
      <= (await server.members.fetch(toWarn.id)
        ? (await server.members.fetch(toWarn.id)).roles.highest.rawPosition
        : 0)
    ) {
      return interaction.editReply({ embeds: [samerankorhigher] });
    }
    const warnLogs = server.channels.cache.get(channelLog);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const Server = interaction.guild;
    const em = new Discord.MessageEmbed()
      .setTitle(`Case - ${caseID}`)
      .setColor('GREEN')
      .addField('Member', `${toWarn.tag} (${toWarn.id})`)
      .addField('Moderator', `${moderator.tag} (${moderator.id})`)
      .addField('Reason', `\`(warned) - ${reason}\``)
    await warnLogs.send({ embeds: [em] });
    const emUser = new Discord.MessageEmbed()
      .setTitle('Warned')
      .setColor('RED')
      .setDescription(
        `You were warned in **${Server}** for ${reason}, please don't do it again!`,
      )
      .addField('Case ID', `\`${caseID}\``);
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new Discord.MessageEmbed()
      .setDescription(`You have succesfully warned **${toWarn.tag}**.`)
      .setColor('GREEN');
    await interaction.channel
      .send({ embeds: [emChan] });
    warnsDB.set(
      toWarn.id,
      {
        moderator: moderator.id,
        reason: `(warned) - ${reason}`,
        date: moment(Date.now()).format('LL'),
      },
      `warns.${caseID}`,
    );
  },
};

