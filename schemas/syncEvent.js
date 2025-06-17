export default {
    name: 'syncEvent',
    title: 'Synced Event',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'start',
        title: 'Start Time',
        type: 'datetime',
      },
      {
        name: 'end',
        title: 'End Time',
        type: 'datetime',
      },
      {
        name: 'location',
        title: 'Location',
        type: 'string',
      },
      {
        name: 'externalId',
        title: 'External ID',
        type: 'string',
      },
    ],
  }
  