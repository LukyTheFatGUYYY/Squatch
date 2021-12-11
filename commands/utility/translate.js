const discord = require("discord.js");
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'translate',
    description: 'translates specific text',
    aliases: [],
    category: 'utility',
    clientPermissions: [],
    userPermissions: [],
    run: (msg, data) => {
        const txt = args.slice(1).join(" ")
        const lang = args[0]
        const pleasecorrectyourself = new Discord.MessageEmbed()
            .setTitle("Error")
            .addField(`Please enter a valid ISO code of the language you would like to translate. E.G. England = en/eng`)
            .setColor("RED");
        const Notext = new Discord.MessageEmbed()
            .setTitle("Error")
            .addField(`Please enter the piece of text you would like to translate`)
            .setColor("RED");
        if (!lang) return message.channel.send({ embeds: [pleasecorrectyourself] });
        if (!txt) return message.channel.send({ embeds: [Notext] });
        translate(txt, { to: lang }).then(res => {
            const embed = new discord.MessageEmbed()
                .setDescription(res.text)
                .setColor("ORANGE")
                message.channel.send({ embeds: [embed] });
        }).catch(err => {
            message.channel.send({ embeds: [pleasecorrectyourself] });
        });
    },
};