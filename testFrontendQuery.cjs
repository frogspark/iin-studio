require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

async function testFrontendQueries() {
  console.log('🧪 Testing Frontend Event Queries\n');

  try {
    // Test the exact query used in frontend
    console.log('1️⃣ Testing syncEventsQuery (should return future events only):\n');

    const syncEventsQuery = `
      *[_type == "syncEvent" && deleted != true && dateTime > now()] | order(dateTime asc){
        _id,
        title,
        dateTime,
        address,
        showOnWebsite,
        slug {
          current
        }
      }
    `;

    const syncEvents = await sanity.fetch(syncEventsQuery);
    console.log(`   Found ${syncEvents.length} syncEvents`);
    syncEvents.forEach((e, i) => {
      console.log(`   ${i + 1}. ${e.title} - ${new Date(e.dateTime).toLocaleDateString()}`);
    });

    console.log('\n2️⃣ Testing eventsQuery (should return future events only):\n');

    const eventsQuery = `
      *[_type == "events" && showOnWebsite == true && deleted != true && dateTime > now()] | order(dateTime asc){
        _id,
        title,
        dateTime,
        address,
        showOnWebsite,
        slug {
          current
        }
      }
    `;

    const events = await sanity.fetch(eventsQuery);
    console.log(`   Found ${events.length} events`);
    events.forEach((e, i) => {
      console.log(`   ${i + 1}. ${e.title} - ${new Date(e.dateTime).toLocaleDateString()}`);
    });

    console.log('\n📊 Summary:');
    console.log(`   syncEvents: ${syncEvents.length}`);
    console.log(`   events: ${events.length}`);
    console.log(`   Total for frontend: ${syncEvents.length + events.length}`);

    if (syncEvents.length === 0 && events.length === 0) {
      console.log('\n⚠️  WARNING: No future events found!');
      console.log('   The frontend will show an empty events page.');
      console.log('   Run "node createTestEvents.cjs" to create test events.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFrontendQueries();
