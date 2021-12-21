const Discord = require('discord.js');
const {
  staffapplicationChannel,
} = require('../../config/constants/channel.json');
const { staffmanagerrole } = require('../../config/constants/roles.json');

module.exports = {
  name: 'staff',
  description: 'Apply for staff!',
  usage: '[accept|deny]',
  category: 'application',
  guildOnly: false,
  run: async (client, message, args, data) => {
    if (message.channel.type !== 'DM') {
      message.delete();
      const Application = new Discord.MessageEmbed()
        .setTitle('Application')
        .setDescription("Please check your DM's for the application")
        .setColor('GREEN');
      message.channel.send({ embeds: [Application] });
    }
    const filter = (m) => m.author.id === message.author.id;
    const cancel = new Discord.MessageEmbed()
      .setTitle('Cancelled')
      .setDescription('You have successfully cancelled this application')
      .setColor('RED');
    const success = new Discord.MessageEmbed()
      .setTitle('Success')
      .setDescription("You have successfully submitted your application\nIf you don't recieve a response then most likely you have been denied")
      .setColor('GREEN');
    const tomanychars  = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription("Too many characters")
      .setColor('RED');
    const outoftime  = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription("Out of time")
      .setColor('RED');
    const questions = [
      'q1',
      'q2',
      'q3',
      'q4',
      'q5',
      'q6',
      'q7',
      'q8',
      'q9',
      'q10',
      'q11',
      'q12',
      'q13',
      'q14',
      'q15',
      'q16',
      'q17',
      'q18',
      'q19',
      'q20',
      'q21',
      'q22',
      'q23',
      'q24',
      'q25',
    ];
    const questionEmbed = new Discord.MessageEmbed();
    responses = [];
    let exitFlag = false;
    const skip = responses.length > 0;
    const { author } = message;
    for (i = 0; i < questions.length; i++) {
      if (skip) break;
      questionEmbed.setTitle(`Question ${i + 1}`);
      questionEmbed.setDescription(questions[i]);
      const m = await author.send({ embeds: [questionEmbed] });
      await m.channel
      .awaitMessages({
        filter: filter,
        time: 5 * 60000,
        max: 1,
        errors: ['time'],
      })
        .then((resp) => {
          if (resp.first().content.toLowerCase() === 'cancel') {
            author.send({ embeds: [cancel] });
            exitFlag = true;
          }
          if (responses.join('').length + resp.first().content.length > 4096) {
            author.send({ embeds: [tomanychars] });
            exitFlag = true;
          }
          responses.push(resp.first());
        })
        .catch((collected) => {
          if (collected.length) return;
          message.channel.send({ embeds: [outoftime] });
          exitFlag = true;
        });
      if (exitFlag) return;
    }
    if (exitFlag) return;
    message.author.send(({ embeds: [success] })).then(() => {
      const dataEmbed = new Discord.MessageEmbed().setTitle(`Application Submitted by ${message.author.tag}`);
      body = '';
      for (i = 0; i < responses.length; i++) {
        body += `\n**${questions[i]}**\n${responses[i]}\n`;
      }
      body = body.trim(); // remove extra whitespace (extra \n at the end)
      dataEmbed.setDescription(body)
      const buttonsRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Please Accept or Decline')
                    .addOptions([
                        {
                            label: 'Accept',
                            description: 'Accept the application',
                            value: 'first_option',
                        },
                        {
                            label: 'Decline',
                            description: 'Decline the application',
                            value: 'second_option',
                        },
                    ]),
            );
      message.client.channels.cache.get(staffapplicationChannel).send({embeds: [dataEmbed], components:[buttonsRow]})});
    if (!args.length) return;
    if (data.args[0] === 'accept') {
      if (!message.member.roles.cache.has(staffmanagerrole)) {
        return message.channel.send("you dont' have permission to use this command");
      }
      const User = message.mentions.users.first();
      if (!User) return message.channel.send('Please provide a user for me to accept');
      User.send(`:tada: Your application to ${message.guild.name} got accepted!`);
    }
    if (!args.length) return;
    if (data.args[0] === 'decline') {
      if (!message.member.roles.cache.has(staffmanagerrole)) {
        return message.channel.send("you dont have permission to use this command");
      }
      const User = message.mentions.users.first();
      if (!User) return message.channel.send('Please provide a user for me to decline');
      User.send(`Your application to ${message.guild.name} got declined...`);
    }
  },
};