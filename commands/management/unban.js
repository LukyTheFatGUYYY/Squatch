const Enmap = require('enmap');
require('moment-duration-format');
const { adminrole } = require('../../config/constants/roles.json');
const { channelLog } = require('../../config/constants/channel.json');
const { serverID } = require('../../config/main.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a specific user'),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (!interaction.member.roles.cache.has(adminrole)) {
      return interaction.editReply(
        "I'm sorry but you have to be an administrator to use this command!",
      );
    }
    const warnsDB = new Enmap({ name: 'warns' });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch((err) => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return interaction.editReply('Please insert the user you want to unban.');
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    client.guilds.cache
      .get(serverID)
      .members.unban(user.id, `unbanning admin - ${interaction.tag}`)
      .catch((err) => err);
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const em = new Discord.MessageEmbed()
      .setTitle('Unbanned')
      .setColor('GREEN')
      .addField('Manager', `${interaction.tag} (${interaction.id})`)
      .addField('User', `${user.tag} (${user.id})`);
    await clearedWarnsLog.send(em);
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription(`I have successfully unbanned **${user.tag}**!`),
      ],
    });
  },
};
