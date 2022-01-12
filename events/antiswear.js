const {
    MessageEmbed
} = require("discord.js");

const {
    channelLog
} = require('../config/constants/channel.json');

const {
    serverID
} = require('../config/main.json');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        try {
            // Create a file with banned words/links and path to it
            const array = require("../files/other/filter.json")
            if (array.some(word => message.content.toLowerCase().includes(word))) {
                message.delete()
                const server = client.guilds.cache.get(serverID);
                const warnLogs = server.channels.cache.get(channelLog);

                const embed = new MessageEmbed()
                    .setTitle(`❌ Message Deleted`)
                    .setColor("#ff0000")
                    .addField(`User`, `${message.author.tag}`)
                    .addField(`Word`, `${message.content.toLowerCase()}`)
                warnLogs.send({
                    embeds: [embed]
                })

                // Timeout the User for 12h
                //const member = message.guild.members.cache.get(message.author)
                //const timeout = await message.member.timeout(43200000)

                const embed2 = new MessageEmbed()
                    .setTitle(`❌ Message Deleted`)
                    .setDescription("You have received this because you have sent a restricted message")
                    .addField(`Message:`, `${message.content.toLowerCase()}`)
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