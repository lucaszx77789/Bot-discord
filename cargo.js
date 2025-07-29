// commands/cargo.js
import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('cargo')
    .setDescription('Dá um cargo a um membro.')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para dar o cargo')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo que será dado')
        .setRequired(true)),
  async execute(interaction) {
    const autorizado = ['1390556861148958772', '1396986644841631886'];
    if (!autorizado.includes(interaction.user.id)) {
      return await interaction.reply({ content: '❌ Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const membro = interaction.options.getMember('usuário');
    const cargo = interaction.options.getRole('cargo');

    if (!membro || !cargo) {
      return await interaction.reply({ content: '❌ Usuário ou cargo inválido.', ephemeral: true });
    }

    try {
      await membro.roles.add(cargo);
      await interaction.reply(`✅ O cargo ${cargo} foi setado para ${membro}.`);

      // Log no canal others-logs
      const canalLogs = interaction.guild.channels.cache.get('1396943012789227711');
      if (canalLogs) {
        const embed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Cargo Setado')
          .addFields(
            { name: 'Usuário', value: `${membro.user.tag} (<@${membro.user.id}>)`, inline: true },
            { name: 'Cargo', value: `${cargo.name} (<@&${cargo.id}>)`, inline: true },
            { name: 'Setado por', value: `${interaction.user.tag} (<@${interaction.user.id}>)` }
          )
          .setTimestamp();
        await canalLogs.send({ embeds: [embed] });
      }

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Erro ao atribuir o cargo.', ephemeral: true });
    }
  }
};