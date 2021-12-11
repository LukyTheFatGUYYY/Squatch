const Discord = require('discord.js');

module.exports = {
    name: 'nickname',
    description: 'lets you change a users nickname',
    aliases: ['nick'],
    category: 'utility',
    clientPermissions: [],
    userPermissions: [],
    run: (client, msg, args) => {
    let mentionMember = message.mentions.members.first();
    let newNickname = args.slice(1).join(" ");
    const mentionuser = new Discord.MessageEmbed()
      .setTitle("Error")
      .addField(`Mention the user you want to change the nickname`)
      .setColor("RED");
      const nicknamechange = new Discord.MessageEmbed()
      .setTitle("Error")
      .addField(`Input the new nickname for the user you mentioned`)
      .setColor("RED");
      const cantchangeit = new Discord.MessageEmbed()
      .setTitle("Error")
      .addField(`Can't change nickname of this user, does he have a higher role? Is the server creator? Have I got the permission to change his nickname?`)
      .setColor("RED");
    if (!mentionMember) {
      return message.reply({ embeds: [mentionuser] });
    }
    if (!newNickname) {
      return message.reply({ embeds: [nicknamechange] });
    }
    try {
      mentionMember.setNickname(newNickname);
    } catch (error) {
      message.reply({ embeds: [cantchangeit] });
    }
    message.channel.send(
      `Changed nickname of ${mentionMember} to **${newNickname}**`
    );
  },
};