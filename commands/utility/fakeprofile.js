const Discord = require('discord.js');
const faker = require('faker');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fakeprofile')
    .setDescription('generates a fake profile'),
  async execute(interaction, client) {
    await interaction.deferReply({ephemeral: true});
    var randomName = faker.name.findName()
    var randomEmail = faker.internet.email();
    var randomImage = faker.image.image();
    var randomIP = faker.internet.ip();
    var randomuserAgent = faker.internet.userAgent();
    var randomIPv6 = faker.internet.ipv6();
    var randomPassword = faker.internet.password();
    const fakeprofile = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setThumbnail(`${randomImage}`)
      .setTitle('Fake profile')
      .addField(`Name`, `${randomName}`)
      .addField(`Email`, `${randomEmail}`)
      .addField(`\u200B`, '\u200b')
      .addField(`Internet Protocal`, `${randomIP}`)
      .addField(`IPV6`, `${randomIPv6}`)
      .addField(`User Agent`, `${randomuserAgent}`)
      .addField(`Common Password`, `${randomPassword}`)
    interaction.editReply({ embeds: [fakeprofile] });
  },
};
