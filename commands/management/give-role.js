const Discord = require('discord.js');
const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const { adminrole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { channelLog } = require('../../config/constants/channel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('gives the selected user a role')
    .addUserOption(option => option.setName('user').setDescription('Please mention the user who should recieve the role').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Select a role you would like to give to the user').setRequired(true)),
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
    const rolegiven = client.channels.cache.get(channelLog);
    if (!interaction.member.roles.cache.has(adminrole)) return interaction.reply({ embeds: [Prohibited] });
    if (!member) return interaction.editReply({ embeds: [Error] });

    try {
      const roleName = interaction.options.getRole('role');

      if (!roleName) return interaction.editReply({ embeds: [RoleError] });

      // get position of role - gives you integer
      const userRolePosition = interaction.member.roles.highest.position;
      const selectedRolePosition = roleName.position;

      if (userRolePosition < selectedRolePosition) {
        const youdonthaveaccess = new Discord.MessageEmbed()
          .setTitle(embedMSG.missingRolePermission)
          .setColor(embedMSG.errorColor)

        return interaction.editReply({ embeds: [youdonthaveaccess] })
      }

      const alreadyHasRole = await member.roles.cache.has(roleName.id);

      if (alreadyHasRole) {
        return interaction.channel
          .send({ embeds: [AlreadyHas] })
      }
      const wowitworked = new Discord.MessageEmbed()
        .setTitle('Role successfully recieved')
        .setColor(embedMSG.successfulColor)
        .setDescription(
          `**Moderator:** ${interaction.user}\n**Role Recieved:** ${roleName}\n**Member:** ${member.user}`,
        );
      rolegiven.send({ embeds: [wowitworked] });
      return member.roles.add(roleName).then(() => interaction.editReply({ embeds: [wowitworked] }));
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [RoleError] });
    }
  }
};
