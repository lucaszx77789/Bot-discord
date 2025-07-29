import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Desbloqueia um canal de texto.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal a ser desbloqueado')
        .setRequired(true)
    ),

  async execute(interaction) {
    const autorizado = ['1390556861148958772', '1396986644841631886'];
    if (!autorizado.includes(interaction.user.id)) {
      return interaction.reply({
        content: '❌ Você não tem permissão para usar este comando.',
        ephemeral: true
      });
    }

    const canal = interaction.options.getChannel('canal');

    if (!canal.isTextBased()) {
      return interaction.reply({
        content: '❌ Apenas canais de texto podem ser desbloqueados.',
        ephemeral: true
      });
    }

    try {
      await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true
      });

      await interaction.reply(`🔓 O canal ${canal} foi **desbloqueado** com sucesso.`);

      // Log
      const canalLogs = await interaction.guild.channels.fetch('1396943012789227711').catch(() => null);
      if (canalLogs && canalLogs.type === ChannelType.GuildText) {
        const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle('🔓 Canal Desbloqueado')
          .addFields(
            { name: 'Canal', value: `${canal}`, inline: true },
            { name: 'Responsável', value: `<@${interaction.user.id}>`, inline: true }
          )
          .setTimestamp();
        await canalLogs.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Erro ao desbloquear o canal.',
        ephemeral: true
      });
    }
  }
};