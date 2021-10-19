const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');
const path = require('path');
const Captcha = require('@haileybot/captcha-generator');
const { roleID } = require('../config/constants/roles.json');
const { welcomeleave, verificationchannel, captchalogchannel } = require('../config/constants/channel.json');
const { Version, xEmoji, prefix } = require('../config/main.json');

module.exports = {
  name: 'guildMemberAdd',
  call: (client, args) => { // first and only arg in array: member added
    const userCaptchaData = {};
    const captchachannel = client.channels.cache.get(captchalogchannel);
    async function verification() {
      const captcha = new Captcha(); // send it to a discord channel so it doesnt get deleted or something.
      if (!captchachannel) {
        console.log(args[0], args);
        return args[0].send(`${xEmoji} Sorry, the verification system failed. Please contact a Bot Developer ASAP.`);
      }
      const captchaImage = (await captchachannel.send({ files: [new Discord.MessageAttachment(captcha.JPEGStream, 'captcha.jpeg')] }
      ).attachments.first());
      const Server = args[0].guild.name;
      const e0 = new Discord.MessageEmbed().setTitle('Verification').setDescription().setFooter(`${Version}`);
      const e1 = new Discord.MessageEmbed(e0).setDescription(`Welcome To **${Server}**\nPlease enter the captcha code below correctly to get verified in **${Server}**`).addField('**Why did you recieve this?**', 'You recieved this captcha because we would to verify that you aren\'t an automated bot and to protect the server from malicious attacks\nMake sure you type the captcha code in this conversation').addField('Error', `If youre unable to read the image, then you can go to the verification channel selected by the server administrators, then you can run the command ${prefix}verify`);
      const e2 = new Discord.MessageEmbed(e0).setDescription('You\'ve entered the captcha incorrectly.');
      const e3 = new Discord.MessageEmbed(e0).setDescription(`You have verified yourself in **${Server}**! and you successfully recieved a role! You now have access to the server`);
      try {
        userCaptchaData[args[0].id] = {};
        userCaptchaData[args[0].id].captchaValue = captcha.value;
        const channel = await args[0].createDM();
        if (client.users.cache.get(args[0].id).bot) {
          const roleObj = args[0].guild.roles.cache.get(roleID);
          if (roleObj) {
            return args[0].roles.add(roleObj);
          }
          return;
        }
        try {
          channel.send(
            e1
              .setImage(captchaImage),
          ).catch(async () => {
            vchannel = client.channels.cache.get(verificationchannel);
            const enableDMEmb = new Discord.MessageEmbed()
              .setTitle('Enable DM\'s')
              .setDescription(`please enable DMs then run the command ${prefix}verify`)
              .setImage('https://i.imgur.com/sEkQOCf.png');

            vchannel.send({ content: `<@!${args[0].user.id}>`, embed: enableDMEmb }).then((message) => message.delete({ timeout: 20000 }));
          });
        } catch (err) {
          console.log(err);
        }
        const filter = (m) => {
          if (m.author.bot) return;
          // FOR ME, PLEASE DONT REMOVE THIS COMMENT
          if (m.author.id === args[0].id && String(m.content).toUpperCase() === String(userCaptchaData[args[0].id].captchaValue).toUpperCase()) {
            console.log(`correct captcha: ${userCaptchaData[args[0].id].captchaValue} // got : ${String(m.content).toUpperCase()}`);
            return true;
          }
          console.log(`incorrect captcha: ${userCaptchaData[args[0].id].captchaValue} // got : ${String(m.content).toUpperCase()}`);
          m.channel.send(e2); // captcha is incorrect and messages the user it is incorrect
          return false;
        };
        channel.awaitMessages(filter, {
          max: 1,
          time: 600000,
          errors: ['time'],
        }).then(async (response) => {
          // User entered a captcha code then bot checks if its correct or not and if it is, the bot gives the selected role set by the administrator
          try {
            if (response && captcha.value == userCaptchaData[args[0].id].captchaValue) {
              console.log(captcha.value);
              vchannel = client.channels.cache.get(verificationchannel);
              var roleObj = args[0].guild.roles.cache.get(roleID);
              if (roleObj) {
                await channel.send(e3);
                await args[0].roles.add(roleObj);
              }
            }
            // if the new member joins and enters captcha code correctly, the log will go to the specific channel set by the server owner
            const joinedServer = args[0].guild.members.cache.get(args[0].user.id).joinedAt.toDateString();
            const userCreationDate = args[0].user.createdAt.toDateString();
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage(
              path.join('./images/background.png'),
            );
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            // Slightly smaller text placed above the member's display name
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
            // Add an exclamation point here and below
            ctx.font = applyText(canvas, `${args[0].displayName}!`);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${args[0].displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const avatar = await Canvas.loadImage(args[0].user.displayAvatarURL({ format: 'jpg' }));
            ctx.drawImage(avatar, 25, 25, 200, 200);
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
            welcomechannel123 = client.channels.cache.get(welcomeleave);
            const JoinedServer = args[0].guild.members.cache.get(args[0].user.id).joinedAt.toDateString();
            const userCreationDate1 = args[0].user.createdAt.toDateString();
            var roleObj = args[0].guild.roles.cache.get(roleID);
            const CaptchaLog = new Discord.MessageEmbed()
              .setTitle('New Member')
              .addField('**User:**', `${args[0].user.tag}`)
              .addField('**Joined Server at:**', `${joinedServer}`)
              .addField('**Account Creation:**', `${userCreationDate}`)
              .addField('**Captcha Code:**', `${userCaptchaData[args[0].id].captchaValue}`)
              .addField('**Role Given:**', `${roleObj}`)
              .setColor(Color);
            if (channelLog) args[0].guild.channels.cache.get(channelLog).send(CaptchaLog);
            welcomechannel123.send(`<@&826137014529032273>, Welcome ${member} to the server!`, attachment);
          } catch (err) {
            console.log(err);
          }
        })
          .then(() => {
            // return verification();
          })
          .catch(async () => {
            /*
                         *  Check for new Captcha
                         */
            if (userCaptchaData[args[0].id].captchaValue === captcha.value) {
              channel.send(`Operation timed out, please run ${prefix}verify to try again.`);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    verification();
  },
};
