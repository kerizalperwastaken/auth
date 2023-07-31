const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botSchema = require('../Schema/botSchema');
const config = require('../Settings/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")

    .setDescription("🏃 Pulls verified users to the server."),
    enabled: true,
    async execute(interaction, client) {


      const embed = new EmbedBuilder()
      .setTitle(interaction.locale == "tr" ? "❌ Erişim reddetildi" : interaction.locale == "fr" ? "❌ Acces refuse" : "❌ Access denied")
      .setColor(2829617)
      let btn = new ButtonBuilder()
      .setStyle(5)
      .setURL(client.authInvite)
      .setLabel("Add bot")
      .setEmoji("🤖");
      let btn2 = new ButtonBuilder()
      .setStyle(5)
      .setURL("https://opps.lol/discord")
      .setLabel("Join support")
      .setEmoji("❓");
      const row31 = new ActionRowBuilder() 
      .addComponents([btn, btn2]);

      let data = await botSchema.findOne({ clientId: client.user.id })
      let whitelist = data.whitelist.find(x => x.id === interaction.user.id)
      if(!config.authDevelopers.includes(interaction.user.id) && !config.authOwners.includes(interaction.user.id) && whitelist?.id !== interaction.user.id) return interaction.reply({ ephemeral: true, embeds: [embed], components: [row31]})
  
      let menu1 = new StringSelectMenuBuilder()
        .setCustomId("menu1")
        .setPlaceholder("Select an option")
        .addOptions({

          

          label: "Confirm",
          description: "Join panel will be shown.",
          value: "joinusers",
          emoji: "✅",

        })

      const row = new ActionRowBuilder()
      .addComponents(menu1)

      await interaction.reply({ components: [row] })

    }
 };


//  Debugg code: TISF-309