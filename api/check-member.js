const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.LUNA_TOKEN;
const GUILD_ID = '1350405878146142211';

app.get('/api/check-member', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const response = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (response.status === 200) {
      return res.status(200).json({ inGuild: true });
    } else if (response.status === 404) {
      return res.status(404).json({ inGuild: false });
    } else {
      return res.status(500).json({ error: 'Discord API error' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
