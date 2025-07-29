import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('denunciar')
    .setDescription('Envie uma denúncia contra um usuário')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário a ser denunciado')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo da denúncia')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo');

    const embed = new EmbedBuilder()
      .setTitle('📣 Nova Denúncia')
      .setColor(0xff0000)
      .setDescription(`**Usuário denunciado:** ${user}\n**Autor da denúncia:** ${interaction.user}\n**Motivo:** ${motivo}`)
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`denuncia_aceita_${user.id}`)
          .setLabel('Aceitar')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`denuncia_recusada_${user.id}`)
          .setLabel('Recusar')
          .setStyle(ButtonStyle.Danger)
      );

    const canalLog = interaction.guild.channels.cache.get('1396943012789227711'); // Canal de logs
    if (!canalLog) return interaction.reply({ content: '❌ Canal de logs não encontrado.', ephemeral: true });

    await canalLog.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Denúncia enviada com sucesso!', ephemeral: true });
  }
};