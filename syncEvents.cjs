require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@sanity/client');

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

async function fetchAndSaveEvents() {
  try {
    const { data } = await axios.get(API_URL);
    const events = data.data || [];

    for (const event of events) {
      const docId = `drafts.syncEvent-${event.id}`;
      const doc = {
        _id: docId,
        _type: 'syncEvent',
        title: event.name,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.venue?.name || '',
        externalId: event.id.toString(),
      };

      await sanity.createOrReplace(doc);
      console.log(`Saved draft for event: ${event.name}`);
    }

    console.log('All events synced to Sanity as drafts.');
  } catch (err) {
    console.error('Error syncing events:', err.message);
  }
}

fetchAndSaveEvents();
