const { client, EmbedBuilder, InteractionType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, Collection } = require("discord.js");

const { SlashCommandBuilder } = require("@discordjs/builders");
const botSchema = require('../Schema/botSchema');
const config = require('../Settings/config');

module.exports = {
  data: new SlashCommandBuilder()
       .setName("guilds")

    .setDescription("🛡️ Guilds List"),
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

       let serverlist = ''
        client.guilds.cache.forEach((guild) => {
            serverlist = serverlist.concat(" - " + guild.name + ": ID: " + guild.id + "\n")
        })

       const embed1 = new EmbedBuilder()
        .setTitle("🛡️ Guilds List")
         .setColor(2829617)
        .setDescription(serverlist)
       await interaction.reply({ embeds: [embed1]})
    
   

    }
 };

