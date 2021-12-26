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
        } else if (interaction.isButton()) {
            if (interaction.customId === 'accept')
                interaction.reply({
                    content: `You Accepted ${interaction.user.tag}`
                })
        } else if (interaction.customId === 'decline')
            interaction.reply({
                content: `You Declined ${interaction.user.tag}`
            })
    }
}