const { mutedrole } = require('../config/constants/roles.json');

module.exports = {
    name: 'antiswear',
    async call(client, message, args) {
        const T = 7000;
        if (message.author.bot) return;
        if (message.member.hasPermission('ADMINISTRATOR')) return;
        if (message.webhookID) return;

        var noWords = JSON.parse(fs.readFileSync("../files/other/filter.txt"));
        // Check if CAPS or cApS are
        var msg = message.content.toLowerCase().split(" ");
        // Check the blockedWords, and if so remove the message 
        for (let i = 0; i < noWords["blockedWords"].length; i++) {
            if (msg.includes(noWords["blockedWords"][i])) {
                message.delete()
                return message.channel.send(`❌ You are not allowed to say that. ${message.author}`)
                message.member.roles.add(mutedrole)
                setTimeout(async () => {
                    await message.member.roles.remove(mutedrole);

                }, T)


            }
        }
    }
}