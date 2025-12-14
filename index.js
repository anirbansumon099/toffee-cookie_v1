const express = require('express');
const bodyParser = require('body-parser');
const BrowserCookieEngine = require('./cookieEngine');

const app = express();
const engine = new BrowserCookieEngine();

app.use(bodyParser.json());

// ✅ Route: Collect cookies from a URL
app.post('/collect-cookie', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const cookies = await engine.collect(url, 6000, true);
    res.json({
      success: true,
      message: 'Cookies collected and saved!',
      cookies_count: cookies.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to collect cookies' });
  }
});

// ✅ Route: Check saved cookies
app.get('/cookie-check', (req, res) => {
  const cookies = engine.loadCookies();
  res.json({
    total_cookies: cookies.length,
    cookies
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
