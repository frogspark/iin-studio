require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

async function checkEventDates() {
  console.log('🔍 Checking Event Dates\n');

  try {
    // Get active events with their dates
    const activeEvents = await sanity.fetch(`
      *[
        (_type == "syncEvent" || _type == "events") &&
        deleted != true
      ] | order(dateTime asc) {
        _id,
        _type,
        title,
        dateTime,
        deleted,
        showOnWebsite
      }
    `);

    console.log(`Found ${activeEvents.length} active events:\n`);

    const now = new Date();
    console.log(`Current Date: ${now.toISOString()}\n`);

    activeEvents.forEach((event, i) => {
      const eventDate = event.dateTime ? new Date(event.dateTime) : null;
      const isFuture = eventDate && eventDate > now;
      const status = isFuture ? '✅ FUTURE' : '❌ PAST';

      console.log(`${i + 1}. ${status}`);
      console.log(`   Type: ${event._type}`);
      console.log(`   Title: ${event.title}`);
      console.log(`   DateTime: ${event.dateTime || 'NOT SET'}`);
      console.log(`   Show on Website: ${event.showOnWebsite}`);
      console.log('');
    });

    // Count future vs past
    const futureEvents = activeEvents.filter(e => e.dateTime && new Date(e.dateTime) > now);
    const pastEvents = activeEvents.filter(e => !e.dateTime || new Date(e.dateTime) <= now);

    console.log('\n📊 Summary:');
    console.log(`   Total Active Events: ${activeEvents.length}`);
    console.log(`   Future Events: ${futureEvents.length}`);
    console.log(`   Past/No Date Events: ${pastEvents.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkEventDates();
