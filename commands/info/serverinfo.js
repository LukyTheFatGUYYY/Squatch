const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');
const { discordlink } = require('../../config/main.json');
const { adminrole, staffrole } = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('lists the current server information'),
  async execute(interaction, client) {
    await interaction.deferReply();
    const server = interaction.guild;
    const boosterEmoji = ':diamonds:';
    const boostersCount = server.premiumSubscriptionCount;
    const boosterLevel = server.premiumTier;
    const serverOptions = server.features.join(', ').replace(/_/g, ' ').split(', ').join(' | ');
    const memberCount = server.memberCount.toLocaleString();
    const staffCount = server.members.cache.filter((m) => m.roles.cache.has(staffrole)).size.toLocaleString();
    const managerCount = server.members.cache.filter((m) => m.roles.cache.has(adminrole)).size.toLocaleString();
    const textChannels = server.channels.cache.filter((c) => c.type == 'text').size.toLocaleString();
    const voiceChannels = server.channels.cache.filter((c) => c.type == 'voice').size.toLocaleString();
    const categories = server.channels.cache.filter((c) => c.type == 'category').size.toLocaleString();
    const roleCount = server.roles.cache.size.toLocaleString();
    const humanCount = server.members.cache.filter((m) => !m.user.bot).size.toLocaleString();
    const botsCount = server.members.cache.filter((m) => m.user.bot).size.toLocaleString();
    const em = new Discord.MessageEmbed()
      .setTitle('information for ', server.name)
      .setThumbnail(server.iconURL({ format: 'png', dynamic: true }))
      .setColor("PURPLE")
      .addField('Owner', `<@${server.ownerId}>`)
      .addField('Server ID', server.id)
      .addField('Staff Count', staffCount)
      .addField('Manager Count', managerCount)
      .addField('Role Count', roleCount)
      .addField(`Created At [${moment(server.createdTimestamp).fromNow()}]`, moment(server.createdTimestamp).format('LLL'))
      .addField(`Boosters [${boostersCount}]`, `${boosterEmoji} Level ${boosterLevel}`)
      .addField(`Members [${memberCount}]`, `👤 ${humanCount} | 🤖 ${botsCount}`)
      .addField(`Channels [${server.channels.cache.size.toLocaleString()}]`, `⌨️ ${textChannels} | 🗣️ ${voiceChannels} | 📂 ${categories}`)
      .addField('Server invite', `${discordlink}`);
      interaction.editReply({ embeds: [em] });
  },
};
