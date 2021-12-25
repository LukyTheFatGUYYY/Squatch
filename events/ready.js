const eventLogger = require('../logging');
module.exports = {
  name: 'ready',
  runOnce: true,
  call(client) {
    console.log('Successfully logged in!');
    eventLogger(client);
    client.on("ready", () => {
      client.user.setActivity(`The Server`, { type: 'WATCHING' });
    });
  },
};
