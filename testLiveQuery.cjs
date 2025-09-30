require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

async function testLiveQuery() {
  console.log('🔍 Testing LIVE data (what frontend sees)\n');
  console.log('Config:');
  console.log(`  Project: ${process.env.SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.SANITY_DATASET}`);
  console.log('');

  try {
    // Check for ALL syncEvents (including drafts)
    const allSyncEvents = await sanity.fetch(`
      *[_type == "syncEvent"] | order(_updatedAt desc) [0...20] {
        _id,
        title,
        dateTime,
        deleted,
        showOnWebsite
      }
    `);

    console.log(`📋 All syncEvents (including drafts): ${allSyncEvents.length}`);
    allSyncEvents.forEach((e, i) => {
      const isDraft = e._id.startsWith('drafts.');
      const status = isDraft ? '📝 DRAFT' : '✅ PUBLISHED';
      console.log(`  ${i + 1}. ${status} - ${e.title}`);
      console.log(`     ID: ${e._id}`);
      console.log(`     Date: ${e.dateTime ? new Date(e.dateTime).toLocaleDateString() : 'NO DATE'}`);
    });

    // Check what the frontend query actually returns
    console.log('\n\n🎯 Frontend syncEventsQuery (what should appear):');
    const frontendQuery = `
      *[_type == "syncEvent" && deleted != true && dateTime > now()] | order(dateTime asc) {
        _id,
        title,
        dateTime,
        slug {
          current
        }
      }
    `;

    const frontendEvents = await sanity.fetch(frontendQuery);
    console.log(`  Found ${frontendEvents.length} events for frontend\n`);

    if (frontendEvents.length === 0) {
      console.log('  ⚠️  NO EVENTS RETURNED!');
      console.log('  \n  Possible reasons:');
      console.log('    1. All events are still in DRAFT state (need to publish)');
      console.log('    2. All events are marked as deleted');
      console.log('    3. All events have past dates');
      console.log('    4. Events don\'t have required fields');
    } else {
      frontendEvents.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e.title}`);
        console.log(`     Date: ${new Date(e.dateTime).toLocaleDateString()}`);
        console.log(`     Slug: ${e.slug?.current || 'NO SLUG'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testLiveQuery();
