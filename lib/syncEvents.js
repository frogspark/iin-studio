import { createClient } from '@sanity/client';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { basename, extname } from 'path';
import 'dotenv/config';
import { htmlToBlocks } from '@sanity/block-tools';
import blockContentType from './schemas/blocks'; // schema definition for the "content" field

function convertHtmlToBlocks(html) {
  try {
    const blocks = htmlToBlocks(html, blockContentType);
    return blocks;
  } catch (err) {
    console.error('Failed to convert HTML to blocks:', err);
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: html.replace(/<[^>]*>/g, ''), marks: [] }
        ]
      }
    ];
  }
}

const sanity = createClient({
  projectId: 'qjsm7swb',
  dataset: 'staging',
  token: 'skKjsNiXlYEvWeI58dRdlBl9y5w0Pt1Ofa58eQ5MpaVxMznPDPBOipzKnLjp6WJbjaBlForrIo8eltq2beoqFA6Ygpgmo9kCsaj7Yx5jJ0ynK2B6vK0rYRaHyvm4wizB2g2gHmxnUX5okDe3DJWjevF6iA7FKgHjwwwN5iZvLopcT6HVHLYv',
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

function convertHtmlToBlocks(html) {
  try {
    const blocks = htmlToBlocks(html, blockContentType);
    return blocks;
  } catch (err) {
    console.error('Failed to convert HTML to blocks:', err);
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: html.replace(/<[^>]*>/g, ''), marks: [] }
        ]
      }
    ];
  }
}
async function uploadImageToSanity(url, fallbackName = 'image') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image fetch failed: ${url}`);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extFromUrl = extname(new URL(url).pathname) || '';
    const extFromType = contentType.includes('png') ? '.png' : '.jpg';
    const ext = extFromUrl || extFromType;
    const filename = `${fallbackName}${ext}`;

    const buffer = await response.arrayBuffer();
    const stream = Readable.from(buffer);

    const asset = await sanity.assets.upload('image', stream, {
      filename,
      contentType,
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error('Image upload error:', err);
    return null;
  }
}

function parseDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

export async function syncEvents() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);

  const events = await res.json();
for (const event of events) {
  const existingDocs = await sanity.fetch(
    `*[_type == "syncEvent" && externalId == $externalId][0]`,
    { externalId: event.Id.toString() }
  );

  if (existingDocs) {
    console.log(`Skipping already synced event: ${event.EventName}`);
    continue; // skip this event
  }

  const imageField = event.featured_image
    ? await uploadImageToSanity(event.featured_image, `event-${event.Id}`)
    : null;

  const docId = `drafts.syncEvent-${event.Id}`;
  const doc = {
    _id: docId,
    _type: 'syncEvent',
    title: event.EventName,
    content: convertHtmlToBlocks(event.EventDescription || ''),
    start: parseDateTime(event.EventStartDate, event.EventStartTime),
    end: parseDateTime(event.EventEndDate, event.EventEndTime),
    location: event.EventVenueName || '',
    externalId: event.Id.toString(),
    mobileHeroImage: imageField,
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


