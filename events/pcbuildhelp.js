const fetch = require('node-fetch');
const Discord = require('discord.js');
const { pcbuildhelp } = require('../config/constants/api.json');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(client, message) {
    message = message[0];
    const linkRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    const link = message.content.match(linkRegex) ? message.content.match(linkRegex)[0] : null;
    if(!link) return;
    
    const getPartId = (link) => {
      if (/(https:\/\/([a-z]*).pcpartpicker.com\/list\/)+([a-zA-Z0-9]*)/.test(link)) {
        const ls = link.split(/\//);
        return ls[ls.length - 1];
      }
      return -1;
    }
    const partId = getPartId(link);
    const data = await fetch(`https://japi.rest/pcpartpicker/v1/list/${partId}`, {
      headers: {
        Authorization: `${pcbuildhelp}`,
      },
    }).then((res) => res.json());
    const cpuData = data.data.find((m) => m.component.name == 'CPU');
    const mbData = data.data.find((m) => m.component.name == 'Motherboard');
    const ramData = data.data.find((m) => m.component.name == 'Memory');
    const storageData = data.data.find((m) => m.component.name == 'Storage');
    const caseData = data.data.find((m) => m.component.name == 'Case');
    const powerData = data.data.find((m) => m.component.name == 'Power Supply');
    const gpuData = data.data.find((m) => m.component.name == 'Video Card');
    const embed = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setTitle(`Sent by ${message.author.tag}`)
      .addField('CPU', cpuData ? `[${cpuData.selection.name}](${cpuData.selection.link})` : "No data")
      .addField('Motherboard', mbData ? `[${mbData.selection.name}](${mbData.selection.link})` : "No data")
      .addField('Graphics Card', gpuData ? `[${gpuData.selection.name}](${gpuData.selection.link})` : "No data")
      .addField('Memory', ramData ? `[${ramData.selection.name}](${ramData.selection.link})` : "No data")
      .addField('Storage', storageData ? `[${storageData.selection.name}](${storageData.selection.link})` : "No data")
      .addField('Case', caseData ? `[${caseData.selection.name}](${caseData.selection.link})` : "No data")
      .addField('Power Supply', powerData ? `[${powerData.selection.name}](${powerData.selection.link})` : "No data")
      .setFooter(`Price: ${data.data.reduce((acc, cur) => acc += Number(cur.price.total.replace(/\$|No Prices Available/g, '')), 0).toFixed(2).toLocaleString()}`);
    message.channel.send({ embeds: [embed] });
}
};