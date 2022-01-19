const Discord = require('discord.js');
const casual = require('casual');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fakeprofile')
    .setDescription('generates a fake profile'),
  async execute(interaction, client) {
    await interaction.deferReply({ephemeral: true});
    var randomName = casual.full_name 
    var randomEmail = casual.email
    var jobTitle = casual.company_name
    var phoneNumber = casual.phone

    var randomIP = casual.ip
    var randomuserAgent = casual.user_agent
    var randomPassword = casual.password  
    var userName = casual.username
    var uuid = casual.uuid    

    var cardType = casual.card_type
    var cardExpire = casual.card_number()
    const fakeprofile = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Fake profile')
      .addField(`__General Information__\nName`, `${randomName}`)
      .addField(`Email`, `${randomEmail}`)
      .addField(`Job Title`, `${jobTitle}`)
      .addField(`Phone Number`, `${phoneNumber}`)
      .addField(`\u200B`, '\u200b')
      .addField(`__Internet Information__\nUsername`, `${userName}`)
      .addField(`Common Password`, `${randomPassword}`)
      .addField(`IP`, `${randomIP}`)
      .addField(`User Agent`, `${randomuserAgent}`)
      .addField(`UUID`, `${uuid}`)
      .addField(`\u200B`, '\u200b')
      .addField(`__Financial Information__\nCard Type`, `${cardType}`)
      .addField(`Litecoin Address`, `${cardExpire}`)
    interaction.editReply({ embeds: [fakeprofile] });
  },
};
