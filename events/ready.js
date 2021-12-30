const eventLogger = require('../logging');

module.exports = {
  name: 'ready',
  once: true,
  execute: (client) => {
    eventLogger(client);
    client.user.setActivity(`The Server`, { type: 'WATCHING' });
  },
};
