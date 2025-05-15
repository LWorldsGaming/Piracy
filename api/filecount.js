const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/plxt79/database/git/trees/main?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    const data = await response.json();

    if (!data.tree) {
      return res.status(500).json({ error: 'Invalid tree response' });
    }

    const files = data.tree.filter(
      (item) => item.path.startsWith('Games ZIPs/') && item.type === 'blob'
    );

    const count = files.length;
    const readable = count >= 1000 ? `${(count / 1000).toFixed(1)}K` : `${count}`;

    return res.status(200).json({
      count: readable,
      truecount: count
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}