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

    const AlreadyHas = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.alreadyHasRole);
    const Error = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.wrongCommandFormatDesc);
    const RoleError = new Discord.MessageEmbed()
      .setColor(embedMSG.errorColor)
      .setTitle(embedMSG.errorEmbedTitle)
      .setDescription(embedMSG.roleDoesntExist);

    const member = interaction.options.getMember('user')
    if (!interaction.member.roles.cache.has(pmanager)) return interaction.reply({ embeds: [Prohibited] });
    if (!member) return interaction.editReply({ embeds: [Error] });

    try {
      const roleName = interaction.guild.roles.cache.has(prole)
      if (!roleName) return interaction.editReply({ embeds: [RoleError] });
      const userRolePosition = interaction.member.roles.highest.position;
      const selectedRolePosition = roleName.position;

      if (userRolePosition < selectedRolePosition) {
        const embed = new Discord.MessageEmbed()
          .setTitle("You don't have access to selected role.")
          .setColor("RED")

        return interaction.editReply({ embeds: [embed] })
      }

      const alreadyHasRole = await member.roles.cache.has(roleName.id);

      if (alreadyHasRole) {
        return interaction.channel
          .send({ embeds: [AlreadyHas] })
      }

      const wowitworked = new Discord.MessageEmbed()
        .setTitle('Role successfully recieved')
        .setColor("GREEN")
        .setDescription(
          `**Moderator:** ${interaction.user}\n**Role Recieved:** ${roleName}\n**Member:** ${member.user}`,
        );
      return member.roles.add(roleName).then(() => interaction.editReply({ embeds: [wowitworked] }));
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [RoleError] });
    }
  }
};
