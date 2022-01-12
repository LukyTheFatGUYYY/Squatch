const {
    jointocreatechannel
} = require("../config/constants/channel.json")
const {
    Collection
} = require('discord.js')
const voiceCollection = new Collection()

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, oldState, newState) {
        const user = await client.users.fetch(newState.id);
        const member = newState.member
        if (!oldState && newState.channel.id == jointocreatechannel) {
            const channel = await newState.guild.channels.create(user.tag, {
                type: 'voice',
                parent: newState.channel.parent,
            });
            member.voice.setChannel(channel);
            voiceCollection.set(user.id, channel.id);
        } else if (!newState.channel) {
            if (oldState.channel === voiceCollection.get(newState.id))
                return oldState.channel.delete();
        }
    }
}