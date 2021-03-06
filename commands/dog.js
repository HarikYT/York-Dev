const snek = require('snekfetch');
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['doggo', 'pupper'],
      permLevel: 0
    };

    this.help = {
      name: 'dog',
      description: 'Grabs a random dog image.',
      usage: 'dog',
      category: 'Fun',
      extended: 'This command grabs a random dog from "The DogAPI".'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send('`Fetching random dog...`');
      const {body} = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
      await message.channel.send({files: [{attachment: body.data[0].url, name: `${body.data[0].id}.jpg`}]});
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
};
