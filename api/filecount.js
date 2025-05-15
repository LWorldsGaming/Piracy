import fetch from 'node-fetch';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // your GitHub token here
const OWNER = 'plxt79';
const REPO = 'database';
const PATH = 'Games ZIPs';

async function getFileCount(owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();

  // Count only files (type === 'file')
  const fileCount = data.filter(item => item.type === 'file').length;
  return fileCount;
}

export default async function handler(req, res) {
  try {
    const truecount = await getFileCount(OWNER, REPO, PATH);

    function truncateCount(num) {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
      return num.toString();
    }

    res.status(200).json({
      count: truncateCount(truecount),
      truecount: truecount.toString(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
