require('dotenv').config();
const axios = require('axios');
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

// Utility functions
async function getAllExistingEvents() {
  try {
    const events = await sanity.fetch('*[_type == "syncEvent"]{externalId, _id, deleted, recurringEventId, eventInstanceId}');
    return events;
  } catch (error) {
    console.error('Error fetching existing events:', error);
    return [];
  }
}

async function markEventAsDeleted(externalId) {
  try {
    const query = '*[_type == "syncEvent" && externalId == $externalId][0]';
    const event = await sanity.fetch(query, { externalId });

    if (event) {
      await sanity.patch(event._id).set({ deleted: true }).commit();
      console.log(`Marked event as deleted: ${externalId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error marking event as deleted (${externalId}):`, error);
    return false;
  }
}

async function createOrUpdateEvent(eventData) {
  try {
    const docId = `drafts.syncEvent-${eventData.externalId}`;

    // Check if event exists and is currently marked as deleted
    const existingEvent = await sanity.fetch(
      '*[_type == "syncEvent" && externalId == $externalId][0]',
      { externalId: eventData.externalId }
    );

    const doc = {
      _id: docId,
      _type: 'syncEvent',
      ...eventData,
      deleted: false, // Always set to false when syncing from API
    };

    await sanity.createOrReplace(doc);

    const action = existingEvent?.deleted ? 'restored' : (existingEvent ? 'updated' : 'created');
    console.log(`${action} event: ${eventData.title} (ID: ${eventData.externalId})`);

    return doc;
  } catch (error) {
    console.error(`Error creating/updating event ${eventData.externalId}:`, error);
    return null;
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

async function handleSingleEvent(apiEvent) {
  const eventData = {
    externalId: apiEvent.Id || apiEvent.id?.toString() || '',
    title: apiEvent.EventName || apiEvent.name || 'Untitled Event',
    description: apiEvent.EventDescription || apiEvent.description || '',
    start: apiEvent.EventStartDate || apiEvent.start,
    end: apiEvent.EventEndDate || apiEvent.end,
    address: apiEvent.VenueAddress || apiEvent.venue?.name || apiEvent.location || '',
    featuredImage: apiEvent.featured_image || '',
    largeImage: apiEvent.LargeImage || '',
    slug: {
      current: generateSlug(apiEvent.EventName || apiEvent.name || 'untitled-event'),
      _type: 'slug'
    },
    // Add any other fields that come from the API
    ...(apiEvent.age_limit && { age: apiEvent.age_limit }),
    ...(apiEvent.EventWebsite && { ticketUrl: apiEvent.EventWebsite }),
    ...(apiEvent.ticket_url && { ticketUrl: apiEvent.ticket_url }),
    buttonText: apiEvent.button_text || 'View in app',
  };

  return await createOrUpdateEvent(eventData);
}

async function handleRecurringEvent(apiEvent) {
  const results = [];
  const recurringEventId = apiEvent.Id || apiEvent.id?.toString() || '';

  // If the API provides individual instances in an array
  if (apiEvent.instances && Array.isArray(apiEvent.instances)) {
    for (const instance of apiEvent.instances) {
      const eventData = {
        externalId: instance.id ? instance.id.toString() : `${recurringEventId}-${instance.start}`,
        eventInstanceId: instance.id ? instance.id.toString() : `${recurringEventId}-${instance.start}`,
        recurringEventId: recurringEventId,
        title: apiEvent.EventName || apiEvent.name || 'Untitled Event',
        description: apiEvent.EventDescription || apiEvent.description || '',
        start: instance.start,
        end: instance.end,
        address: apiEvent.VenueAddress || apiEvent.venue?.name || apiEvent.location || '',
        featuredImage: apiEvent.featured_image || '',
        largeImage: apiEvent.LargeImage || '',
        slug: {
          current: generateSlug(`${apiEvent.EventName || apiEvent.name || 'untitled-event'}-${instance.start}`),
          _type: 'slug'
        },
        ...(apiEvent.age_limit && { age: apiEvent.age_limit }),
        ...(apiEvent.EventWebsite && { ticketUrl: apiEvent.EventWebsite }),
        ...(apiEvent.ticket_url && { ticketUrl: apiEvent.ticket_url }),
        buttonText: apiEvent.button_text || 'Book Now',
      };

      const result = await createOrUpdateEvent(eventData);
      if (result) results.push(result);
    }
  } else {
    // If it's a single recurring event without individual instances
    // Treat it as a single event but mark it as part of a recurring series
    const eventData = {
      externalId: apiEvent.Id || apiEvent.id?.toString() || '',
      recurringEventId: recurringEventId,
      eventInstanceId: apiEvent.Id || apiEvent.id?.toString() || '',
      title: apiEvent.EventName || apiEvent.name || 'Untitled Event',
      description: apiEvent.EventDescription || apiEvent.description || '',
      start: apiEvent.EventStartDate || apiEvent.start,
      end: apiEvent.EventEndDate || apiEvent.end,
      address: apiEvent.VenueAddress || apiEvent.venue?.name || apiEvent.location || '',
      featuredImage: apiEvent.featured_image || '',
      largeImage: apiEvent.LargeImage || '',
      slug: {
        current: generateSlug(apiEvent.EventName || apiEvent.name || 'untitled-event'),
        _type: 'slug'
      },
      ...(apiEvent.age_limit && { age: apiEvent.age_limit }),
      ...(apiEvent.EventWebsite && { ticketUrl: apiEvent.EventWebsite }),
      ...(apiEvent.ticket_url && { ticketUrl: apiEvent.ticket_url }),
      buttonText: apiEvent.button_text || 'Book Now',
    };

    const result = await createOrUpdateEvent(eventData);
    if (result) results.push(result);
  }

  return results;
}

async function markMissingEventsAsDeleted(existingEvents, currentApiEventIds) {
  let deletedCount = 0;

  for (const existingEvent of existingEvents) {
    // Skip events that are already marked as deleted
    if (existingEvent.deleted) continue;

    // If the event's externalId is not in the current API response, mark it as deleted
    if (!currentApiEventIds.has(existingEvent.externalId)) {
      const success = await markEventAsDeleted(existingEvent.externalId);
      if (success) deletedCount++;
    }
  }

  return deletedCount;
}

async function fetchAndSyncEvents() {
  try {
    console.log('Starting enhanced event sync...');

    // Fetch existing events from Sanity
    console.log('Fetching existing events from Sanity...');
    const existingEvents = await getAllExistingEvents();
    console.log(`Found ${existingEvents.length} existing events in Sanity`);

    // Fetch events from API
    console.log('Fetching events from Loqiva API...');
    const { data } = await axios.get(API_URL);
    const apiEvents = data.data || [];
    console.log(`Found ${apiEvents.length} events in API`);

    // Track current API event IDs (including all instances)
    const currentApiEventIds = new Set();
    const processedEvents = [];

    // Process each event from the API
    for (const apiEvent of apiEvents) {
      try {
        // Add the main event ID to our tracking set
        currentApiEventIds.add(apiEvent.id.toString());

        // Determine if this is a recurring event
        const isRecurring = apiEvent.is_recurring ||
                           apiEvent.recurrence ||
                           (apiEvent.instances && Array.isArray(apiEvent.instances));

        if (isRecurring) {
          console.log(`Processing recurring event: ${apiEvent.name}`);
          const results = await handleRecurringEvent(apiEvent);
          processedEvents.push(...results);

          // Add all instance IDs to tracking set
          if (apiEvent.instances) {
            apiEvent.instances.forEach(instance => {
              if (instance.id) {
                currentApiEventIds.add(instance.id.toString());
              }
            });
          }
        } else {
          console.log(`Processing single event: ${apiEvent.name}`);
          const result = await handleSingleEvent(apiEvent);
          if (result) processedEvents.push(result);
        }
      } catch (error) {
        console.error(`Error processing event ${apiEvent.id}:`, error);
      }
    }

    // Mark events that are no longer in the API as deleted
    console.log('Checking for deleted events...');
    const deletedCount = await markMissingEventsAsDeleted(existingEvents, currentApiEventIds);

    // Summary
    console.log('\n=== Sync Summary ===');
    console.log(`API Events: ${apiEvents.length}`);
    console.log(`Processed Events: ${processedEvents.length}`);
    console.log(`Marked as Deleted: ${deletedCount}`);
    console.log(`Existing Events in Sanity: ${existingEvents.length}`);
    console.log('Sync completed successfully!');

  } catch (error) {
    console.error('Error during event sync:', error);
    process.exit(1);
  }
}

// Export functions for testing or external use
module.exports = {
  fetchAndSyncEvents,
  handleSingleEvent,
  handleRecurringEvent,
  markEventAsDeleted,
  getAllExistingEvents
};

// Run the sync if this file is executed directly
if (require.main === module) {
  fetchAndSyncEvents();
}