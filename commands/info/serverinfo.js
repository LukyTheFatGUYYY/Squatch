const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('lists information about the server'),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { guild } = interaction;
    const owner = await guild.fetchOwner();
    const serverOwner = client.users.cache.get(owner.id);
    const categories = await guild.channels.cache.filter((channel) => channel.type === "GUILD_CATEGORY").size;
    const textChannels = await guild.channels.cache.filter((channel) => channel.type === "GUILD_TEXT").size;
    const voiceChannels = await guild.channels.cache.filter((channel) => channel.type === "GUILD_VOICE").size;
    const newsChannels = await guild.channels.cache.filter((channel) => channel.type === "GUILD_NEWS").size;
    const stageChannels = await guild.channels.cache.filter((channel) => channel.type === "GUILD_STAGE_VOICE").size;
    const totalChannels = categories + textChannels + voiceChannels + newsChannels + stageChannels;
    const totalMembers = await guild.memberCount;
    const humanMembers = await guild.members.cache.filter((m) => !m.user.bot).size;
    const botMembers = await guild.members.cache.filter((m) => m.user.bot).size;
    const totalEmojis = await guild.emojis.cache.size;
    const normalEmojis = await guild.emojis.cache.filter((e) => !e.animated).size;
    const animatedEmojis = await guild.emojis.cache.filter((e) => e.animated).size;
    const boostLevel = await guild.premiumTier ? guild.premiumTier : "0";
    const totalBoosts = await guild.premiumSubscriptionCount || "0";
    const serverInfoEmbed = new Discord.MessageEmbed()
      .setTitle("Server Information")
      .setColor("GREEN")
      .addFields(
        { name: `**Server Name:**`, value: `\`\`\`${guild.name}\`\`\``, inline: true },
        { name: `**Server Owner:**`, value: `\`\`\`${serverOwner.tag}\`\`\``, inline: true },
        { name: `**Server Members [ ${totalMembers} ]:**`, value: `\`\`\`Members: ${humanMembers} | Bots: ${botMembers}\`\`\``, inline: false },
        { name: `**Server ID:**`, value: `\`\`\`${guild.id}\`\`\``, inline: true },
        { name: `**Server Emojis [ ${totalEmojis} ]:**`, value: `\`\`\`Normal: ${normalEmojis} | Animated: ${animatedEmojis}\`\`\``, inline: false },
        { name: `**Server Categories and Channels [ ${totalChannels} ]:**`, value: `\`\`\`Categories: ${categories} | Text: ${textChannels} | Voice: ${voiceChannels} | Announcement: ${newsChannels} | Stage: ${stageChannels}\`\`\``, inline: false },
        { name: `**Server Boost Level:**`, value: `\`\`\`${boostLevel}\`\`\``.replace("NONE", "0"), inline: true },
        { name: `**Server Boosts Amount:**`, value: `\`\`\`${totalBoosts}\`\`\``, inline: true },
        { name: `**Creation Date:**`, value: `\`\`\`${moment(guild.createdTimestamp).format("LT")} ${moment(guild.createdTimestamp).format("LL")} (${moment(guild.createdTimestamp).fromNow()})\`\`\``, inline: false },
      );

    interaction.editReply({ embeds: [serverInfoEmbed] });
  },
};