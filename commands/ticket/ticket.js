require('discord-reply');
const Discord = require('discord.js')
const { serverID } = require('../../config/main.json');
const configuration = require('../../config/misc/ticket.json')
const tickets = configuration.tickets
const sqlite = require('sqlite3').verbose();

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('creates a specific ticket'),
  async execute(interaction, client) {
    await interaction.deferReply();

    const support = interaction.guild.roles.cache.get(tickets.supportRoleID)

    const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");

    const category = interaction.guild.channels.cache.get(tickets.supportCategoryID);

    const channel = await interaction.guild.channels.create(`ticket-${interaction.username}`, { 
      type: 'text',
      parent: category 
    })

    channel.permissionOverwrites.edit(everyone, {
      "VIEW_CHANNEL": false
    });

    channel.permissionOverwrites.edit(support, {
      "VIEW_CHANNEL": true,
      "SEND_MESSAGES": true
    });

    channel.permissionOverwrites.edit(interaction.user, {
      "VIEW_CHANNEL": true,
      "SEND_MESSAGES": true
    })

    if (tickets.pingSupportOnOpen === 'true') {
      channel.send(`<@&${tickets.supportRoleID}>`)
    }

    var categories = []

    tickets.ticketCategories.categories.forEach(function(i) {
      categories.push({
        label: i.displayName,
        description: i.categoryDescription,
        emoji: i.categoryEmoji,
        value: i.value
      });
    });

    let menu = new Discord.MessageSelectMenu()
      .setCustomId('ticket_category_menu')
      .setPlaceholder('Please Choose a Category')
      .addOptions(categories);

    const btnClose = new MessageButton()
      .setLabel('Close Ticket')
      .setCustomId('close_ticket')
      .setStyle('DANGER');

    const row = new MessageActionRow()
      .addComponents(
        btnClose
      )
    
    const menuRow = new MessageActionRow()
      .addComponents(
        menu
      )

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`🎟  New Ticket`)
      .setDescription(tickets.newTicketEmbed)
      .setTimestamp()
      .setFooter(`Opened by ${interaction.tag}`, `${interaction.user.displayAvatarURL()}`)
    channel.send({
      content: `<@${interaction.id}>`, 
      embeds: [embed],
      components: [menuRow, row]
    });

    interaction.editReply({ 
      content: `Your ticket has been opened in <#${channel.id}>.`
    });

    let guildId = serverID

    let db = new sqlite.Database('./database/database.db', sqlite.OPEN_READWRITE);

    var query = `SELECT * FROM ticketDataExtra WHERE guildId = ?`;
    db.get(query, [guildId], (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      if (row === undefined) {
        let insertdata = db.prepare(`INSERT INTO ticketDataExtra VALUES(?,?)`);
        insertdata.run(guildId, "0");
        insertdata.finalize();
        db.close();
      } else {
        var ticketCount = row.ticketCount;
        ticketCount++;
        db.run(`UPDATE ticketDataExtra SET ticketCount = ? WHERE guildId = ?`, [ticketCount, guildId]);


        let channelId = channel.id

        let str = "" + ticketCount
        let pad = "0000"
        let ticketId = pad.substring(0, pad.length - str.length) + str

        let authorId = interaction.id

        let channelName = channel.name

        var query = `SELECT * FROM ticketData WHERE channelId = ?`;
        db.get(query, [channelId], (err, row) => {
          if (err) {
            console.log(err);
            return;
          }
          if (row === undefined) {
            let insertdata = db.prepare(`INSERT INTO ticketData VALUES(?,?,?,?,?,?)`);
            insertdata.run(channelId, channelName, ticketId, authorId, "not_set", "true");
            insertdata.finalize();
            db.close();
            //console.log(`${channel.name} has been added to the database.`)
            return;
          } else {
            console.log(`${channelName} in already in the database.`)
          }
        });

        if (tickets.useNumberedTickets === 'true') {
          channel.setName(`ticket-${ticketId}`).then(c => {
            c.setTopic(`Opened by **${interaction.tag}** - Ticket ID: **${ticketId}** - Category: **N/A**`)
            return;      
          });
        } else {
          channel.setTopic(`Opened by **${interaction.tag}** - Ticket ID: **${ticketId}** - Category: **N/A**`)
        }
      }
    });
  }
};