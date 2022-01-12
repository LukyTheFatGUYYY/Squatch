const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        try {
            console.log(message.constructor.name)
            // Create a file with banned words/links and path to it
            const array = require("../files/other/filter.json")
            if (array.some(word => message.content.toLowerCase().includes(word))) {
                message.delete()
                console.log(message)

                const embed = new MessageEmbed()
                    .setTitle(`${emojis.error} Scam detected`)
                    .setColor("#ff0000")
                    .setDescription(`${message.author.tag} sent a scam link/said a bad word: ||${message.content.toLowerCase()}||`)
                message.channel.send({
                    embeds: [embed]
                })

                // Timeout the User for 12h
                const member = message.guild.members.cache.get(message.author)
                const timeout = await message.member.timeout(43200000)

                const embed2 = new MessageEmbed()
                    .setTitle(`${emojis.error} Scam detected`)
                    .setDescription(`Dear ${message.author.tag}\nYou have received this because you have sent a not-allowed message.\nServer: **${message.guild.name}**\nMessage: ||${message.content.toLowerCase()}||\n\nYour timeout will be removed automatically in exactly **12Hours**.`)
                    .setColor("RED")
                    .setTimestamp()

                message.author.send({
                    embeds: [embed2]
                })
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }
}