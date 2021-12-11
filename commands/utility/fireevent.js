const { xEmoji } = require('../../config/main.json');
const { adminrole } = require('../../config/constants/roles.json');

module.exports = {
  name: 'emitevent',
  aliases: ['emulateevent'],
  category: 'utility',
  description: 'Manually emit an event.',
  run: (client, msg, data) => {
    const { args } = data;
    if (!message.member.roles.cache.has(adminrole)) return message.channel.send(`${xEmoji} Only Administrators can use this command!`);
    try {
      message.client.emit(data.args[0], data.args.slice(1));
    } catch (e) {
      console.error(e);
      return nsg.channel.send(`${xEmoji} An error occured.`);
    }
    console.log(data.args, data.args.slice(1));
    message.channel.send(':white_check_mark: Successfully emitted event.');
  },
};
