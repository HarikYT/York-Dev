const { Canvas } = require('canvas-constructor');
const [width, height] = [400, 533];
const { resolve, join} = require('path');
const fsn = require('fs-nextra');
Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/Helvetica75-Bold.ttf')), 'Snapchat');
Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/NotoEmoji-Regular.ttf')), 'Snapchat');

const getSnap = async (text) => {
  const snap = await fsn.readFile('./assets/images/image_snapchat.png');
  return new Canvas(width, height)
    .addImage(snap, 0, 0, width, height)
    .restore()
    .setTextAlign('center')
    .setTextFont('18pt Snapchat')
    .setColor('#FFFFFF')
    .addText(text, width / 2, 390)
    .toBuffer();
};

module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['sc'],
      permLevel: 0
    };

    this.help = {
      name: 'snapchat',
      description: 'Creates a meme based on the But MOOOOOM statue.',
      usage: 'snapchat <text>',
      category: 'Fun',
      extended: 'This command uses canvas to generate a Snapchat styled image based on the well known _But MOOOOOM_ statue meme.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(' ');
    if (text.length < 1) return message.reply('You must give the snap some text.');
    if (text.length > 28) return message.reply('I can only handle a maximum of 28 characters');
    const result = await getSnap(text);
    await message.channel.send({ files: [{ attachment: result, name: `${text.toLowerCase().replace(' ', '-').replace('.', '-')}.png`}]});
  }
};
