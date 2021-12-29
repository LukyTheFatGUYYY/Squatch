const fetch = require('node-fetch');
const Discord = require('discord.js');
const { pcbuildhelp } = require('../config/constants/api.json');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(client, args) {
    const link = args[0]
    const getPartId = (link) => {
      if (/(https:\/\/([a-z]*).pcpartpicker.com\/list\/)+([a-zA-Z0-9]*)/.test(link)) {
        const ls = link.split(/\//);
        return ls[ls.length - 1];
      }
      return -1;
    }
    const partId = getPartId(args[0]);
    const data = await fetch(`https://japi.rest/pcpartpicker/v1/list/${partId}`, {
      headers: {
        Authorization: `${pcbuildhelp}`,
      },
    }).then((res) => res.json());
    console.log(data.data)
    const cpuData = data.data.find((m) => m.component.name == 'CPU' || 'N/A');
    const mbData = data.data.find((m) => m.component.name == 'Motherboard' || 'N/A');
    const ramData = data.data.find((m) => m.component.name == 'Memory' || 'N/A');
    const storageData = data.data.find((m) => m.component.name == 'Storage' || 'N/A');
    const caseData = data.data.find((m) => m.component.name == 'Case' || 'N/A');
    const powerData = data.data.find((m) => m.component.name == 'Power Supply' || 'N/A');
    const gpuData = data.data.find((m) => m.component.name == 'GPU' || 'N/A');
    const embed = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .addField('CPU', `[${cpuData.selection.name}](${cpuData.selection.link})`, true)
      .addField('Motherboard', `[${mbData.selection.name}](${mbData.selection.link})`, true)
      .addField('Graphics Card', `[${gpuData.selection.name}](${gpuData.selection.link})`, true)
      .addField('Memory', `[${ramData.selection.name}](${ramData.selection.link})`, true)
      .addField('Storage', `[${storageData.selection.name}](${storageData.selection.link})`, true)
      .addField('Case', `[${caseData.selection.name}](${caseData.selection.link})`, true)
      .addField('Power Supply', `[${powerData.selection.name}](${powerData.selection.link})`, true)
      .setFooter(`Price: ${data.data.reduce((acc, cur) => acc += Number(cur.price.total.replace(/\$|No Prices Available/g, '')), 0).toFixed(2).toLocaleString()}`);
    message.channel.send({ embeds: [embed] });
}
};