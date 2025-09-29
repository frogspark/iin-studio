# Frontend Query Examples for Events with Deletion Support

## Overview
This document provides query examples for the IIN website to properly handle deleted events and recurring event series.

## Basic Event Queries

### 1. Get All Active Events
```groq
// Basic query excluding deleted events
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true
] | order(dateTime asc) {
  _id,
  _type,
  title,
  slug,
  dateTime,
  address,
  deleted,
  showOnWebsite,
  recurringEventId,
  eventInstanceId,
  externalId
}
```

### 2. Get Events for Homepage/Carousel
```groq
// Events for homepage carousel - active and visible
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true &&
  showOnWebsite == true &&
  dateTime > now()
] | order(dateTime asc) [0...6] {
  _id,
  title,
  slug,
  dateTime,
  address,
  mobileHeroImage,
  featuredImage,
  introText,
  buttonText,
  ticketUrl
}
```

### 3. Get Single Event by Slug
```groq
// Event detail page - ensure not deleted
*[
  (_type == "syncEvent" || _type == "events") &&
  slug.current == $slug &&
  deleted != true
][0] {
  _id,
  _type,
  title,
  slug,
  dateTime,
  address,
  age,
  introText,
  content,
  mobileHeroImage,
  featuredImage,
  buttonText,
  ticketUrl,
  deleted,
  recurringEventId,
  eventInstanceId,
  externalId,
  seo
}
```

## Recurring Event Queries

### 4. Get Recurring Event Series
```groq
// Get all instances of a recurring event series
*[
  (_type == "syncEvent" || _type == "events") &&
  recurringEventId == $seriesId &&
  deleted != true
] | order(dateTime asc) {
  _id,
  title,
  slug,
  dateTime,
  address,
  recurringEventId,
  eventInstanceId,
  deleted
}
```

### 5. Get Events Grouped by Series
```groq
// Get all events with series information
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true
] {
  _id,
  title,
  slug,
  dateTime,
  address,
  recurringEventId,
  eventInstanceId,
  "isRecurring": defined(recurringEventId),
  "seriesCount": count(*[
    (_type == "syncEvent" || _type == "events") &&
    recurringEventId == ^.recurringEventId &&
    deleted != true
  ])
} | order(dateTime asc)
```

### 6. Get Next Instance of Recurring Series
```groq
// Get the next upcoming instance of each recurring series
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true &&
  defined(recurringEventId) &&
  dateTime > now()
] {
  _id,
  title,
  slug,
  dateTime,
  recurringEventId,
  "isNextInSeries": dateTime == min(*[
    (_type == "syncEvent" || _type == "events") &&
    recurringEventId == ^.recurringEventId &&
    deleted != true &&
    dateTime > now()
  ].dateTime)
} [isNextInSeries == true]
```

## Advanced Filtering Examples

### 7. Events by Date Range
```groq
// Get events in a specific date range
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true &&
  dateTime >= $startDate &&
  dateTime <= $endDate
] | order(dateTime asc) {
  _id,
  title,
  slug,
  dateTime,
  address,
  recurringEventId
}
```

### 8. Search Events
```groq
// Search events by title or content
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true &&
  (
    title match $searchTerm + "*" ||
    pt::text(content) match $searchTerm + "*" ||
    pt::text(introText) match $searchTerm + "*"
  )
] | order(dateTime asc) {
  _id,
  title,
  slug,
  dateTime,
  address,
  introText
}
```

## JavaScript/React Examples

### Event List Component
```javascript
// React component with proper filtering
import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = `
          *[
            (_type == "syncEvent" || _type == "events") &&
            deleted != true &&
            showOnWebsite == true &&
            dateTime > now()
          ] | order(dateTime asc) {
            _id,
            title,
            slug,
            dateTime,
            address,
            mobileHeroImage,
            recurringEventId,
            eventInstanceId
          }
        `;

        const fetchedEvents = await client.fetch(query);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="events-list">
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};
```

### Recurring Event Grouping
```javascript
// Utility function to group recurring events
const groupRecurringEvents = (events) => {
  const grouped = events.reduce((acc, event) => {
    if (event.recurringEventId) {
      // Group by recurring series
      if (!acc.recurring[event.recurringEventId]) {
        acc.recurring[event.recurringEventId] = [];
      }
      acc.recurring[event.recurringEventId].push(event);
    } else {
      // Single events
      acc.single.push(event);
    }
    return acc;
  }, { single: [], recurring: {} });

  return grouped;
};

// Usage in component
const EventsPage = () => {
  const [events, setEvents] = useState([]);

  const groupedEvents = groupRecurringEvents(events);

  return (
    <div>
      {/* Single events */}
      {groupedEvents.single.map(event => (
        <EventCard key={event._id} event={event} />
      ))}

      {/* Recurring event series */}
      {Object.entries(groupedEvents.recurring).map(([seriesId, seriesEvents]) => (
        <RecurringEventSeries
          key={seriesId}
          seriesId={seriesId}
          events={seriesEvents}
        />
      ))}
    </div>
  );
};
```

### Event Detail Page (Next.js)
```javascript
// pages/events/[slug].js
export async function getStaticProps({ params }) {
  const query = `
    *[
      (_type == "syncEvent" || _type == "events") &&
      slug.current == $slug &&
      deleted != true
    ][0] {
      _id,
      _type,
      title,
      slug,
      dateTime,
      address,
      content,
      mobileHeroImage,
      recurringEventId,
      eventInstanceId,
      seo
    }
  `;

  const event = await client.fetch(query, { slug: params.slug });

  // If event is deleted or doesn't exist, return 404
  if (!event || event.deleted) {
    return { notFound: true };
  }

  // If this is part of a recurring series, get other instances
  let seriesEvents = [];
  if (event.recurringEventId) {
    const seriesQuery = `
      *[
        (_type == "syncEvent" || _type == "events") &&
        recurringEventId == $seriesId &&
        deleted != true &&
        _id != $currentId
      ] | order(dateTime asc) {
        _id,
        title,
        slug,
        dateTime,
        address
      }
    `;

    seriesEvents = await client.fetch(seriesQuery, {
      seriesId: event.recurringEventId,
      currentId: event._id
    });
  }

  return {
    props: {
      event,
      seriesEvents,
    },
    revalidate: 60, // Revalidate every minute
  };
}
```

## GROQ Query Parameters

### Common Parameters for Dynamic Queries
```javascript
// Date filtering
const params = {
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  searchTerm: 'music',
  slug: 'my-event-slug',
  seriesId: 'recurring-event-123'
};

// Use with queries
const events = await client.fetch(query, params);
```

## Migration Checklist for Existing Queries

### Before Deployment
- [ ] Audit all existing event queries in the codebase
- [ ] Add `deleted != true` filter to all event queries
- [ ] Test queries with sample deleted events
- [ ] Update event detail pages to handle deleted events (404)
- [ ] Test recurring event grouping functionality
- [ ] Verify homepage/carousel only shows active events
- [ ] Test search functionality with deleted events
- [ ] Update any cached queries or ISR configurations

### Query Update Pattern
```javascript
// OLD - Before deletion support
*[_type == "syncEvent" || _type == "events"]

// NEW - With deletion support
*[(_type == "syncEvent" || _type == "events") && deleted != true]
```

## Performance Considerations

1. **Indexing**: Consider adding indexes for frequently queried fields:
   - `deleted`
   - `recurringEventId`
   - `dateTime`
   - `showOnWebsite`

2. **Caching**: Update cache keys to include deletion status
3. **ISR/SSG**: Adjust revalidation times for dynamic content
4. **API Limits**: Consider pagination for large event lists

## Testing Scenarios

1. **Create test event** → Verify appears on site
2. **Mark event as deleted** → Verify disappears from site
3. **Create recurring series** → Verify all instances appear
4. **Delete single instance** → Verify only that instance disappears
5. **Delete entire series** → Verify all instances disappear
6. **Restore deleted event** → Verify reappears on site