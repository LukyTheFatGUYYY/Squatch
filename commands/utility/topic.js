const randomTopic = require('table-topic-generator');
require('moment-duration-format');

module.exports = {
  name: 'topic',
  description: 'gives you a topic to talk about in chat',
  aliases: [],
  category: 'utility',
  clientPermissions: [],
  userPermissions: [],
  run: (msg, data) => {
    const topic = randomTopic(7, 'Summer', 'Vacation', 'Family', 'Time', 'People', 'Favorite', 'Memories');
    return message.channel.send(topic);
  },
};
