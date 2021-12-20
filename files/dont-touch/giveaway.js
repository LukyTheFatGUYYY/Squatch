function toTime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  if ((dDisplay + hDisplay + mDisplay + sDisplay) === '') return 0;
  return dDisplay + hDisplay + mDisplay + sDisplay;

  function sleep(seconds) {
    ms = seconds * 1000;
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  greactors = [];
}
function EmbedProhibited(message) {
  const Prohibited = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Prohibited User')
    .setDescription('You are prohibited from doing this command');
  return Prohibited;
}

function EmbedNeedchannel(message) {
  const Needchannel = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription('I need the channel to start the giveaway in.');
  return Needchannel;
}

function EmbedNeedtime(message) {
  const Needtime = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription('I need to know the giveaway time.');
  return Needtime;
}

function EmbedNeedreward(message) {
  const Needreward = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription('I need the reward of the giveaway.');
  return Needreward;
}

function EmbedNeed1day(message) {
  const Need1day = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription('I can only do giveaways shorter than 1 day.');
  return Need1day;
}

function EmbedNeedvalidtime(message) {
  const Needvalidtime = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription('I need a valid time.');
  return Needvalidtime;
}

module.exports = {
  name: 'giveaway',
  aliases: ['Giveaway'],
  description: 'Start a giveaway!',
  usage: 'giveaway <channel> <time> <prize>',
  run: async (client, message, args) => {
    greactors = [`${client.user.username}#${client.user.discriminator}`];
    if (args.length === 0) {
      message.channel.send(EmbedNeedchannel(message)).then((msg) => msg.delete({ timeout: 5000 }));
    } else if (args.length === 1) {
      message.channel.send(EmbedNeedreward(message)).then((msg) => msg.delete({ timeout: 5000 }));
    } else if (args.length === 2) {
      message.channel.send(EmbedNeedtime(message)).then((msg) => msg.delete({ timeout: 5000 }));
    } else {
      if (!message.member.roles.cache.has(adminrole)) {
        return message.channel.send(
          EmbedProhibited(),
        );
      }
      channel = args[0];
      channel = channel.replace('<#', '');
      channel = channel.replace('>', '');
      channel = await message.guild.channels.cache.get(channel);
      gtime = parseInt(args[1]);
      reward = args.slice(2).join(' ');
      if (gtime > 604800) {
        await message.channel.send(EmbedNeed1day(message)).then((msg) => msg.delete({ timeout: 5000 }));
        return;
      }
      if (!parseInt(args[1])) return message.channel.send(EmbedNeedvalidtime(message)).then((msg) => msg.delete({ timeout: 5000 }));
      Embed = new Discord.MessageEmbed();
      Embed.setTitle('New Giveaway!');
      Embed.addField('Prize', reward);
      Embed.addField('Time', `${toTime(gtime)}`);
      Embed.addField('Host', value = `${message.author.username}#${message.author.discriminator}`);
      gembed = await channel.send(Embed);
      await gembed.react('🎉');
      if (message.channel.id === gembed.channel.id) {
      } else {
        await message.channel.send('Giveaway started!').then((msg) => msg.delete({ timeout: 5000 }));
      }
      await sleep(10);
      nembed = null;
      while (gtime > 0) {
        gtime -= 10;
        if (gtime <= 0) {
          nembed = new Discord.MessageEmbed();
          nembed.setTitle('New giveaway!');
          nembed.addField('Prize', reward);
          nembed.addField('Time', '0 seconds');
          nembed.addField('Host', `${message.author.username}#${message.author.discriminator}`);
          await gembed.edit(nembed);
        } else {
          nembed = new Discord.MessageEmbed();
          nembed.setTitle('New giveaway!');
          nembed.addField('Prize', reward);
          nembed.addField('Time', `${toTime(gtime)}`);
          nembed.addField('Host', `${message.author.username}#${message.author.discriminator}`);
          await gembed.edit(nembed);
          await sleep(10);
        }
      }
      const index = greactors.indexOf(`${client.user.username}#${client.user.discriminator}`);
      if (index > -1) {
        greactors.splice(index, 1);
      }
      if (greactors.length === 0) {
        wembed = new Discord.MessageEmbed();
        wembed.setTitle(`Nobody won the ${reward} giveaway.`);
        await gembed.edit(wembed);
      } else {
        wembed = new Discord.MessageEmbed();
        winner = greactors[Math.floor(Math.random() * greactors.length)];
        wembed.setTitle(`${winner} won the ${reward} giveaway!`);
        await gembed.edit(wembed);
      }
      greactors = [];
    }
  },
};

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.emoji.name == '🎉') {
    const index = greactors.indexOf(`${client.user.username}#${client.user.discriminator}`);
    if (index > -1) {
      greactors.splice(index, 1);
    }
    greactors.push(`${user.username}#${user.discriminator}`);
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.emoji.name == '🎉') {
    const index = greactors.indexOf(`${user.username}#${user.discriminator}`);
    if (index > -1) {
      greactors.splice(index, 1);
    }
  }
});
