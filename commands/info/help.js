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
    message.delete();
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
      return message.channel.send({ embeds: [embedhelp] });
    }

    if (args[0].toLowerCase() === 'management') {
      return message.channel.send({ embeds: [managementembed] })
    }
    if (args[0].toLowerCase() === 'Management') {
      return message.channel.send({ embeds: [managementembed] })
    }
    if (args[0].toLowerCase() === 'misc') {
      return message.channel.send({ embeds: [miscembed] })
    }
    if (args[0].toLowerCase() === 'Misc') {
      return message.channel.send({ embeds: [miscembed] })
    }
    if (args[0].toLowerCase() === 'miscellaneous') {
      return message.channel.send({ embeds: [miscembed] })
    }
    if (args[0].toLowerCase() === 'Miscellaneous') {
      return message.channel.send({ embeds: [miscembed] })
    }
    if (args[0].toLowerCase() === 'moderation') {
      return message.channel.send({ embeds: [modembed] })
    }
    if (args[0].toLowerCase() === 'Moderation') {
      return message.channel.send({ embeds: [modembed] })
    }
    if (args[0].toLowerCase() === 'mod') {
      return message.channel.send({ embeds: [modembed] })
    }
    if (args[0].toLowerCase() === 'Mod') {
      return message.channel.send({ embeds: [modembed] })
    }
    if (args[0].toLowerCase() === 'Utility') {
      return message.channel.send({ embeds: [utilityembed] })
    }
    if (args[0].toLowerCase() === 'utility') {
      return message.channel.send({ embeds: [utilityembed] })
    }

    const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));

    if (!cmd) return message.channel.send({ embeds: [embedhelp] })

    if (cmd.aliases === null) cmd.aliases = '';
    if (cmd.description.length === 0) cmd.description = 'N/A';
    if (cmd.category === null) cmd.category = 'No Category!';
    if (cmd.name === null) return message.channel.send('Something Went Wrong!');

    const cmdhelp = new MessageEmbed()
      .setColor(Color)
      .setTitle('Command Information!')
      .addField('Name', `${ChangeLatter(cmd.name)}`)
      .addField('Usage', `${cmd.usage}`)
      .addField('Category', `${ChangeLatter(cmd.category)}`)
      .addField('Description', `${cmd.description}`);
    if (cmd) {
      return message.channel.send({ embeds: [cmdhelp] })
    }
    return message.channel.send({ embeds: [embedhelp] })

    // End
  },
};
