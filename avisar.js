import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avisar')
    .setDescription('Envia um aviso no canal de avisos.')
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Conteúdo do aviso')
        .setRequired(true)
    ),

  async execute(interaction) {
    const donoId = '1390556861148958772';
    const canalAvisosId = '1387992290143895634'; // Canal de avisos
    const canalLogsId = '1396943012789227711';   // Canal de logs

    if (interaction.user.id !== donoId) {
      return interaction.reply({
        content: '❌ Apenas o dono pode usar este comando.',
        ephemeral: true
      });
    }

    const mensagem = interaction.options.getString('mensagem');
    const canalAvisos = await interaction.guild.channels.fetch(canalAvisosId).catch(() => null);
    const canalLogs = await interaction.guild.channels.fetch(canalLogsId).catch(() => null);

    if (!canalAvisos || canalAvisos.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: '❌ Canal de avisos inválido.',
        ephemeral: true
      });
    }

    const embedAviso = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('📢 Aviso')
      .setDescription(mensagem)
      .setFooter({ text: `Enviado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await canalAvisos.send({ embeds: [embedAviso] });

    if (canalLogs && canalLogs.type === ChannelType.GuildText) {
      const embedLog = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📌 Aviso Enviado')
        .addFields(
          { name: 'Autor', value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true },
          { name: 'Canal', value: `<#${canalAvisosId}>`, inline: true },
          { name: 'Conteúdo', value: mensagem }
        )
        .setTimestamp();

      await canalLogs.send({ embeds: [embedLog] });
    }

    await interaction.reply({
      content: '✅ Aviso enviado com sucesso!',
      ephemeral: true
    });
  },
};