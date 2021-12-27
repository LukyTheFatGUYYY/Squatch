const Discord = require('discord.js');
const {
  staffrole
} = require('../../config/constants/roles.json');
const {
  channelLog
} = require('../../config/constants/channel.json');
const {
  serverID
} = require('../../config/main.json');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletemsg')
    .setDescription('deleted the specified message')
    .addStringOption(option => option.setName('messagelink').setDescription('Please enter the message you would like to delete').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    const server = client.guilds.cache.get(serverID);
    const warnLogs = server.channels.cache.get(channelLog);
    const invalidlink = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription("That isn't a valid message link!");
    const cantindmmessages = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription("I can't delete messages in DMs!");
    const otherserverisbad = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription("I can't delete messages in other servers!");
    const successfullydeleted = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(':white_check_mark: Successfully deleted! :white_check_mark:');
    const cantfindthechannel = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription("I couldn't find that channel");
    const cantfindthemessage = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription("I couldn't find that message");
    let msg = interaction.options.getString('messagelink');
    if (!msg.includes('https://discord.com/channels/')) return interaction.editReply({
      embeds: [invalidlink]
    });
    if (msg.includes('@me')) return interaction.editReply({
      embeds: [cantindmmessages]
    });
    const data = msg.slice(29).split('/'); // remove the beginning of the URL, and split it into the IDs (guild/channel/message)
    if (data[0] !== interaction.guild.id) return interaction.editReply({
      embeds: [otherserverisbad]
    });
    interaction.guild.channels.fetch(data[1]).then((channel) => {
      channel.interaction.fetch(data[2]).then((interaction) => {
        interaction.delete().then(() => {
          interaction.editReply({
            embeds: [successfullydeleted]
          })
        });
      }).catch((e) => {
        interaction.editReply({
          embeds: [cantfindthemessage]
        })
      })
    }).catch((e) => {
      interaction.editReply({
        embeds: [cantfindthechannel]
      })
    });
  },
};