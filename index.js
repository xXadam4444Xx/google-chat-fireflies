const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Your actual Make.com webhook
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/bddiaye4qahcplznx7e6ja5tygc5qphx';

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const event = req.body;

  console.log('Received event:', JSON.stringify(event, null, 2));

  // ✅ Extract only the actual user message (excluding @mention)
  const message =
    event.chat?.messagePayload?.message?.argumentText?.trim() ||
    event.message?.text?.trim() ||
    event.chat?.messagePayload?.message?.text?.trim() ||
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
    // ✅ Log what will be sent
    const payload = { message, sender, email, space };
    console.log('Sending to Make.com:', payload);

    try {
      await axios.post(MAKE_WEBHOOK_URL, payload);
      console.log('✅ Forwarded to Make.com');
    } catch (error) {
      console.error('❌ Error forwarding to Make.com:', error.message);
      if (error.response) {
        console.error('❌ Make.com response:', error.response.data);
      }
    }
  } else {
    console.log('⚠️ No message found in event — skipping.');
  }

  // ✅ Always respond to Chat with success
  res.json({ text: 'OK' });
});

app.get('/', (req, res) => {
  res.send('Google Chat Bot is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
