const Enmap = require('enmap');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.tickets
const Discord = require('discord.js')
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban the specified user')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user in which you would like to unban').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;
    const includeuser = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.enterValidUser);
    if (!interaction.member.roles.cache.has(adminrole)) {
      return interaction.editReply({ embeds: [Prohibited] });
    }
    const warnsDB = new Enmap({ name: 'warns' });
    const user = interaction.options.getUser('user')
    if (!user) return interaction.editReply({ embeds: [includeuser] });
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    client.guilds.cache
      .get(serverID)
      .members.unban(user.id, `unbanning admin - ${interaction.tag}`)
      .catch((err) => err);
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const usergotunbanned = new Discord.MessageEmbed()
      .setTitle('Unbanned')
      .setColor('GREEN')
      .addField('Manager', `${interaction.tag} (${interaction.id})`)
      .addField('User', `${user.tag} (${user.id})`);
    await clearedWarnsLog.send({ embeds: [usergotunbanned] });
    return interaction.editReply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`I have successfully unbanned **${user.tag}**!`),
      ],
    });
  },
};
