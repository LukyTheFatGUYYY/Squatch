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
    const member = newState.member
    if (!oldState.channel && newState.channel.id === jointocreatechannel) {
      const channel = await newState.guild.channels.create(newState.member.user.tag, {
        type: 'GUILD_VOICE',
        parent: newState.channel.parent,
      });
      member.voice.setChannel(channel);
      voiceCollection.set(newState.member.user.id, channel.id);
    } else if (!newState.channel && oldState.channel.id === voiceCollection.get(newState.member.id))
      return oldState.channel.delete();
  }
}