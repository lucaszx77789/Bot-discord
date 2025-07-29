import { Client, GatewayIntentBits, Collection, Events, REST, Routes, EmbedBuilder, Partials, ChannelType } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = (await import(`./commands/${file}`)).default;
  if (command?.data && command?.execute) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
}

// Registrar comandos Slash
client.once(Events.ClientReady, async () => {
  const CLIENT_ID = client.user.id;
  const GUILD_ID = '1298489519993000051';

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }

  console.log(`✅ Logado como ${client.user.tag}`);
});

// Executar comandos Slash
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Verificação: apenas quem tem ADMINISTRADOR ou é o ID autorizado pode usar
  const isOwner = interaction.user.id === '1390556861148958772' || interaction.user.id === '1396986644841631886';
  const isAdmin = interaction.memberPermissions?.has('Administrator');

  if (!isOwner && !isAdmin) {
    return interaction.reply({ content: '🚫 Você não tem permissão para usar este comando.', ephemeral: true });
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Houve um erro ao executar o comando.', ephemeral: true });
  }
});

// Detectar mensagens em canais ticket-219+
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  const canalLogs = await message.guild.channels.fetch('1396943012789227711').catch(() => null);
  const canal = message.channel;

  const match = canal.name.match(/ticket-(\d+)/i);

  if (match && parseInt(match[1]) >= 219) {
    try {
      await canal.send(
        'Olá! Como posso lhe ser útil? Estou à disposição para auxiliá-lo(a) com qualquer dúvida, solicitação ou necessidade relacionada a este ticket. Sinta-se à vontade para explicar sua situação com o máximo de detalhes possível, para que eu possa oferecer o melhor suporte. Caso precise de mais ajuda marque <@1390556861148958772>.'
      );

      if (canalLogs) {
        const embed = new EmbedBuilder()
          .setColor('#00b0f4')
          .setTitle('📩 Atendimento automático iniciado')
          .addFields(
            { name: 'Canal', value: `${canal.name}`, inline: true },
            { name: 'Usuário', value: `<@${message.author.id}>`, inline: true }
          )
          .setTimestamp();

        await canalLogs.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error('Erro ao responder ticket:', err);
    }
  }

  // Logar mensagens indevidas no canal de avisos
  if (message.channel.id === '1387992290143895634' && message.author.id !== client.user.id) {
    if (canalLogs) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🚨 Mensagem detectada no canal de avisos')
        .addFields(
          { name: 'Usuário', value: `<@${message.author.id}>`, inline: true },
          { name: 'Mensagem', value: message.content.slice(0, 1000) || 'Nenhuma' }
        )
        .setTimestamp();

      await canalLogs.send({ embeds: [embed] });
    }
  }

  // Responder se o bot for mencionado
  if (message.mentions.has(client.user)) {
    message.reply({ content: 'Olá! Posso te ajudar com algo? Use os comandos slash para interagir comigo!' });
  }
});

client.login(process.env.TOKEN);