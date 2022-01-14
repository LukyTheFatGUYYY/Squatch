const Enmap = require('enmap');
const Discord = require('discord.js');
const { customAlphabet } = require('nanoid')
require('moment-duration-format');
const { staffrole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bean')
    .setDescription('Beans the mention user')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to bean').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you would like to bean them').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const warnsDB = new Enmap({ name: 'warns' });
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You have to be in the moderation team to be able to use this command!');
    const validuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid user');
    const stateareason = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Mention a valid reason to ban the user');
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    if (!interaction.member.roles.cache.has(staffrole)) {
      return interaction.editReply({ embeds: [Prohibited] });
    }
    const toWarn = interaction.options.getUser('user')
    const Server = interaction.member.guild.name;
    if (!toWarn) {
      return interaction.editReply({ embeds: [validuser] });
    }
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = interaction.options.getString('reason');
    if (!reason) {
      return interaction.editReply({ embeds: [stateareason] });
    }
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)
    const caseID = nanoid();
    const emUser = new Discord.MessageEmbed()
      .setTitle('Beaned')
      .setThumbnail('https://i.imgur.com/BSzzbNJ.jpg')
      .setColor('GREEN')
      .setDescription(`You were beaned from **${Server}** for ${reason}!`)
      .addField('Case ID', `\`${caseID}\``)
      .addField('Bean Appeal Link', '[Join Me]()');
    await toWarn.send({ embeds: [emUser] }).catch((err) => err);
    const emChan = new Discord.MessageEmbed()
      .setDescription(`You have succesfully beaned **${toWarn.tag}**.`)
      .setColor('GREEN');
    return await interaction.editReply({ embeds: [emChan] });
  },
};
