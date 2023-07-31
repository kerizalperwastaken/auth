const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botSchema = require('../Schema/botSchema');
const config = require('../Settings/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guildwl")
    .setDescription("⚒️ Guilds WL panel will be shown."),
    enabled: true,
    async execute(interaction, client) {


      let data = await botSchema.findOne({ clientId: client.user.id })
      let whitelist = data.whitelist.find(x => x.id === interaction.user.id)
      if(!config.authDevelopers.includes(interaction.user.id) && !config.authOwners.includes(interaction.user.id) && whitelist?.id !== interaction.user.id) return
  
      let menu1 = new StringSelectMenuBuilder()
        .setCustomId("menu1")
        .setPlaceholder(" Select an option")
        .addOptions({

          label: "Confirm",
          description: "Guilds WL panel will be shown.",
          value: "authorizedservers",
          emoji: "✅",

          })

      const row = new ActionRowBuilder()
      .addComponents(menu1)

      await interaction.reply({ components: [row] })

    }
 };