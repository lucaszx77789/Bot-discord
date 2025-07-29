import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
    .setName('entrarcall')
    .setDescription('Faz o bot entrar em uma call.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal de voz para o bot entrar')
        .setRequired(true)
    ),

  async execute(interaction) {
    const canal = interaction.options.getChannel('canal');
    const membro = interaction.member;

    if (!membro.permissions.has('Administrator') && !['1390556861148958772', '1396986644841631886'].includes(interaction.user.id)) {
      return interaction.reply({ content: '❌ Você não tem permissão para usar este comando.', ephemeral: true });
    }

    if (canal.type !== 2) {
      return interaction.reply({ content: '❌ O canal selecionado não é de voz.', ephemeral: true });
    }

    joinVoiceChannel({
      channelId: canal.id,
      guildId: canal.guild.id,
      adapterCreator: canal.guild.voiceAdapterCreator
    });

    await interaction.reply(`✅ Entrei no canal de voz <#${canal.id}>.`);

    const canalLogs = interaction.guild.channels.cache.get('1396943012789227711');
    if (canalLogs) {
      await canalLogs.send(`📥 O bot entrou no canal de voz <#${canal.id}> às <t:${Math.floor(Date.now() / 1000)}:F>.`);
    }
  }
};