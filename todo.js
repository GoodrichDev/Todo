// todo.js
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

async function postTodo(channel, author, content) {
  const safeDescription = content?.trim().length
    ? content.trim()
    : '[no description]';

  let rawAvatarURL;
  try {
    rawAvatarURL = author.displayAvatarURL({ size: 32 });
  } catch {
    rawAvatarURL = null;
  }
  const safeAvatarURL =
    typeof rawAvatarURL === 'string' && rawAvatarURL.length
      ? rawAvatarURL
      : null;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: safeAvatarURL
    })
    .setDescription(safeDescription)
    .setColor(0x1ABC9C)
    .setTimestamp();

  const msg = await channel.send({ embeds: [embed] });
  for (const emoji of ['✅','🔁','❌','⏰']) {
    await msg.react(emoji);
  }
  return msg;
}


client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  try {
    if (message.author.bot) return;
    if (!message.channel.name.toLowerCase().includes('todo')) return;
    if (!message.mentions.has(client.user)) return;

    const content = message.content
      .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
      .trim();
    if (!content) return;

    await postTodo(message.channel, message.author, content);
    await message.delete();
  } catch (err) {
    console.error('Error processing messageCreate:', err);
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  try {
    if (user.bot) return;

    if (reaction.partial) {
      try { await reaction.fetch(); }
      catch (fetchErr) {
        console.error('⚠️ Couldn’t fetch reaction:', fetchErr);
        return;
      }
    }
    if (reaction.message.partial) {
      try { await reaction.message.fetch(); }
      catch (fetchErr) {
        console.error('⚠️ Couldn’t fetch message:', fetchErr);
        return;
      }
    }
	
    const msg = reaction.message;
	
	if (msg.embeds.length === 0 && msg.channel.name?.toLowerCase().includes('todo')) {
 
      const newMsg = await postTodo(msg.channel, msg.author, msg.content);
      await newMsg.react(reaction.emoji.name).catch(() => {});
      await msg.delete();
      return;
    }
	
    if (!msg.author || msg.author.id !== client.user.id) return;
    if (!msg.channel.name?.toLowerCase().includes('todo')) return;

    const embed = msg.embeds[0];
    const embedAuthor = embed?.data?.author;
    const originalAuthorTag = embedAuthor?.name ?? 'unknown user';
    const originalAuthorAvatar = embedAuthor?.iconURL ?? null;
    const content = embed?.data?.description ?? '';

    await reaction.users.remove(user.id).catch(() => {});

    switch (reaction.emoji.name) {
      case '⏰': {
        // 24h reminder
        setTimeout(async () => {
          try {
            if (msg.deletable) await msg.delete();
            await postTodo(
              msg.channel,
              { tag: `<@${user.id}>`, displayAvatarURL: () => ' ' },
              content
            );
          } catch (e) {
            console.error('Error sending reminder:', e);
          }
        }, 24 * 60 * 60 * 1000);
        break;
      }
      case '✅': {
        // toggle strikethrough
        const desc = embed.data.description;
        const struck = desc.startsWith('~~') && desc.endsWith('~~');
        const newDesc = struck ? desc.slice(2, -2) : `~~${desc}~~`;
        const newEmbed = EmbedBuilder.from(embed).setDescription(newDesc);
        await msg.edit({ embeds: [newEmbed] });
        break;
      }
      case '🔁': {
        // repost as a fresh todo
        await msg.delete();
        await postTodo(
          msg.channel,
          { tag: originalAuthorTag, displayAvatarURL: () => originalAuthorAvatar },
          content
        );
        break;
      }
      case '❌': {
        // delete
        await msg.delete();
        break;
      }
    }

  } catch (err) {
    console.error('Error processing messageReactionAdd:', err);
  }
});

client.login(token);
