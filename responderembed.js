// commands/responderembed.js
import { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('responderembed')
    .setDescription('Envia uma embed personalizada para qualquer canal')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal onde a embed será enviada')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título da embed')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('descricao')
        .setDescription('Descrição da embed')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('cor')
        .setDescription('Cor da embed (ex: #ff0000)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const canal = interaction.options.getChannel('canal');
    const titulo = interaction.options.getString('titulo');
    const descricao = interaction.options.getString('descricao');
    const cor = interaction.options.getString('cor') || '#2f3136';

    const embed = new EmbedBuilder()
      .setTitle(titulo)
      .setDescription(descricao)
      .setColor(cor)
      .setFooter({ text: `Enviado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await canal.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Embed enviada com sucesso!', ephemeral: true });

    // Log para canal others-logs
    const logChannel = interaction.client.channels.cache.get('1396943012789227711');
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('📤 Embed Enviada')
        .addFields(
          { name: 'Autor', value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: false },
          { name: 'Canal de Destino', value: `${canal}`, inline: false },
          { name: 'Título', value: titulo, inline: false },
          { name: 'Descrição', value: descricao, inline: false },
        )
        .setColor('Blurple')
        .setTimestamp();
      logChannel.send({ embeds: [logEmbed] });
    }
  },
};