require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

async function testEventQueries() {
  console.log('🧪 Testing Event Queries with Deletion Support\n');

  try {
    // Test 1: Get all active events
    console.log('1️⃣ Testing: Get all active events');
    const activeEvents = await sanity.fetch(`
      *[
        (_type == "syncEvent" || _type == "events") &&
        deleted != true
      ] | order(dateTime asc) {
        _id,
        title,
        deleted,
        recurringEventId,
        eventInstanceId,
        dateTime
      }
    `);
    console.log(`   ✅ Found ${activeEvents.length} active events`);

    // Test 2: Get all events (including deleted)
    console.log('\n2️⃣ Testing: Get all events (including deleted)');
    const allEvents = await sanity.fetch(`
      *[_type == "syncEvent" || _type == "events"] | order(dateTime asc) {
        _id,
        title,
        deleted,
        recurringEventId,
        eventInstanceId,
        dateTime
      }
    `);
    console.log(`   ✅ Found ${allEvents.length} total events`);
    const deletedEvents = allEvents.filter(e => e.deleted);
    console.log(`   📝 ${deletedEvents.length} events are marked as deleted`);

    // Test 3: Test recurring event grouping
    console.log('\n3️⃣ Testing: Recurring event grouping');
    const recurringEvents = await sanity.fetch(`
      *[
        (_type == "syncEvent" || _type == "events") &&
        deleted != true &&
        defined(recurringEventId)
      ] {
        _id,
        title,
        recurringEventId,
        eventInstanceId,
        dateTime
      }
    `);
    console.log(`   ✅ Found ${recurringEvents.length} recurring event instances`);

    // Group by series
    const groupedBySeries = recurringEvents.reduce((acc, event) => {
      if (!acc[event.recurringEventId]) {
        acc[event.recurringEventId] = [];
      }
      acc[event.recurringEventId].push(event);
      return acc;
    }, {});

    console.log(`   📝 Found ${Object.keys(groupedBySeries).length} recurring series:`);
    Object.entries(groupedBySeries).forEach(([seriesId, events]) => {
      console.log(`      - Series ${seriesId}: ${events.length} instances`);
    });

    // Test 4: Homepage events query
    console.log('\n4️⃣ Testing: Homepage events query');
    const homepageEvents = await sanity.fetch(`
      *[
        (_type == "syncEvent" || _type == "events") &&
        deleted != true &&
        showOnWebsite == true &&
        dateTime > now()
      ] | order(dateTime asc) [0...6] {
        _id,
        title,
        dateTime,
        showOnWebsite
      }
    `);
    console.log(`   ✅ Found ${homepageEvents.length} events for homepage`);

    // Test 5: Check for any data integrity issues
    console.log('\n5️⃣ Testing: Data integrity checks');

    // Check for events without external IDs
    const eventsWithoutExternalId = await sanity.fetch(`
      *[
        _type == "syncEvent" &&
        !defined(externalId)
      ] {
        _id,
        title
      }
    `);
    console.log(`   📝 Events without external ID: ${eventsWithoutExternalId.length}`);

    // Check for orphaned recurring instances
    const orphanedInstances = await sanity.fetch(`
      *[
        (_type == "syncEvent" || _type == "events") &&
        defined(recurringEventId) &&
        !defined(eventInstanceId)
      ] {
        _id,
        title,
        recurringEventId
      }
    `);
    console.log(`   📝 Orphaned recurring instances: ${orphanedInstances.length}`);

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Total Events: ${allEvents.length}`);
    console.log(`   Active Events: ${activeEvents.length}`);
    console.log(`   Deleted Events: ${deletedEvents.length}`);
    console.log(`   Recurring Instances: ${recurringEvents.length}`);
    console.log(`   Homepage Events: ${homepageEvents.length}`);
    console.log('   ✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

async function createTestEvent() {
  console.log('🧪 Creating test event for validation...\n');

  try {
    const testEvent = {
      _id: 'drafts.test-event-' + Date.now(),
      _type: 'syncEvent',
      title: 'Test Event - ' + new Date().toISOString(),
      externalId: 'test-' + Date.now(),
      deleted: false,
      showOnWebsite: true,
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      address: 'Test Address',
      slug: {
        current: 'test-event-' + Date.now(),
        _type: 'slug'
      }
    };

    await sanity.create(testEvent);
    console.log(`✅ Created test event: ${testEvent._id}`);
    return testEvent._id;

  } catch (error) {
    console.error('❌ Error creating test event:', error);
    return null;
  }
}

async function markTestEventAsDeleted(eventId) {
  console.log('🧪 Testing deletion marking...\n');

  try {
    await sanity.patch(eventId).set({ deleted: true }).commit();
    console.log(`✅ Marked test event as deleted: ${eventId}`);
    return true;
  } catch (error) {
    console.error('❌ Error marking test event as deleted:', error);
    return false;
  }
}

async function cleanupTestEvent(eventId) {
  try {
    await sanity.delete(eventId);
    console.log(`🧹 Cleaned up test event: ${eventId}`);
  } catch (error) {
    console.error('❌ Error cleaning up test event:', error);
  }
}

async function runFullTest() {
  console.log('🚀 Starting full event system test...\n');

  // Run basic query tests
  await testEventQueries();

  console.log('\n' + '='.repeat(50));

  // Test event creation and deletion
  const testEventId = await createTestEvent();

  if (testEventId) {
    // Wait a moment for the event to be indexed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test deletion marking
    await markTestEventAsDeleted(testEventId);

    // Wait a moment for the update to be indexed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Run queries again to verify deletion filtering
    console.log('\n🔍 Re-running queries after test deletion...');
    await testEventQueries();

    // Cleanup
    await cleanupTestEvent(testEventId);
  }

  console.log('\n🎉 Full test suite completed!');
}

// Export for use in other scripts
module.exports = {
  testEventQueries,
  createTestEvent,
  markTestEventAsDeleted,
  cleanupTestEvent,
  runFullTest
};

// Run if called directly
if (require.main === module) {
  runFullTest();
}