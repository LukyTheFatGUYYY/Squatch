const configuration = require('../../config/embed/embedMsg.json')
const embedMSG = configuration.messages
const Discord = require('discord.js')
const {
    adminrole
} = require('../../config/constants/roles.json');
const {
    serverID
} = require('../../config/main.json');
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    channelLog
} = require('../../config/constants/channel.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Removes the timeout from a selected user')
        .addUserOption(option => option.setName('user').setDescription('Please mention the user with an ongoing timeout').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you would like to remove the timeout').setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'no reason provided'
        const server = client.guilds.cache.get(serverID);
        const moderator = interaction.member;
        const warnLogs = server.channels.cache.get(channelLog);

        const Prohibited = new Discord.MessageEmbed()
            .setColor(embedMSG.errorColor)
            .setTitle(embedMSG.prohibitedEmbedTitle)
            .setDescription(embedMSG.prohibitedEmbedDesc)
            ;
        const samerankorhigher = new Discord.MessageEmbed()
            .setColor(embedMSG.errorColor)
            .setTitle(embedMSG.errorEmbedTitle)
            .setDescription(embedMSG.errorRolehierarchy);
        const userhasbeenremoved = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Success')
            .setDescription(`${user.user.tag.toString()} has successfully been removed from the timeout`);
        if (!interaction.member.roles.cache.has(adminrole)) {
            return interaction.editReply({
                embeds: [Prohibited]
            });
        }
        if (
            server.members.cache.get(moderator.id).roles.highest.rawPosition <=
            (server.members.cache.get(user.id) ?
                server.members.cache.get(user.id).roles.highest.rawPosition :
                0)
        ) {
            interaction.editReply({
                embeds: [samerankorhigher]
            });
        }

        user.timeout(null, reason);
        interaction.editReply({ embeds: [userhasbeenremoved] });
        await warnLogs.send({
            embeds: [userhasbeenremoved]
        });
    },
};