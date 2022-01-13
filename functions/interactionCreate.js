const Discord = require('discord.js')
const {
    MessageActionRow
} = require('discord.js')

const configuration = require('../config/ticket/ticket.json')
const tickets = configuration.tickets

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.editReply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }


        await interaction.deferReply()


        //Embeds for the ticket system
        const closeticket = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle('Ticket Deletion')
            .setDescription('This ticket will be closed in 10 seconds.');
        const reportauserembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report a user`)
            .setDescription(tickets.reportUserEmbed);
        const reportabugembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report a bug`)
            .setDescription(tickets.reportBugEmbed);
        const otherticketembedtoreport = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Report: Other`)
            .setDescription(tickets.otherTicketEmbed);
        const btnClose = new Discord.MessageButton()
            .setLabel('Close Ticket')
            .setCustomId('close_ticket')
            .setStyle('DANGER');
        const row = new MessageActionRow()
            .addComponents(
                btnClose
            )


        //This is for the reaction role buttons - the only thing you should change is the id's that go into the variables and at best the variable names
        if (interaction.isButton()) {
            if (interaction.customId === 'test1') {
                var test1role = ""
                if (interaction.member.roles.cache.has(test1role)) {
                    interaction.member.roles.remove(test1role)
                    interaction.editReply({
                        content: `You removed the <@&${test1role}> role!`
                    })
                } else {
                    interaction.editReply({
                        content: `You recieved the <@&${test1role}> role!`
                    })
                    var test1role = ""
                    interaction.member.roles.add(test1role)
                }
            }
        }


        if (interaction.isButton()) {
            if (interaction.customId === 'test2') {
                var test2role = ""
                if (interaction.member.roles.cache.has(test2role)) {
                    interaction.member.roles.remove(test2role)
                    interaction.editReply({
                        content: `You removed the <@&${test2role}> role!`
                    })
                } else {
                    interaction.editReply({
                        content: `You recieved the <@&${test2role}> role!`
                    })
                    var test2role = ""
                    interaction.member.roles.add(test2role)
                }
            }
        }


        //for the option in the ticket system - lets moderators and members to close the tickets
        if (interaction.isButton()) {
            if (interaction.customId === 'close_ticket') {
                interaction.editReply({
                    embeds: [closeticket]
                })
                setTimeout(() => interaction.channel.delete(), 10000);
                return;
            }
        }


        // For the ticket system - allows the user to select what they want to report
        if (!interaction.isSelectMenu()) return;
        if (interaction.values[0] === 'first_option') {
            await interaction.update({
                embeds: [reportauserembed],
                components: [row]
            })
        }


        if (interaction.values[0] === 'second_option') {
            await interaction.update({
                embeds: [reportabugembed],
                components: [row]
            })
        }
        if (interaction.values[0] === 'third_option') {
            await interaction.update({
                embeds: [otherticketembedtoreport],
                components: [row]
            })
        }
    }
}