import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
    .setName('saircall')
    .setDescription('Faz o bot sair da call.'),

  async execute(interaction) {
    const membro = interaction.member;

    if (!membro.permissions.has('Administrator') && !['1390556861148958772', '1396986644841631886'].includes(interaction.user.id)) {
      return interaction.reply({ content: '❌ Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      return interaction.reply({ content: '❌ Não estou em nenhuma call neste servidor.', ephemeral: true });
    }

    connection.destroy();
    await interaction.reply('✅ Saí da call com sucesso.');

    const canalLogs = interaction.guild.channels.cache.get('1396943012789227711');
    if (canalLogs) {
      await canalLogs.send(`📤 O bot saiu do canal de voz às <t:${Math.floor(Date.now() / 1000)}:F>.`);
    }
  }
};