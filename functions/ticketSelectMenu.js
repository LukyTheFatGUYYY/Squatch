const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js')
const configuration = require('../config/ticket/ticket.json')
const tickets = configuration.tickets

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'ticket_category_menu') {
            await interaction.update({
                content: 'Something was selected!',
                components: []
            });
        }
    }
}