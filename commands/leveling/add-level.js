const Discord = require("discord.js");
const SQlite = require("better-sqlite3");
const sql = new SQlite('./mainDB.sqlite');

module.exports = {
    name: 'add-level',
    description: 'announcements',
    aliases: ['addlevel', 'givelevel', 'give-level'],
    category: 'leveling',
    clientPermissions: [],
    userPermissions: [],
    run: async (client, message, data) => {
        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        const Notenoughpermission = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('You do not have enough permission to use this command');
      const mentionuser = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription('Please mention a valid user');
        let user = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0])

        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply({ embeds: [Notenoughpermission] });

        const levelArgs = parseInt(args[1])

        client.getScore = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP);");
        if (!user) {
            return message.reply(`Please mention an user!`)
        } else {
            if (isNaN(levelArgs) || levelArgs < 1) {
                return message.reply({ embeds: [mentionuser] });
            } else {
                let score = client.getScore.get(user.id, message.guild.id);
                if (!score) {
                    score = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        xp: 0,
                        level: 0,
                        totalXP: 0
                    }
                }
                score.level += levelArgs
                const newTotalXP = levelArgs - 1
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Success!`)
                    .setDescription(`Successfully added ${levelArgs} level to ${user.toString()}!`)
                    .setColor("PURPLE");
                score.totalXP += newTotalXP * 2 * 250 + 250
                client.setScore.run(score)
                return message.channel.send({ embeds: [embed] });
            }
        }
    }
}