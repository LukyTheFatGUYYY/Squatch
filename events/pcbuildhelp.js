const fetch = require('node-fetch');
const Discord = require('discord.js');
const { pcbuildhelp } = require('../config/constants/api.json');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(client, message) {
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
    //console.log(data)
    //console.log(JSON.stringify(data, null, 2));
    const cpuData = data.data.find((m) => m.component.name == 'CPU');
    const mbData = data.data.find((m) => m.component.name == 'Motherboard');
    const ramArray = data.data.filter((m) => m.component.name == 'Memory');
    const storageArray = data.data.filter((m) => m.component.name == 'Storage');
    const caseData = data.data.find((m) => m.component.name == 'Case');
    const powerData = data.data.find((m) => m.component.name == 'Power Supply');
    const gpuData = data.data.find((m) => m.component.name == 'Video Card');
    const pcpartpickerembed = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setTitle(`Sent by ${message.author.tag}`)
      .addField('CPU', cpuData ? `[${cpuData.selection.name}](${cpuData.selection.link})` : "No data")
      .addField('Motherboard', mbData ? `[${mbData.selection.name}](${mbData.selection.link})` : "No data")
      .addField('Graphics Card', gpuData ? `[${gpuData.selection.name}](${gpuData.selection.link})` : "No data")
      .addField('Case', caseData ? `[${caseData.selection.name}](${caseData.selection.link})` : "No data")
      .addField('Power Supply', powerData ? `[${powerData.selection.name}](${powerData.selection.link})` : "No data")
      .setFooter({text: `Price: ${data.data.reduce((acc, cur) => acc += Number(cur.price.total.replace(/\$|No Prices Available/g, '')), 0).toFixed(2).toLocaleString()}`});
    
    if (storageArray.length === 0) { 
      pcpartpickerembed.addField('Storage', "No data");
    }
    
    // This won't run if the length is 0, so no check necessary
    storageArray.forEach((storageData) => {
      pcpartpickerembed.addField('Storage', `[${storageData.selection.name}](${storageData.selection.link})`);
    });

    if (ramArray.length === 0) { 
      pcpartpickerembed.addField('Memory', "No data");
    }
    
    // This won't run if the length is 0, so no check necessary
    ramArray.forEach((memoryData) => {
      pcpartpickerembed.addField('Memory', `[${memoryData.selection.name}](${memoryData.selection.link})`);
    });
    
    message.channel.send({ embeds: [pcpartpickerembed] });
}
};