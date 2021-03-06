const exec = require('child_process').exec;
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: false,
      aliases: [],
      permLevel: 10
    };

    this.help = {
      name: 'exec',
      description: 'executes a new process, very dangerous',
      usage: 'exec <expression>',
      category: 'System',
      extended: 'This will spawn a child process and execute the given command.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    exec(`${args.join(' ')}`, (error, stdout) => {
      const response = (error || stdout);
      message.channel.send(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {split: true})
        // .then(m => m.delete(30000))
        .catch(console.error);
    });
  }
};
