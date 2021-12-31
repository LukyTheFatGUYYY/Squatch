require('moment-duration-format');
const Discord = require('discord.js');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('See either your own avatar or another users avatar')
    .addUserOption(option => option.setName('user').setDescription('Please select another user')),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const member = interaction.options.getMember("user") ?? interaction.member
    const em = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`${member.user.tag}'s avatar`)
      .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true }));
    if (interaction.member.id != member.id) {
      em.setFooter(`Requested by ${interaction.user.tag}`);
    }
    interaction.editReply({ embeds: [em] });
  },
};
