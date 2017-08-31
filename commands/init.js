module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: 10
    };

    this.help = {
      name: 'init',
      description: 'This will initialize the current channel to the github repo documentation of your choice.',
      usage: 'init <account>/<repo>#<branch> src',
      category:'Documentation',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const data = this.client.documents.get('data');
    if (data.channels.hasOwnProperty(message.channel.id)) {
      return message.channel.send(`${message.settings.emojis.success} Already initialized.`);
    }

    if (!args[0] || !args[1]) {
      return message.channel.send(`${message.settings.emojis.warn} Invalid arguments.`);
    }

    // parse owner/repo#branch

    const gitsrc  = args[0].split('#');
    const gitrepo = gitsrc[0].split('/');
    const owner   = gitrepo[0];
    const repo    = gitrepo[1];
    const branch  = gitsrc[1] || 'master';
    const path    = args[1];

    if (!owner || !repo || !branch || !path) {
      return message.channel.send(`${message.settings.emojis.warn} Invalid arguments.`);
    }

    message.channel.send(`${message.settings.emojis.working} Working...`).then(() => {
      this.client.doccmds.init(message, owner, repo, branch, path);
    });

    return;
  }
};
