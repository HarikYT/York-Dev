module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: 0
    };

    this.help = {
      name: 'cease',
      description: 'Stop',
      usage: 'cease',
      category:'Documentation',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars

  }
};
