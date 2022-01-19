const Discord = require('discord.js');
const { pmanager, prole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const { channelLog } = require('../../config/constants/channel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pgive')
    .setDescription('give a partner the partner role')
    .addUserOption(option => option.setName('user').setDescription('Please mention the user').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.prohibitedEmbedTitle)
      .setDescription(embedMSG.prohibitedEmbedDesc)
      ;

    const Roletaken = new Discord.MessageEmbed()
      .setColor(embedMSG.successfulColor)
      .setTitle(embedMSG.commandWentWellTitle)
      .setDescription(embedMSG.roleHasBeenRemoved);
    const Error = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.wrongCommandFormatDesc);
    const RoleError = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.roleDoesntExist);

    const member = interaction.options.getMember('user')
    if (!interaction.member.roles.cache.has(pmanager)) return interaction.editReply({ embeds: [Prohibited] });
    if (!member) return interaction.editReply({ embeds: [Error] });

    try {
      const alreadyHasRole = await member.roles.cache.has(prole);

      if (alreadyHasRole) {
        member.roles.remove(prole)
        return interaction.editReply({ embeds: [Roletaken] })
      }

      const wowitworked = new Discord.MessageEmbed()
        .setTitle('Role successfully recieved')
        .setColor(embedMSG.successfulColor)
        .setDescription(
          `**Moderator:** ${interaction.user}\n**Role Recieved:** ${prole}\n**Member:** ${member.user}`,
        );
      return member.roles.add(prole).then(() => interaction.editReply({ embeds: [wowitworked] }));
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [RoleError] });
    }
  }
};
