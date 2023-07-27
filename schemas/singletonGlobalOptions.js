export default {
  title: 'Global',
  name: 'global',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'App Live?',
      name: 'appLive',
      type: 'boolean',
      description: '*Temporary field for launch, toggle this on when the app is live on the app store'
    },
    {
      title: 'iOS App Download Link',
      name: 'iOsAppDownloadLink',
      type: 'url'
    },
    {
      title: 'Android App Download Link',
      name: 'androidAppDownloadLink',
      type: 'url'
    },
    {
      title: 'Menu Colour Theme',
      name: 'menuColourTheme',
      type: 'string',
      options: {
        list: [ 
          { title: 'Default', value: 'default' },
          { title: 'Blue + Green', value: 'blueGreen' }
        ]
      }
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Options',
      }
    }
  }
}