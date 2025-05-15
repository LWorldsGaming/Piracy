export default async function handler(req, res) {
  const response = await fetch("https://raw.githubusercontent.com/plxt79/blackbay/public/res/file-count.json");
  const data = await response.json();
  res.status(200).json({ count: data["file-count"] });
}
