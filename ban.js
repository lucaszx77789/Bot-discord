import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro do servidor.')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para banir')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do banimento')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', ephemeral: true });

    await member.ban({ reason: motivo });
    await interaction.reply({ content: `✅ ${user.tag} foi banido. Motivo: ${motivo}` });
  },
};