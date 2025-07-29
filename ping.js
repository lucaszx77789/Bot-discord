import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra a latência do bot.'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pingando...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Latência: ${ping}ms`);
  },
};