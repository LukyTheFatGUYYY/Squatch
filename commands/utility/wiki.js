const Discord = require('discord.js');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('bans the selected user')
    .addStringOption(option => option.setName('search').setDescription('please enter what you would like to search for').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ephemeral: true});
    const search = interaction.options.getString('search');
    const error = new Discord.MessageEmbed()
      .setTitle("Error")
      .addField(`Please enter something to search for`, 'You will get a link to the correct wikipedia article')
      .setColor("RED");
    if (!interaction) {
      return interaction.editReply({ embeds: [error] });
    }
    const link = `https://www.wikipedia.org/w/index.php?search=${search}&ns0=1`;
    const embed = new Discord.MessageEmbed()
      .setTitle("Wikipedia Search")
      .addField(`You Searched for:`, `${interaction}`)
      .addField(`Results:`, `[Link to the article](${link})`)
      .setColor("GREEN");

    interaction.editReply({ embeds: [embed] });
  },
};