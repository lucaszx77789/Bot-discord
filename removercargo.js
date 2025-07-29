import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removercargo')
    .setDescription('Remove um cargo de um membro')
    .addUserOption(option =>
      option.setName('membro').setDescription('Membro que terá o cargo removido').setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('cargo').setDescription('Cargo que será removido do membro').setRequired(true)
    ),

  async execute(interaction, client) {
    const membro = interaction.options.getMember('membro');
    const cargo = interaction.options.getRole('cargo');

    const dono = interaction.user.id === '1390556861148958772' || interaction.user.id === '1396986644841631886';
    const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);

    if (!dono && !isAdmin) {
      return interaction.reply({ content: '🚫 Você não tem permissão para usar este comando.', ephemeral: true });
    }

    if (!membro.roles.cache.has(cargo.id)) {
      return interaction.reply({ content: `❌ O membro não possui o cargo ${cargo.name}.`, ephemeral: true });
    }

    try {
      await membro.roles.remove(cargo);
      await interaction.reply({ content: `✅ Cargo ${cargo.name} removido de ${membro.user.tag}.` });

      // Enviar log
      const canalLogs = await interaction.guild.channels.fetch('1396943012789227711').catch(() => null);
      if (canalLogs) {
        const embed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle('📤 Cargo Removido')
          .addFields(
            { name: 'Membro', value: `${membro.user.tag} (<@${membro.user.id}>)`, inline: true },
            { name: 'Cargo Removido', value: `${cargo.name}`, inline: true },
            { name: 'Responsável', value: `<@${interaction.user.id}>`, inline: true }
          )
          .setTimestamp();

        await canalLogs.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Erro ao remover o cargo.', ephemeral: true });
    }
  }
};