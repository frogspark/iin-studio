require('dotenv').config();
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-01',
});

async function addImagesToTestEvents() {
  console.log('🖼️  Adding images to test events\n');

  try {
    // Get all test events (drafts)
    const testEvents = await sanity.fetch(`
      *[_type == "syncEvent" && externalId match "test-*"] {
        _id,
        title,
        featuredImage
      }
    `);

    console.log(`Found ${testEvents.length} test events\n`);

    // Use placeholder image URLs (you can replace these with real images later)
    const placeholderImages = {
      'Nottingham Food Festival': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'Christmas Market Opening': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=600&fit=crop',
      'Live Music in the Square': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
      'Weekly Jazz Night': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop'
    };

    for (const event of testEvents) {
      const imageUrl = placeholderImages[event.title] || placeholderImages['Weekly Jazz Night'];

      if (!event.featuredImage) {
        await sanity.patch(event._id)
          .set({ featuredImage: imageUrl })
          .commit();

        console.log(`✅ Added image to: ${event.title}`);
      } else {
        console.log(`⏭️  Skipped (already has image): ${event.title}`);
      }
    }

    console.log('\n✨ Images added successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addImagesToTestEvents();
