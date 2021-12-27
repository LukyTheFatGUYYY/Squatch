const Discord = require('discord.js');
const { staffrole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { channelLog } = require('../../config/constants/channel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('gives the selected user a role')
    .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to kick').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Prohibited User')
      .setDescription('You are prohibited from doing this command');

    const AlreadyHas = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('User already has that role');

    const Error = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Error - Use format giverole <member> <role>');

    const RoleError = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Role doesnt exist');
    const member = interaction.options.getMember('user')
    if (!interaction.member.roles.cache.has(staffrole)) return interaction.reply({ embeds: [Prohibited] });
    if (!member) return interaction.editReply({ embeds: [Error] });

    try {
      const roleName = interaction.options.getRole('role');

      if (!roleName) return interaction.editReply({ embeds: [RoleError] });

      // get position of role - gives you integer
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
