const Discord = require('discord.js');
const {
  staffapplicationChannel,
} = require('../../config/constants/channel.json');
const {
  staffmanagerrole
} = require('../../config/constants/roles.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('apply for staff'),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (interaction.channel.type !== 'DM') {
      const Application = new Discord.MessageEmbed()
        .setTitle('Application')
        .setDescription("Please check your DM's for the application")
        .setColor('GREEN');
        interaction.editReply({
        embeds: [Application]
      });
    }
    const filter = (userinput) => userinput.author.id === interaction.id;
    const cancel = new Discord.MessageEmbed()
      .setTitle('Cancelled')
      .setDescription('You have successfully cancelled this application')
      .setColor('RED');
    const success = new Discord.MessageEmbed()
      .setTitle('Success')
      .setDescription("You have successfully submitted your application\nIf you don't recieve a response then most likely you have been denied")
      .setColor('GREEN');
    const tomanychars = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription("Too many characters")
      .setColor('RED');
    const outoftime = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription("Out of time")
      .setColor('RED');
    const questions = [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    const questionEmbed = new Discord.MessageEmbed();
    responses = [];
    let exitFlag = false;
    const skip = responses.length > 0;
    const author = interaction.user;
    for (i = 0; i < questions.length; i++) {
      if (skip) break;
      questionEmbed.setTitle(`Question ${i + 1}`);
      questionEmbed.setDescription(questions[i]);
      const userinput = await author.send({embeds: [questionEmbed]});
      await userinput.channel
        .awaitMessages({
          filter: filter,
          time: 5 * 60000,
          max: 1,
          errors: ['time'],
        })
        .then((resp) => {
          if (resp.first().content.toLowerCase() === 'cancel') {
            author.send({
              embeds: [cancel]
            });
            exitFlag = true;
          }
          if (responses.join('').length + resp.first().content.length > 4096) {
            author.send({
              embeds: [tomanychars]
            });
            exitFlag = true;
          }
          responses.push(resp.first());
        })
        .catch((collected) => {
          if (collected.length) return;
          interaction.author.send({
            embeds: [outoftime]
          });
          exitFlag = true;
        });
      if (exitFlag) return;
    }
    if (exitFlag) return;
    interaction.author.send(({
      embeds: [success]
    })).then(async () => {
      const dataEmbed = new Discord.MessageEmbed().setTitle(`Application Submitted by ${interaction.tag}`);
      body = '';
      for (i = 0; i < responses.length; i++) {
        body += `\n**${questions[i]}**\n${responses[i]}\n`;
      }
      body = body.trim(); // remove extra whitespace (extra \n at the end)
      dataEmbed.setDescription(body)
      const buttonsRow = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
          .setCustomId('accept')
          .setLabel('Accept')
          .setStyle('SUCCESS'),
          new Discord.MessageButton()
          .setCustomId('decline')
          .setLabel('Decline')
          .setStyle('DANGER'),
        );
        interaction.client.channels.cache.get(staffapplicationChannel).send({
        embeds: [dataEmbed],
        components: [buttonsRow]
      })
      if (buttonsRow.customId === 'accept') {
        await buttonsRow.Reply({
          content: 'You accepted the user',
          components: []
        });
      }
    });
  },
};