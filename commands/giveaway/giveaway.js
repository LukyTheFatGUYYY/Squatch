const Nuggies = require('nuggies');
const { adminrole } = require('../../config/constants/roles.json');
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway!')
        .addStringOption(option => option.setName('prize').setDescription('Enter what the prize for the giveaway should be').setRequired(true))
        .addNumberOption(option => option.setName('winners').setDescription('Enter the total amount of winners there should be').setRequired(true))
        .addStringOption(option => option.setName('endafter').setDescription('Enterhow long the giveaway should last').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role you must have to enter the giveaway').setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        let requirements = {};
        if (!interaction.member.roles.cache.has(adminrole)) return interaction.editReply({ content: 'You are not allowed to use this command!' });
        const prize = interaction.options.getString('prize');
        const host = interaction.user.id;
        const winners = parseInt(interaction.options.getNumber('winners'));
        if (interaction.options.getRole('role')) {
            const role = interaction.options.getRole('role');
            requirements = { enabled: true, roles: [role.id] };
        }

        Nuggies.giveaways.create(client, {
            message: interaction,
            prize: prize,
            host: host,
            winners: winners,
            endAfter: interaction.options.getString('endafter'),
            requirements: requirements,
            channelID: interaction.channel.id,
        });

        interaction.editReply({ content: 'Created a Giveaway!' });
    }
};