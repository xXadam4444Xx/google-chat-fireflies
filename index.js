const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Replace this with your actual Make.com webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.make.com/your-make-webhook-url';

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const event = req.body;

  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.type === 'MESSAGE') {
    try {
      await axios.post(MAKE_WEBHOOK_URL, {
        message: event.message.text,
        sender: event.message.sender.displayName,
        email: event.message.sender.email,
        space: event.space.displayName,
      });
      console.log('Forwarded to Make.com');
    } catch (error) {
      console.error('Error forwarding to Make.com:', error.message);
    }
  }

  // Google Chat requires a JSON response
  res.json({ text: 'OK' });
});

app.get('/', (req, res) => {
  res.send('Google Chat → Make.com Webhook is live');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
