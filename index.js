const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace this with your actual Make.com webhook
const MAKE_WEBHOOK_URL = 'https://hook.make.com/your-real-webhook-url';

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const event = req.body;

  console.log('Received event:', JSON.stringify(event, null, 2));

  // Try to extract from different possible structures
  const message =
    event.message?.text ||
    event.chat?.messagePayload?.message?.text ||
    null;

  const sender =
    event.message?.sender?.displayName ||
    event.chat?.messagePayload?.message?.sender?.displayName ||
    'Unknown';

  const email =
    event.message?.sender?.email ||
    event.chat?.messagePayload?.message?.sender?.email ||
    'Unknown';

  const space =
    event.space?.displayName ||
    event.chat?.messagePayload?.space?.displayName ||
    'Unknown';

  if (message) {
    // ✅ Debugging log
    console.log('Sending to Make.com:', { message, sender, email, space });

    try {
      await axios.post(MAKE_WEBHOOK_URL, {
        message,
        sender,
        email,
        space,
      });
      console.log('✅ Forwarded to Make.com');
    } catch (error) {
      console.error('❌ Error forwarding to Make.com:', error.message);
    }
  } else {
    console.log('⚠️ No message found in event — skipping.');
  }

  // Always respond 200 OK
  res.json({ text: 'OK' });
});

app.get('/', (req, res) => {
  res.send('Google Chat Bot is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
