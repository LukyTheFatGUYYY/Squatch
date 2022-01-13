const Discord = require('discord.js');
const faker = require('faker');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fakeprofile')
    .setDescription('Generates a fake profile'),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    var randomName = faker.name.findName()
    var randomEmail = faker.internet.email();
    var randomImage = faker.image.image();
    var jobTitle = faker.name.jobTitle();
    var phoneNumber = faker.phone.phoneNumber();
    var vehicle = faker.vehicle.vehicle();

    var randomIP = faker.internet.ip();
    var randomuserAgent = faker.internet.userAgent();
    var randomIPv6 = faker.internet.ipv6();
    var randomPassword = faker.internet.password();
    var userName = faker.internet.userName()
    var mac = faker.internet.mac()

    var bitcoinAddress = faker.finance.bitcoinAddress();
    var litecoinAddress = faker.finance.litecoinAddress();
    var ethereumAddress = faker.finance.ethereumAddress();
    var creditCardNumber = faker.finance.creditCardNumber();
    var creditCardCVV = faker.finance.creditCardCVV();
    var routingNumber = faker.finance.routingNumber();
    const fakeprofile = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setThumbnail(`${randomImage}`)
      .setTitle('Fake profile')
      .addField(`__General Information__\nName`, `${randomName}`)
      .addField(`Email`, `${randomEmail}`)
      .addField(`Job Title`, `${jobTitle}`)
      .addField(`Phone Number`, `${phoneNumber}`)
      .addField(`Current Vehicle`, `${vehicle}`)
      .addField(`\u200B`, '\u200b')
      .addField(`__Internet Information__\nUsername`, `${userName}`)
      .addField(`Common Password`, `${randomPassword}`)
      .addField(`IP`, `${randomIP}`)
      .addField(`IPV6`, `${randomIPv6}`)
      .addField(`User Agent`, `${randomuserAgent}`)
      .addField(`Mac`, `${mac}`)
      .addField(`\u200B`, '\u200b')
      .addField(`__Financial Information__\nBitcoin Address`, `${bitcoinAddress}`)
      .addField(`Litecoin Address`, `${litecoinAddress}`)
      .addField(`Ethereum Address`, `${ethereumAddress}`)
      .addField(`Credit Card Number`, `${creditCardNumber}`)
      .addField(`Credit Card CVV`, `${creditCardCVV}`)
      .addField(`outing Number`, `${routingNumber}`)
    interaction.editReply({ embeds: [fakeprofile] });
  },
};
