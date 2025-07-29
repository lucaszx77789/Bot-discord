import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('responder')
    .setDescription('Responde em um canal específico.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal onde a resposta será enviada')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Mensagem que será enviada')
        .setRequired(true)
    ),

  async execute(interaction) {
    const canal = interaction.options.getChannel('canal');
    const mensagem = interaction.options.getString('mensagem');

    if (!canal.isTextBased()) {
      return interaction.reply({ content: '❌ Este não é um canal de texto.', ephemeral: true });
    }

    await canal.send(mensagem);
    await interaction.reply({ content: `✅ Mensagem enviada para ${canal}`, ephemeral: true });
  },
};