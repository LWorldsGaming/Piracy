const OWNER = 'plxt79';
const REPO = 'database';
const FOLDER_PATH = 'Games ZIPs';

export default async function handler(req, res) {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FOLDER_PATH)}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
    }

    const data = await response.json();

    // Count only files (type === 'file')
    const fileCount = Array.isArray(data)
      ? data.filter(item => item.type === 'file').length
      : 0;

    res.status(200).json({
      count: fileCount.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file count' });
  }
}
