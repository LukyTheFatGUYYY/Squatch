const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { verificationchannel, channelLog } = require('../config/constants/channel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Allows you to send a new captcha image'),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    client.emit('guildMemberAdd')
  }
}
