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
      message.channel
        .send({ embeds: [Application] });
    }
    const filter1 = (m) => m.author.id === message.author.id;
    const cancel = new Discord.MessageEmbed()
      .setTitle('cancelled')
      .setDescription('You have successfully cancelled this application')
      .setColor('RED');

    const success = new Discord.MessageEmbed()
      .setTitle('Success')
      .setDescription(
        "You have successfully submitted your application\nIf you don't recieve a response then most likely you have been denied",
      )
      .setColor('GREEN');
    const questions = [
      'How old are you? (Tell the truth...)',
      'Do you have 2FA enabled?',
      'Why do you want this position?',
      'Do you currently have ownership of a server?',
      'Why should we choose you over anyone else?',
      'How did you find this server?',
      'How long have you been on the server for?',
      'Do you currently have any other accounts that are on the server?',
      "How many discord account's do you have?",
      "Have you ever broke Discord's TOS?",
      'Have you ever recieved a termination of an account from discord?',
      'Have you ever recieved a warning, mute or a temporary ban on this server?',
      'Are you currently staff on any other server?',
      'How active are you on the server?',
      "What's your current timezone?",
      'How active will you be on the server if you get accepted?',
      'Have you been unbanned from the server?',
      'What skills do you have to offer the team?',
      'What do you think is the responsibility of a moderator?',
      'Why are you interested in becoming a moderator?',
      'Do you have any past experience as a moderator?',
      'How active are you on discord?',
      'What would you bring to our staff team or the server itself if you are accepted?',
      'How helpful are you to other members in the server?',
      "If you would like to say something else you can type it here (Otherwise put 'N/A')",
    ];
    const questionEmbed = new Discord.MessageEmbed();
    responses = [];
    if (data.args[0] == 'defaultvalues') {
      for (i = 0; i < questions.length; i++) {
        responses.push('default value lol');
      }
    }
    let exitFlag = false;
    const skip = responses.length > 0;
    const { author } = message;
    for (i = 0; i < questions.length; i++) {
      if (skip) break;
      questionEmbed.setTitle(`Question ${i + 1}`);
      questionEmbed.setDescription(questions[i]);
      const m = await author.send({ embeds: [questionEmbed] });
      await m.channel
        .awaitMessages(filter1, {
          time: 5 * 60000,
          max: 1,
          errors: ['time'],
        })
        .then((resp) => {
          if (resp.first().content.toLowerCase() === 'cancel') {
            author.send(cancel);
            exitFlag = true;
          }
          if (responses.join('').length + resp.first().content.length > 4096) {
            author.send(tooManyChars);
            exitFlag = true;
          }
          responses.push(resp.first());
        })
        .catch((collected) => {
          if (collected.length) return;
          message.channel.send({ embed: outOfTime });
          exitFlag = true;
        });
      if (exitFlag) return;
    }
    if (exitFlag) return;
    message.author.send(success).then(() => {
      const dataEmbed = new Discord.MessageEmbed().setTitle(
        `Application Submitted by ${message.author.tag}`,
      );
      body = '';
      for (i = 0; i < responses.length; i++) {
        body += `${questions[i]} ${responses[i]}\n`;
      }
      body = body.trim(); // remove extra whitespace (extra \n at the end)
      dataEmbed.setDescription(body);
      message.client.channels.cache
        .get(staffapplicationChannel)
        .send({ embed: dataEmbed, split: true });
    });
    if (!data.args.length) return;

    if (data.args[0] === 'accept') {
      if (!message.member.roles.cache.has(staffmanagerrole)) {
        return message.channel.send(
          "you dont' have permission to use this command",
        );
      }
      const User = message.mentions.users.first();
      if (!User) return message.channel.send('Please provide a user for me to accept');
      User.send(
        `:tada: Your application to ${message.guild.name} got accepted!`,
      );
    }
    if (!data.args.length) return;
    if (data.args[0] === 'decline') {
      if (!message.member.roles.cache.has(staffmanagerrole)) {
        return message.channel.send(
          "you dont' have permission to use this command",
        );
      }
      const User = message.mentions.users.first();
      if (!User) return message.channel.send('Please provide a user for me to decline');
      User.send(
        `Your application to ${message.guild.name} got declined...`,
      );
    }
  },
};
