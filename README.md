# A Simple-to-Use Todo Bot for Discord! 📌

A lightweight, intuitive bot to help you manage tasks directly in Discord.

---

## 📌 How It Works

1. **Create a channel** with `todo` in its name.
2. **Mention the bot** (`@Todo`) followed by your task.
3. The bot **posts your task** as an embed and **reacts** with:

   * ✅ Mark tasks as complete/incomplete
   * 🔁 Repeat tasks when needed
   * ❌ Delete tasks effortlessly
   * ⏰ (Optional) Set a 24-hour reminder

Once posted, simply click the appropriate reaction to manage your to-dos.

🚀 **Invite me to your server:** [Add Todo Bot](https://discord.com/oauth2/authorize?client_id=1347706899684130877&permissions=76864)

---

## Features

* **Embed-based tasks**: Rich embeds show author, description, and timestamp.
* **Reaction-driven controls**:

  * ✅ Toggle strikethrough to mark completion
  * 🔁 Repost as a fresh task
  * ❌ Delete tasks instantly
  * ⏰ Schedule a 24-hour reminder
* **Legacy support**: React to legacy plain-text tasks in `todo` channels to convert them into embeds.
* **Auto-cleanup**: The bot deletes the original mention after posting the embed, keeping channels tidy.

---

## 📋 Prerequisites

* **Node.js** v16 or newer
* A **Discord application** with a bot token
* Bot **intents**: `Guilds`, `GuildMessages`, `MessageContent`, `GuildMessageReactions`, `GuildMembers`
* Bot **permissions**: Send Messages, Manage Messages, Add Reactions, Read Message History

---

## ⚙️ Installation

1. **Clone the repo**:

   ```bash
   git clone https://github.com/GoodrichDev/todo.git
   cd todo-bot
   ```
2. **Install dependencies**:

   ```bash
   npm install
   ```
3. **Configure**:
   Create a `config.json`:

   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN_HERE"
   }
   ```

---

## 🚀 Usage

1. **Start the bot**:

   ```bash
   node todo.js
   ```
2. **Mention the bot** in a `todo` channel:

   ```text
   @Todo Clean up the workshop
   ```
3. **Manage tasks** by clicking reactions on the embed.

---

## 🔧 Configuration

* **Channel filter**: Modify the substring check (`'todo'`) in `messageCreate` and `messageReactionAdd` to suit custom channel naming schemes.
* **Reactions**: Customize the set of emojis in `postTodo` and the reaction handler to use different icons or add new actions.

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome! Please fork the repo and submit changes via PR.

---

## 📝 License

Copyright (c) 2025 Austin Goodrich. All rights reserved. No license granted.
