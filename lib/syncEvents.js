import 'dotenv/config'; // ESM

import { createClient } from '@sanity/client';

  console.log('ENV:', process.env.SANITY_PROJECT_ID)

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

export async function syncEvents() {
  const res = await fetch(API_URL);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const events = json.data || [];

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
  }
}
