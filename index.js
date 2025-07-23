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

  // ✅ Extract the actual message content (after the @mention if present)
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

  const eventTime = event.chat?.eventTime || new Date().toISOString();

  if (message) {
    // ✅ Send data with field names that Make.com expects
    const payload = {
      "Message Text": message,
      "Sender": sender,
      "Email": email,
      "Space": space,
      "Event Time": eventTime,
      "Message Type": "MESSAGE"
    };

    console.log('📤 Sending to Make.com:', payload);

    try {
      const response = await axios.post(MAKE_WEBHOOK_URL, payload);
      console.log('✅ Forwarded to Make.com with status:', response.status);
    } catch (error) {
      console.error('❌ Error forwarding to Make.com:', error.message);
      if (error.response) {
        console.error('❌ Make.com response:', error.response.data);
      }
    }
  } else {
    console.log('⚠️ No message found in event — skipping.');
  }

  res.json({ text: 'OK' }); // Required by Google Chat
});

app.get('/', (req, res) => {
  res.send('Google Chat Bot is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
