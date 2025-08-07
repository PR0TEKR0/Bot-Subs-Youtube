// 📦 Importaciones
require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const axios = require('axios');

// 🌐 Servidor Express
const app = express();
app.get('/', (req, res) => res.send('Bot de Discord activo ✅'));
app.listen(3000, () => console.log('🌐 Servidor Express corriendo en puerto 3000'));

// 🤖 Configuración del bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 🔁 Función para obtener subs de YouTube
async function getSubscribers() {
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'statistics',
        id: process.env.YT_CHANNEL_ID,
        key: process.env.YT_API_KEY,
      },
    });

    return res.data.items[0]?.statistics?.subscriberCount || null;
  } catch (err) {
    console.error('❌ Error obteniendo subs:', err.message);
    return null;
  }
}

// 🔁 Función para actualizar el nombre del canal
async function updateChannelName() {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const channel = await guild.channels.fetch(process.env.VOICE_CHANNEL_ID);

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      console.error('❌ Canal no válido o no es de voz.');
      return;
    }

    const subs = await getSubscribers();
    if (!subs) {
      console.warn('⚠️ No se pudieron obtener subs.');
      return;
    }

    await channel.setName(`📺Ytube-Subscriptions: ${subs}`);
    console.log(`✅ Canal actualizado con ${subs} subs`);
  } catch (err) {
    console.error('❌ Error actualizando canal:', err.message);
  }
}

// 🔌 Conexión del bot
client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
  updateChannelName();
  setInterval(updateChannelName, 1000); // cada segundo
});

client.login(process.env.DISCORD_TOKEN);