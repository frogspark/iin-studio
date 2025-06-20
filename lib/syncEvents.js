import { createClient } from '@sanity/client';
import 'dotenv/config';

const sanity = createClient({
  projectId: 'qjsm7swb',
  dataset: 'staging',
  token: 'skKjsNiXlYEvWeI58dRdlBl9y5w0Pt1Ofa58eQ5MpaVxMznPDPBOipzKnLjp6WJbjaBlForrIo8eltq2beoqFA6Ygpgmo9kCsaj7Yx5jJ0ynK2B6vK0rYRaHyvm4wizB2g2gHmxnUX5okDe3DJWjevF6iA7FKgHjwwwN5iZvLopcT6HVHLYv',
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

function generateKey() {
  return Math.random().toString(36).substr(2, 10);
}
function decodeHtmlEntities(text) {
  if (typeof document !== 'undefined') {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  }

  // Fallback for non-browser environments (Node.js)
  return text.replace(/&([^;]+);/g, (match, entity) => {
    const entities = {
      nbsp: ' ',
      amp: '&',
      pound: '£',
      mdash: '—',
      // add more if needed
    };
    return entities[entity] || match;
  });
}
function basicHtmlToBlocks(html) {
  const blocks = [];
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gis) || [html];

  for (let para of paragraphs) {
    para = para.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
    const children = [];

    const segments = para.split(/<br\s*\/?>/i);
    for (let segment of segments) {
      const parts = segment.split(/(<strong>|<\/strong>)/i);
      let isStrong = false;

      for (let part of parts) {
        if (part.toLowerCase() === '<strong>') {
          isStrong = true;
          continue;
        } else if (part.toLowerCase() === '</strong>') {
          isStrong = false;
          continue;
        }

        if (part.trim() === '') continue;

        children.push({
          _type: 'span',
          _key: generateKey(),
          text: decodeHtmlEntities(part),
          marks: isStrong ? ['strong'] : [],
        });
      }

      if (segment !== segments[segments.length - 1]) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: '\n',
          marks: [],
        });
      }
    }

    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children,
    });
  }

  return blocks;
}


function parseDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

export async function syncEvents() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);

  const events = await res.json();
  const existingIds = new Set(
  (await sanity.fetch(`*[_type == "syncEvent"].externalId`)).map(String)
);
for (const event of events) {
  const eventId = event.Id.toString();

  if (existingIds.has(eventId)) {
    console.log(`Skipping already synced event: ${event.EventName}`);
    continue;
  }


  const docId = `drafts.syncEvent-${event.Id}`;
  const doc = {
    _id: docId,
    _type: 'syncEvent',
    title: event.EventName,
    content: basicHtmlToBlocks(event.EventDescription || ''),
    start: parseDateTime(event.EventStartDate, event.EventStartTime),
    // end: parseDateTime(event.EventEndDate, event.EventEndTime),
    location: event.EventVenueName || '',
    externalId: event.Id.toString(),
    mobileHeroImage: event.featured_image,
    address: event.VenueAddress || '',
    // latitude: event.VenueLatitude ? parseFloat(event.VenueLatitude) : null,
    // longitude: event.VenueLongitude ? parseFloat(event.VenueLongitude) : null,
    category: event.EventCategory || '',
    ticketUrl: event.AppUrl || '',
    // website: event.EventWebsite || '',
  };

  console.log(`Syncing event: ${doc.title}`);
  await sanity.createOrReplace(doc);
}

}


