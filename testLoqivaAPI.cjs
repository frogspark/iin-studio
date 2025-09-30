const axios = require('axios');

const API_URL = 'https://nottingham.loqiva.com/public/api/events/json/token/s30SpWuNpXkz3yqo7i6IDWe0wUXdYqyTTnYAFSqn8SQxoqtcvdu6rAhW9gp7La6b';

async function testLoqivaAPI() {
  console.log('🌐 Testing Loqiva API\n');
  console.log(`URL: ${API_URL}\n`);

  try {
    console.log('Making request...');
    const { data, status } = await axios.get(API_URL);

    console.log(`✅ Status: ${status}\n`);

    if (data.data && Array.isArray(data.data)) {
      console.log(`📊 Events found: ${data.data.length}\n`);

      if (data.data.length === 0) {
        console.log('⚠️  API returned 0 events');
        console.log('   This could mean:');
        console.log('   - No events are currently scheduled in Loqiva');
        console.log('   - Events are not published/active');
        console.log('   - The API feed is empty\n');
      } else {
        console.log('Sample events:');
        data.data.slice(0, 5).forEach((event, i) => {
          console.log(`\n${i + 1}. ${event.name || 'Untitled'}`);
          console.log(`   ID: ${event.id}`);
          console.log(`   Start: ${event.start || 'No date'}`);
          console.log(`   End: ${event.end || 'No date'}`);
          console.log(`   Recurring: ${event.is_recurring || event.recurrence ? 'Yes' : 'No'}`);
          if (event.instances && Array.isArray(event.instances)) {
            console.log(`   Instances: ${event.instances.length}`);
          }
        });

        // Count future events
        const now = new Date();
        const futureEvents = data.data.filter(e => {
          if (!e.start) return false;
          return new Date(e.start) > now;
        });
        console.log(`\n\n📅 Future events: ${futureEvents.length} of ${data.data.length}`);
      }
    } else {
      console.log('⚠️  Unexpected response format');
      console.log('Response:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error fetching from Loqiva API:');
    console.error(`   Message: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
  }
}

testLoqivaAPI();
