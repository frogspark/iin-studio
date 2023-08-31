export default {
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    {
      name: 'source',
      title: 'From',
      type: 'string',
    },
    {
      name: 'destination',
      title: 'To',
      type: 'string',
    },
    {
      name: 'permanent',
      title: 'Permanent',
      type: 'boolean',
      initialValue: () => true,
    },
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
    },
    prepare ({ source, destination }) {
      return {
        title: source
      }
    }
  }
};