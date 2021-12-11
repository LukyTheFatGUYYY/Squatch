const { MessageEmbed } = require('discord.js');
const { discordlink } = require('../../config/main.json');

module.exports = {
  name: 'help',
  description: 'lists all of the commands',
  aliases: [],
  category: 'info',
  clientPermissions: [],
  userPermissions: [],
  run: (client, message, args, data) => {
    const { args } = data;

    msg.delete();
    function ChangeLatter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const cmdmanagement = client.commands.filter((command) => command.category === 'management').map();
    const cmdfun = client.commands.filter((command) => command.category === 'misc').map();
    const cmdmod = client.commands.filter((command) => command.category === 'moderation').map();
    const cmdutility = client.commands.filter((command) => command.category === 'utility').map();

    const embedhelp = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle(`${client.user.username} - Help Section!`)
      .setDescription('Below you can see the current Command Categories\nyou can also see basic server information')
      .addFields(
        { name: 'Command Categories', value: 'Management\nModeration\nUtility', inline: true },
        { name: 'Server information', value: `[Server Invite](${discordlink})`, inline: true },
      );
    const managementembed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('Management Section!');
    const miscembed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('Misc Section!');
    const modembed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('Moderation Section!');
    const utilityembed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('Utility Section!');
    cmdmanagement.forEach((cmd) => {
      managementembed.addField(
        `${ChangeLatter(cmd.name)}`,
        `${ChangeLatter(cmd.description)}`,
      );
    });

    cmdfun.forEach((cmd) => {
      miscembed.addField(
        `${ChangeLatter(cmd.name)}`,
        `${ChangeLatter(cmd.description)}`,
      );
    });

    cmdmod.forEach((cmd) => {
      modembed.addField(
        `${ChangeLatter(cmd.name)}`,
        `${ChangeLatter(cmd.description)}`,
      );
    });

    cmdutility.forEach((cmd) => {
      utilityembed.addField(
        `${ChangeLatter(cmd.name)}`,
        `${ChangeLatter(cmd.description)}`,
      );
    });

    if (!args[0]) {
      return msg.channel.send({ embeds: [embedhelp] });
    }

    if (args[0].toLowerCase() === 'management') {
      return msg.channel.send(managementembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Management') {
      return msg.channel.send(managementembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'misc') {
      return msg.channel.send(miscembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Misc') {
      return msg.channel.send(miscembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'miscellaneous') {
      return msg.channel.send(miscembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Miscellaneous') {
      return msg.channel.send(miscembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'moderation') {
      return msg.channel.send(modembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Moderation') {
      return msg.channel.send(modembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'mod') {
      return msg.channel.send(modembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Mod') {
      return msg.channel.send(modembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'Utility') {
      return msg.channel.send(utilityembed).then((msg) => msg.delete({ timeout: 50000 }));
    }
    if (args[0].toLowerCase() === 'utility') {
      return msg.channel.send(utilityembed).then((msg) => msg.delete({ timeout: 50000 }));
    }

    const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));

    if (!cmd) return msg.channel.send(embedhelp).then((msg) => msg.delete({ timeout: 50000 }));

    if (cmd.aliases === null) cmd.aliases = '';
    if (cmd.description.length === 0) cmd.description = 'N/A';
    if (cmd.category === null) cmd.category = 'No Category!';
    if (cmd.name === null) return msg.channel.send('Something Went Wrong!');

    const cmdhelp = new MessageEmbed()
      .setColor(Color)
      .setTitle('Command Information!')
      .addField('Name', `${ChangeLatter(cmd.name)}`)
      .addField('Usage', `${cmd.usage}`)
      .addField('Category', `${ChangeLatter(cmd.category)}`)
      .addField('Description', `${cmd.description}`);
    if (cmd) {
      return msg.channel.send({ embeds: [cmdhelp] }).then((msg) => msg.delete({ timeout: 50000 }));
    }
    return msg.channel.send({ embeds: [embedhelp] }).then((msg) => msg.delete({ timeout: 50000 }));

    // End
  },
};
