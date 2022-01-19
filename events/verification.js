const Discord = require('discord.js');
const Captcha = require('@haileybot/captcha-generator');
const { roleID } = require('../config/constants/roles.json');
const { verificationchannel, channelLog, captchalogchannel } = require('../config/constants/channel.json');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  execute: (client, args) => {

    const userCaptchaData = {};
    const captchachannel = client.channels.cache.get(captchalogchannel);
    async function verification() {
      const captcha = new Captcha(); // send it to a discord channel so it doesnt get deleted
      if (!captchachannel) {
        console.log("Check if you entered everything correct, Did you enter in the correct channel/role id's");
        return args.send(`❌ Sorry, the verification system failed. Please contact a Administrator or the [developer](https://github.com/MrXez) of the bot ASAP.`);
      }
      const captchaImage = new Discord.MessageAttachment(captcha.JPEGStream, 'captcha.jpeg');
      await captchachannel.send({ files: [captchaImage] });
      const Server = args.guild.name;
      const e0 = new Discord.MessageEmbed().setTitle('Verification').setFooter({text: `Made by Nez#6810 - https://github.com/MrXez`});
      const e1 = new Discord.MessageEmbed(e0).setDescription(`Welcome to **${Server}**\nTo gain access, please enter the captcha code from the image below - you must enter the captcha code correctly to get verified in the server`).addField('**Why did you recieve this?**', 'You recieved this verification message because we would to verify that you aren\'t an automated bot and to protect the server from malicious attacks\nMake sure you type the captcha code in this conversation and not in the server').addField('Possible Issues', `If youre unable to read the image, then you can go to the verification channel selected by the server administrators, then you can run the command /verify to get the same message to appear but with a different captcha image`);
      const e2 = new Discord.MessageEmbed(e0).setDescription('You\'ve entered the captcha incorrectly.');
      const e3 = new Discord.MessageEmbed(e0).setDescription(`You have verified yourself in **${Server}**! and you successfully recieved a role! You now have access to the server`);
      try {
        userCaptchaData[args.id] = {};
        userCaptchaData[args.id].captchaValue = captcha.value;
        const channel = await args.createDM();
        if (client.users.cache.get(args.id).bot) {
          const roleObj = args.guild.roles.cache.get(roleID);
          if (roleObj) {
            return args.roles.add(roleObj);
          }
          return;
        }
        try {
          const embedImage = new Discord.MessageAttachment(captcha.JPEGStream, 'captcha.jpeg');
          channel.send({ embeds: [e1.setImage("attachment://captcha.jpeg")], files: [embedImage] }
          ).catch(async () => {
            const vchannel = client.channels.cache.get(verificationchannel);
            const enableDMEmb = new Discord.MessageEmbed()
              .setTitle('Enable DM\'s')
              .setDescription(`please enable DMs then run the command /verify`)
              .addField("Look at the image to learn how to enable your dm's", "Not doing so will disable your access to the server")
              .setImage('https://i.imgur.com/sEkQOCf.png');
            ;
            await vchannel.send({ content: `<@!${args.user.id}>`, embeds: [enableDMEmb] })
          });
        } catch (err) {
          console.log(err);
        }
        const filter = (m) => {
          if (m.author.bot) return;
          // FOR ME, PLEASE DONT REMOVE THIS COMMENT
          if (m.author.id === args.id && String(m.content).toUpperCase() === String(userCaptchaData[args.id].captchaValue).toUpperCase()) {
            console.log(`correct captcha: ${userCaptchaData[args.id].captchaValue} // got : ${String(m.content).toUpperCase()}`);
            return true;
          }
          console.log(`incorrect captcha: ${userCaptchaData[args.id].captchaValue} // got : ${String(m.content).toUpperCase()}`);
          m.channel.send({ embeds: [e2] }); // captcha is incorrect and messages the user it is incorrect
          return false;
        };
        channel.awaitMessages(
          {
            filter: filter,
            max: 1,
            time: 600000,
            errors: ['time'],
          }).then(async (response) => {
            // User entered a captcha code then bot checks if its correct or not and if it is, the bot gives the selected role set by the administrator
            try {
              if (response && captcha.value == userCaptchaData[args.id].captchaValue) {
                console.log(captcha.value);
                const vchannel = client.channels.cache.get(verificationchannel);
                var roleObj = args.guild.roles.cache.get(roleID);
                if (roleObj) {
                  await channel.send({ embeds: [e3] });
                  await args.roles.add(roleObj);
                }
              }
              // if the new member joins and enters captcha code correctly, the log will go to the specific channel set by the server owner
              const joinedServer = args.guild.members.cache.get(args.user.id).joinedAt.toDateString();
              const userCreationDate = args.user.createdAt.toDateString();
              var roleObj = args.guild.roles.cache.get(roleID);
              const CaptchaLog = new Discord.MessageEmbed()
                .setTitle('New Member')
                .addField('**User:**', `${args.user.tag}`)
                .addField('**Joined Server at:**', `${joinedServer}`)
                .addField('**Account Creation:**', `${userCreationDate}`)
                .addField('**Captcha Code:**', `${userCaptchaData[args.id].captchaValue}`)
                .addField('**Role Given:**', `${roleObj}`)
                .setColor("PURPLE");
              if (channelLog) args.guild.channels.cache.get(channelLog).send({ embeds: [CaptchaLog] });
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
            if (userCaptchaData[args.id].captchaValue === captcha.value) {
              channel.send(`Operation timed out, please run /verify to try again.`);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    verification();
  },
};