// For dashboard stuff.
// npm install body-parser ejs express express-session hbs helmet marked passport passport-discord
const { Client, Collection } = require('discord.js');
const {readdir} = require('fs-nextra');
const PersistentCollection = require('djs-collection-persistent');
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
const Docs = require('./functions/Docs.js');
const Lookup = require('./functions/Lookup.js');
const Commands = require('./functions/Commands.js');


class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/PersistentDB.js');
    this.config = require('./config.json');
    this.blacklist = new PersistentCollection({name: 'blacklist'});
    this.consent = new PersistentCollection({name: 'consent'});
    this.documents = new PersistentCollection({name: 'documents'});
    this.points = new PersistentCollection({name: 'points'});
    this.settings = new PersistentCollection({name: 'settings'});
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get 'precisions' on certain things...

  USAGE

  const response = await client.awaitReply(message, 'Favourite Color?');
  message.reply(`Oh, I really love ${response} too!`);

  */

  async awaitReply(message, question, limit = 60000) {
    const filter = m=>m.author.id = message.author.id;
    await message.channel.send(question);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }

  log(type, message, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}]${message}`);
  }
}

const client = new YorkDev({
  messageCacheMaxSize: 1,
  fetchAllMembers: true,
  disabledEvents:['TYPING_START']
});

require('./functions/utilities.js')(client);

const init = async () => {
  await client.documents.defer;
  const data = client.documents.get('data');
  // console.log(data);
  client.docs     = new Docs(data);
  client.lookup   = new Lookup(data, client.docs);
  client.doccmds  = new Commands(data, client.docs);
  const cmdFiles = await readdir('./commands/');
  client.log('log', `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    try {
      const props = new (require(`./commands/${f}`))(client);
      if (f.split('.').slice(-1)[0] !== 'js') return;
      client.log('log', `Loading Command: ${props.help.name}. ✔`);
      client.commands.set(props.help.name, props);
      if (props.init) props.init(client);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      client.log(`Unable to load command ${f}: ${e}`);
    }
  });

  const evtFiles = await readdir('./events/');
  client.log('log', `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    client.log('log', `Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.login(client.config.token);
};

init();
