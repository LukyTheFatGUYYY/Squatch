const { supportrole } = require('../../config/constants/roles.json');
const { ticketCategory } = require('../../config/constants/channel.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
  .setName('handle')
  .setDescription('allows a moderator to handle a specific ticket'),
async execute(interaction, client) {
  await interaction.deferReply();
    const Prohibited = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You don\'t have enough permission to do that!');

    const Claimedticket = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Success')
      .setDescription(`${message.author.username} claimed this ticket!`);

    if (!message.member.roles.cache.has(supportrole)) {
      const m = await message.channel.send({ embeds: [Prohibited] });
      return setTimeout(() => m.delete(), 5000);
    }

    if (message.channel.parentId !== ticketCategory) {
      const m = await message.channel.send(':x: You can\'t do that here!');
      return setTimeout(() => m.delete(), 5000);
    }

    message.channel.setName(`${message.channel.name} - 🚩 - ${message.author.username}`);

    message.channel.send({ embeds: [Claimedticket] });
  },
};
