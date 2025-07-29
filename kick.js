import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um membro do servidor.')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para expulsar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo da expulsão')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });

    await member.kick(motivo);
    await interaction.reply({ content: `✅ ${user.tag} foi expulso. Motivo: ${motivo}` });
  },
};