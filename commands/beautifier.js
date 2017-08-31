const beautify = require('js-beautify').js_beautify;
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['beautify'],
      permLevel: 0
    };

    this.help = {
      name: 'beautifier',
      description: 'This will make your code sparkle!',
      usage: 'beautifier',
      category:'Support',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const messages = message.channel.messages.array().reverse().filter(msg => msg.author.id !== message.client.user.id);
    let code;
    const codeRegex = /```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig;
    for (let m = 0; m < messages.length; m++) {
      const msg = messages[m];
      const groups = codeRegex.exec(msg.content);
      if (groups && groups[1] && groups[1].length) {
        code = groups[1];
        break;
      }
    }
    if (!code) {
      return message.channel.send(`${message.settings.emojis.warn} No JavaScript code blocks found.`);
    }
    let beautifiedCode = beautify(code, {
      indent_size: 2,
      brace_style: 'preserve-inline'
    });
    beautifiedCode = this.reduceIndentation(beautifiedCode);
    message.channel.send(`${'```js'}\n${beautifiedCode}\n${'```'}`);
  }
};
