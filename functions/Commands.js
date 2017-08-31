class Commands {
  constructor(data, docs) {
    this.data = data;
    this.docs = docs;
  }

  init(message, owner, repo, branch, path) {
    const repoFullName = `${owner}/${repo}#${branch}`;
    this.data.channels[message.channel.id] = {
      repo: repoFullName
    };

    if (this.data.repos.hasOwnProperty(repoFullName)) {
      return message.channel.send(`${message.settings.emojis.success} Successfully initialized for cached repository **${repoFullName}**.`);
    }

    this.data.repos[repoFullName] = {
      fullName: repoFullName,
      owner: owner,
      repo: repo,
      branch: branch,
      path: path
    };

    this.docs.init(repoFullName)
      .then(() => {
        message.channel.send(`${message.settings.emojis.success} Successfully initialized for repository **${repoFullName}** with path \`${path}\`.`);
      })
      .catch((err) => {
        // delete this.data.channels[message.channel.id];
        // delete this.data.repos[repoFullName];
        message.channel.send(`${message.settings.emojis.warn} Failed to initialize repository. Error occurred: \`${err}\``);
        console.log(err);
      });
  }

  cease(message, channelID) {
    delete this.data.channels[channelID];
    message.channel.send(`${message.settings.emojis.success} Successfully **ceased** in \`#${message.channel.name}\`.`);
  }

  remove(message, channelID) {
    const repo = this.data.channels[channelID].repo;
    console.log(`Removing repo ${repo}`);
    for (const channel in this.data.channels) {
      if (this.data.channels[channel].repo === repo) {
        delete this.data.channels[channel];
        console.log(`Deleted channel ${channel}`);
      }
    }
    delete this.data.repos[repo];
    message.channel.send(`${message.settings.emojis.success} Successfully **deleted** repository.`);
  }

  docslink(message, channelID, url) {
    const repo = this.data.repos[this.data.channels[channelID].repo];
    console.log(`Linking docs for ${repo.repo} to ${url}`);
    if (!url || !url.length) {
      delete repo.docsURL;
      message.channel.send(`${message.settings.emojis.success} Successfully **unlinked** docs website.`);
    } else {
      repo.docsURL = url;
      message.channel.send(`${message.settings.emojis.success} Successfully **linked** docs website.`);
    }
  }

  reduceIndentation(string) {
    let whitespace = string.match(/^(\s+)/);
    if (!whitespace) return string;
    whitespace = whitespace[0].replace('\n', '');
    const lines = string.split('\n');
    const reformattedLines = [];
    lines.forEach((line) => {
      reformattedLines.push(line.replace(whitespace, ''));
    });
    return reformattedLines.join('\n');
  }
}
module.exports = Commands;
