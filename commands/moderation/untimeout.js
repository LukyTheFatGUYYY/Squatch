const {
    Message,
    MessageEmbed,
    Client
} = require("discord.js");
const Discord = require('discord.js')
const { adminrole } = require('../../config/constants/roles.json');
const { serverID } = require('../../config/main.json');
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('removes the timeout from the selected user')
        .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you want to put them in a timeout').setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'no reason provided'
        const server = client.guilds.cache.get(serverID);
        const moderator = interaction.member;
        const Prohibited = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Prohibited User')
            .setDescription(
                'You have to be in the moderation team to be able to use this command!',
            );
        const samerankorhigher = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('You can\'t kick that user due to role hierarchy');
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
        interaction.editReply(`Removed Timeout of the member: ${user.user.tag.toString()}`);
    },
};