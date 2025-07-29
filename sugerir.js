import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sugerir')
    .setDescription('Envie uma sugestão para o servidor.')
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Sugestão')
        .setRequired(true)
    ),

  async execute(interaction) {
    const sugestao = interaction.options.getString('mensagem');
    const canalSugestao = await interaction.guild.channels.fetch('1397764596277841942');

    const embed = new EmbedBuilder()
      .setColor('#00ffcc')
      .setTitle('💡 Nova Sugestão')
      .setDescription(sugestao)
      .setFooter({ text: `Sugestão de ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    const msg = await canalSugestao.send({ embeds: [embed] });
    await msg.react('👍');
    await msg.react('👎');

    await interaction.reply({ content: '✅ Sua sugestão foi enviada!', ephemeral: true });
  },
};