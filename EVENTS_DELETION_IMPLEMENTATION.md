# Events Deletion & Recurring Events Implementation Guide

## Overview
This document outlines the implementation for handling event deletions from Loqiva API and managing recurring events in the CMS.

## Changes Made

### 1. Schema Updates

#### syncEvent.js
Added three new fields:
- `deleted` (boolean): Marks events as deleted from Loqiva
- `recurringEventId` (string): Links events in a recurring series
- `eventInstanceId` (string): Unique ID for specific instances

#### singletonEvents.js
Added:
- `deleted` (boolean): Manual deletion flag

### 2. Frontend Query Updates Required

#### Current Queries Need Filtering
Update all event queries on the IIN website to exclude deleted events:

```groq
// Before
*[_type == "syncEvent" || _type == "events"]

// After
*[(_type == "syncEvent" || _type == "events") && deleted != true]
```

#### Recurring Event Handling
For recurring events, ensure queries handle both:
1. Individual deleted instances within a series
2. Entire series deletions

```groq
// Get all non-deleted events including recurring series
*[
  (_type == "syncEvent" || _type == "events") &&
  deleted != true
] {
  ...,
  "isRecurring": defined(recurringEventId),
  "seriesId": recurringEventId
}
```

### 3. Enhanced Sync Script Requirements

#### Current syncEvents.cjs Updates Needed:

1. **Track Existing Events**: Before syncing, fetch all current events from Sanity
2. **Mark Deletions**: Events that exist in Sanity but not in API should be marked as deleted
3. **Handle Recurring Events**: Parse recurring event data from Loqiva API
4. **Instance Management**: Create separate documents for each recurring instance

#### Proposed syncEvents.cjs Enhancement:

```javascript
// Fetch current events from Sanity
const existingEvents = await sanity.fetch('*[_type == "syncEvent"]{externalId, _id}');
const existingIds = new Set(existingEvents.map(e => e.externalId));

// Track API event IDs
const apiEventIds = new Set();

// Process API events
for (const event of apiEvents) {
  apiEventIds.add(event.id.toString());

  // Handle recurring events
  if (event.is_recurring) {
    await handleRecurringEvent(event);
  } else {
    await handleSingleEvent(event);
  }
}

// Mark deleted events
const deletedIds = [...existingIds].filter(id => !apiEventIds.has(id));
for (const externalId of deletedIds) {
  await markEventAsDeleted(externalId);
}
```

### 4. Recurring Event Strategy

#### Data Structure
- **Series Parent**: Main event with `recurringEventId` = `externalId`
- **Individual Instances**: Separate docs with unique `eventInstanceId`
- **Deletion Handling**: Individual instances can be deleted without affecting the series

#### Implementation Options:

**Option A: Individual Documents** (Recommended)
- Each recurring instance = separate Sanity document
- Allows granular deletion of specific dates
- Easier to query and manage

**Option B: Array Field**
- Store all instances in a single document array
- More complex deletion logic
- Harder to filter individual instances

### 5. Frontend Implementation Examples

#### Event Listing Component
```javascript
// Filter out deleted events
const events = allEvents.filter(event => !event.deleted);

// Group recurring events if needed
const groupedEvents = events.reduce((acc, event) => {
  if (event.recurringEventId) {
    if (!acc.recurring[event.recurringEventId]) {
      acc.recurring[event.recurringEventId] = [];
    }
    acc.recurring[event.recurringEventId].push(event);
  } else {
    acc.single.push(event);
  }
  return acc;
}, { single: [], recurring: {} });
```

#### Event Detail Page
```javascript
// Ensure event isn't deleted
if (event.deleted) {
  return { notFound: true };
}

// For recurring events, show series information
if (event.recurringEventId) {
  const seriesEvents = await getRecurringEventSeries(event.recurringEventId);
  const activeEvents = seriesEvents.filter(e => !e.deleted);
}
```

## Migration Strategy

### Phase 1: Schema Updates ✅
- Add new fields to schemas
- Deploy to Sanity Studio

### Phase 2: Sync Script Enhancement
- Update syncEvents.cjs with deletion tracking
- Add recurring event parsing
- Test with staging data

### Phase 3: Frontend Updates
- Update all event queries to filter deleted events
- Add recurring event handling
- Test thoroughly

### Phase 4: Production Deployment
- Deploy enhanced sync script
- Monitor for issues
- Validate deletion behavior

## Testing Checklist

- [ ] Create test events in Loqiva
- [ ] Verify sync creates correct Sanity documents
- [ ] Delete event in Loqiva, confirm marked as deleted in Sanity
- [ ] Test recurring event creation and instance deletion
- [ ] Verify frontend properly filters deleted events
- [ ] Test edge cases (all instances deleted, partial deletions)

## Benefits

1. **Accurate Content**: Deleted events automatically removed from website
2. **Granular Control**: Individual recurring instances can be managed
3. **Data Integrity**: No actual data loss (soft delete approach)
4. **Flexibility**: Manual events can also use deletion flags
5. **Performance**: Efficient querying with proper indexing

## Next Steps

1. Update syncEvents.cjs with enhanced logic
2. Update frontend queries across the IIN website
3. Test thoroughly in staging environment
4. Deploy to production with monitoring