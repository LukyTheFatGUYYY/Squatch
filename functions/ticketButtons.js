const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const closeticket = new MessageEmbed()
        .setColor("GREEN")
        .setTitle('Ticket Deletion')
        .setDescription('This ticket will be closed in 10 seconds.')
        .setFooter(`Closed by ${interaction.user.tag}`, `${interaction.user.avatarURL()}`);
        if (interaction.isButton()) {
            if (interaction.customId === 'close_ticket')
                interaction.reply({
                    embeds: [closeticket]
                })
            setTimeout(() => interaction.channel.delete(), 10000);
            return;

        }
    }
}
