import fetch from 'node-fetch';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set this in your env

const OWNER = 'plxt79';
const REPO = 'blackbay';
const PATH = 'public'; // folder path you want to count files in

async function getFileCount(owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}/Games ZIPs`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();

  // data is an array of file/folder objects in that path
  // count files only (ignore folders if you want)
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
