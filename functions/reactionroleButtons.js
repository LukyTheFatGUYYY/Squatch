module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'test')
                var javascript = "test"
            interaction.reply({ content: `You recieved the <@&${test}> role!`, ephemeral: true })
            interaction.member.roles.add(javascript)
        } else if (interaction.customId === 'test2')
            var javascript = "test2"
        interaction.reply({ content: `You recieved the <@&${test2}> role!`, ephemeral: true })
        interaction.member.roles.add(test2)
    }
}
