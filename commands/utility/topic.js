const randomTopic = require('table-topic-generator');
require('moment-duration-format');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('topic')
    .setDescription('bans the selected user'),
  async execute(interaction, client) {
    await interaction.deferReply();
    const topic = randomTopic(7, 'Summer', 'Vacation', 'Family', 'Time', 'People', 'Favorite', 'Memories');
    interaction.editReply("New topic")
    return interaction.channel.send(topic);
  },
};
