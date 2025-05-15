import fetch from 'node-fetch';

const GITHUB_REPO = 'plxt79/database';
const FOLDER_PATH = 'Games ZIPs';

export default async function handler(req, res) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(FOLDER_PATH)}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
    }

    const data = await response.json();
    const count = Array.isArray(data) ? data.length : 0;

    res.status(200).json({
      count: count.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file count' });
  }
}
