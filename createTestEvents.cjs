require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

async function createTestEvents() {
  console.log('🎪 Creating Test Events\n');

  const now = new Date();

  const testEvents = [
    {
      title: 'Nottingham Food Festival',
      dateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      address: 'Old Market Square, Nottingham',
      introText: 'A celebration of Nottingham\'s diverse food scene',
    },
    {
      title: 'Christmas Market Opening',
      dateTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      address: 'Old Market Square, Nottingham',
      introText: 'The festive season kicks off with our annual Christmas market',
    },
    {
      title: 'Live Music in the Square',
      dateTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      address: 'Old Market Square, Nottingham',
      introText: 'Local bands performing throughout the day',
    },
  ];

  console.log('Creating single events:\n');

  for (const event of testEvents) {
    try {
      const externalId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const doc = {
        _id: `drafts.syncEvent-${externalId}`,
        _type: 'syncEvent',
        externalId,
        title: event.title,
        dateTime: event.dateTime,
        address: event.address,
        introText: event.introText,
        deleted: false,
        showOnWebsite: true,
        ticketUrl: 'https://www.itsinnottingham.com',
        buttonText: 'View in app',
        slug: {
          current: generateSlug(event.title),
          _type: 'slug'
        }
      };

      await sanity.create(doc);
      console.log(`✅ Created: ${event.title}`);
      console.log(`   Date: ${new Date(event.dateTime).toLocaleDateString()}`);
    } catch (error) {
      console.error(`❌ Error creating ${event.title}:`, error.message);
    }
  }

  console.log('\n🔄 Creating recurring event series:\n');

  // Create a recurring event with 5 instances (weekly)
  const recurringEventId = `test-recurring-${Date.now()}`;
  const recurringEventTitle = 'Weekly Jazz Night';

  for (let i = 0; i < 5; i++) {
    try {
      const instanceDate = new Date(now.getTime() + (7 + i * 7) * 24 * 60 * 60 * 1000); // Weekly starting in 7 days
      const externalId = `${recurringEventId}-instance-${i}`;

      const doc = {
        _id: `drafts.syncEvent-${externalId}`,
        _type: 'syncEvent',
        externalId,
        recurringEventId,
        eventInstanceId: externalId,
        title: recurringEventTitle,
        dateTime: instanceDate.toISOString(),
        address: 'Jam Café, Nottingham',
        introText: 'Join us for smooth jazz every Friday night',
        deleted: false,
        showOnWebsite: true,
        ticketUrl: 'https://www.itsinnottingham.com',
        buttonText: 'Book tickets',
        slug: {
          current: generateSlug(`${recurringEventTitle}-${instanceDate.toISOString().split('T')[0]}`),
          _type: 'slug'
        }
      };

      await sanity.create(doc);
      console.log(`✅ Created instance ${i + 1}/5: ${recurringEventTitle}`);
      console.log(`   Date: ${instanceDate.toLocaleDateString()}`);
      console.log(`   Series ID: ${recurringEventId}`);
    } catch (error) {
      console.error(`❌ Error creating instance ${i + 1}:`, error.message);
    }
  }

  console.log('\n✨ Test events created successfully!');
  console.log('\n📝 Summary:');
  console.log('   - 3 single future events');
  console.log('   - 1 recurring series with 5 weekly instances');
  console.log('   - All events have future dates');
  console.log('\n💡 These events will automatically disappear as their dates pass!');
}

createTestEvents();
