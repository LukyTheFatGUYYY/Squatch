const Discord = require('discord.js')
const { adminrole } = require('../../config/constants/roles.json');
const { serverID } = require('../../config/main.json');
const ms = require('ms')
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('timeout the selected user')
        .addUserOption(option => option.setName('user').setDescription('Please enter the user you would like to timeout').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Please enter the reason why you want to put them in a timeout').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('How long do you want them to be in a timeout for?').setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();
        const user = interaction.options.getMember('user');
        const length = interaction.options.getString('time');
        const reason = interaction.options.getString('reason');
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

        const timer = ms(length);
        if (!timer)
            return interaction.editReply("Please specify the time!");

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
        const Tembed = new Discord.MessageEmbed()
            .setTitle('Timeout')
            .setThumbnail(user.displayAvatarURL({
                dynamic: true
            }))
            .setColor('DARK_PURPLE')
            .addFields({
                name: 'Member Name',
                value: user.user.tag.toString(),
                inline: false
            }, {
                name: 'Reason',
                value: `${reason.toString()}`,
                inline: false
            }, {
                name: 'Time',
                value: `${length.toString()}`,
                inline: true
            })
            .setTimestamp()

        user.timeout(timer, reason);
        interaction.editReply({
            embeds: [Tembed]
        });
    },
};