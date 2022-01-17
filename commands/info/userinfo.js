const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('lists information about yourself or another user')
    .addUserOption(option => option.setName('user').setDescription('Please mention a user you would like the information for')),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    var permissions = [];
    var acknowledgements = 'None';

    const member = interaction.options.getMember('user') ?? interaction.member;
    let userRoles = member.roles.cache.map((x) => x).filter((z) => z.name !== "@everyone");

    if (userRoles.length > 100) {
      userRoles = "More than 100";
    }

    let safe = member.createdTimestamp;

    if (safe > 604800017) {
      safe = "`Not Suspicious` <:online2:891613501326524446>";
    } else {
      safe = "`Suspicious` <:dnd:891613707266846720>";
    }
    let memberStatm;
    let memberStat = member.status;
    if (memberStat === "online") memberStatm = `🟢`;
    if (memberStat === "offline") memberStatm = `⚫️`;
    if (memberStat === "idle") memberStatm = `🌙`;
    if (memberStat === "dnd")
      memberStatm = `⛔"`;

    let nitroBadge = member.user.avatarURL({ dynamic: true });
    let flags = member.user.flags.toArray().join(``);

    if (!flags) {
      flags = "None";
    }

    flags = flags.replace(
      "HOUSE_BRAVERY",
      "• <:hypesquad_bravery:891614818358935554>`HypeSquad Bravery`"
    );
    flags = flags.replace(
      "EARLY_SUPPORTER",
      "• <:earlysupporter:891614969907540018> `Early Supporter`"
    );
    flags = flags.replace(
      "VERIFIED_DEVELOPER",
      "• <:verified:891615196131500062>  `Verified Bot Developer`"
    );
    flags = flags.replace(
      "EARLY_VERIFIED_DEVELOPER",
      "• <:verified:891615196131500062> `Verified Bot Developer`"
    );
    flags = flags.replace(
      "HOUSE_BRILLIANCE",
      "• <:hypesquad_brilliance:891615579075674163> `HypeSquad Brilliance`"
    );
    flags = flags.replace(
      "HOUSE_BALANCE",
      "• <:hypesquad_balance:891615798219661322>`HypeSquad Balance`"
    );
    flags = flags.replace(
      "DISCORD_PARTNER",
      "• <:partnerbadge:891615958056173628> `Partner`"
    );
    flags = flags.replace(
      "HYPESQUAD_EVENTS",
      "• <:events:891616123190128660> `Hypesquad Events`"
    );
    flags = flags.replace(
      "DISCORD_CLASSIC",
      "• <:nitro:891616269260955658> `Discord Classic`"
    );


    let stat = member.presence?.activities[0] || "N/A"
    let custom;

    if (member.presence?.activities.some((r) => r.name === "Spotify")) {
      custom = "Listening to Spotify";
    } else if (stat && stat.name !== "Custom Status") {
      custom = stat.name;
    } else {
      custom = "None";
    }

    if (
      member.presence?.activities.some((r) => r.name !== "Spotify") &&
      stat &&
      stat.state !== null
    ) {
      stat = stat.state;
    } else {
      stat = "None";
    }
    if (member.permissions.has("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (member.permissions.has("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (member.permissions.has("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (member.permissions.has("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (member.permissions.has("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (member.permissions.has("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (member.permissions.has("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (member.permissions.has("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (member.permissions.has("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
      permissions.push("Manage Emojis");
    }

    if (permissions.length == 0) {
      permissions.push("No Key Permissions Found");
    }

    if (member.user.id == interaction.guild.ownerId) {
      acknowledgements = 'Server Owner';
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor({name: `Information about ${member.displayName}`})
      .setColor('#2F3136')
      .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setTimestamp()
      .addField(`__User info__\n• ID`, `${member.id}`)
      .addField(`• Profile`, `${member}`)
      .addField(`• Bot?`, `${member.user.bot ? "Yes" : "No"}`)
      .addField(`• Created At:`, `${moment(member.user.createdAt).format("MMMM Do YYYY, H:mm:ss a")}`)
      .addField(`__Member Info__\n• Username:`, `${member.displayName}`)
      .addField(`• Tag`, `${member.user.discriminator}`)
      .addField(`• Nickname:`, `${member.nickname ? member.nickname : "No Nickname"}`)
      .addField(`• Joined At:`, `${moment(member.joinedAt).format("MMMM Do YYYY, H:mm:ss a")}`)
      .addField(`• Activity`, `${custom}`)
      .addField(`__Roles:__`, `${userRoles || `No roles`} `)
      .addField(`__Badge Information__`, `${flags}`)
      .addField(`__Boosting Since:__`, `• ${member.premiumSince ? member.premiumSince : "Not a server booster!"}`)
      .addField(`__Suspicious Check__`, `•  ${safe || `Safe`}`)
      .addField(`__Permissions:__`, `• ${permissions.join(` | `)}`)
      .addField(`__Acknowledgements__`, `• ${acknowledgements}`)
      .setColor("GREEN")


    interaction.editReply({ embeds: [embed] });
  },
}