import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia um membro do servidor.')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para mutar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do mute')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });

    await member.timeout(60_000 * 10, motivo); // 10 minutos por padrão
    await interaction.reply({ content: `✅ ${user.tag} foi mutado por 10 minutos. Motivo: ${motivo}` });
  },
};