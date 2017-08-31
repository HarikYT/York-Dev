module.exports = async (client) => {
  await client.wait(1000);
  client.log('log', `Logged in as ${client.user.username} and I'm ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'Ready!');
  await client.user.setGame(`${client.config.defaultSettings.prefix}help | ${client.guilds.size} Servers`);
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));
  client.guilds.filter(g => !client.blacklist.has(g.id)).forEach(g => client.blacklist.set(g.id, []));
  if (!client.documents.get('data')) client.documents.set('data', { repos: {}, channels: {}, docs: {} });
  // require('../functions/dashboard.js').init(client);
};
