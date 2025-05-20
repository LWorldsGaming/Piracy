const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// 🔒 Global rate limiter
const limiter = rateLimit({
  windowMs: 3 * 1000, // 15 sec
  max: 20,              // max 5 requests per IP
  message: 'Too many requests, slow down 😵‍💫'
});

app.use(limiter); // apply to all routes

// your routes
app.post('/api/request', (req, res) => {
  // handle request
});

app.get('/api/download', (req, res) => {
  // handle download
});

app.listen(3000, () => console.log('Server running on port 3000'));