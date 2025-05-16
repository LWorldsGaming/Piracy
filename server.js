const express = require('express');
const app = express();
const port = 3000;

// Middleware to block mobile devices
app.use((req, res, next) => {
  const ua = req.headers['user-agent'];
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  if (mobileRegex.test(ua)) {
    return res.status(403).send("🚫 Access denied. Desktop only.");
  }

  next();
});

// Serve your static frontend
app.use(express.static('public')); // <-- put your HTML/CSS/JS in a 'public' folder

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});