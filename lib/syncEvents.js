require('dotenv').config();
import { createClient } from '@sanity/client';


const sanity = createClient({
  projectId: 'qjsm7swb',
  dataset: 'staging',
  token: 'skKjsNiXlYEvWeI58dRdlBl9y5w0Pt1Ofa58eQ5MpaVxMznPDPBOipzKnLjp6WJbjaBlForrIo8eltq2beoqFA6Ygpgmo9kCsaj7Yx5jJ0ynK2B6vK0rYRaHyvm4wizB2g2gHmxnUX5okDe3DJWjevF6iA7FKgHjwwwN5iZvLopcT6HVHLYv',
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

function parseDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const iso = new Date(`${dateStr}T${timeStr}`).toISOString();
  return iso;
}

export async function syncEvents() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const events = json || [];

  for (const event of events) {
    const docId = `drafts.syncEvent-${event.Id}`;
    const doc = {
      _id: docId,
      _type: 'syncEvent',
      title: event.EventName,
      content: event.EventDescription,
      start: parseDateTime(event.EventStartDate, event.EventStartTime),
      end: parseDateTime(event.EventEndDate, event.EventEndTime),
      location: event.EventVenueName || '',
      externalId: event.Id.toString(),
      mobileHeroImage: event.featured_image || '',
      address: event.VenueAddress || '',
      latitude: event.VenueLatitude ? parseFloat(event.VenueLatitude) : null,
      longitude: event.VenueLongitude ? parseFloat(event.VenueLongitude) : null,
      category: event.EventCategory || '',
      ticketUrl: event.AppUrl || '',
      website: event.EventWebsite || '',
    };

    console.log(`Syncing event: ${doc.title}`);
    await sanity.createOrReplace(doc);
  }
}

