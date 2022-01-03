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
        const reportauserembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report a user`)
            .setDescription(tickets.reportUserEmbed)
            .setFooter(`Opened by ${interaction.user.tag}`, `${interaction.user.avatarURL()}`)
        const reportabugembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report a bug`)
            .setDescription(tickets.reportBugEmbed)
            .setFooter(`Opened by ${interaction.user.tag}`, `${interaction.user.avatarURL()}`)
            const otherticketembedtoreport = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report: other`)
            .setDescription(tickets.otherTicketEmbed)
            .setFooter(`Opened by ${interaction.user.tag}`, `${interaction.user.avatarURL()}`)
        const btnClose = new MessageButton()
            .setLabel('Close Ticket')
            .setCustomId('close_ticket')
            .setStyle('DANGER');
        const row = new MessageActionRow()
            .addComponents(
                btnClose
            )

        if (!interaction.isSelectMenu()) return;

        if (interaction.values[0] === 'first_option') {
            await interaction.update({
                embeds: [reportauserembed],
                components: [row]
            })
        } else if (interaction.values[0] === 'second_option') {
            await interaction.update({
                embeds: [reportabugembed],
                components: [row]
            })
        } else if (interaction.values[0] === 'third_option') {
            await interaction.update({
                embeds: [otherticketembedtoreport],
                components: [row]
            })
        }
    }
}