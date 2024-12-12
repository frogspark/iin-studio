export default {
  title: 'Home',
  name: 'home',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Hero Video Full',
      name: 'heroVideoFull',
      description: 'The raw Vimeo URL for the video that will play in the hero when clicked',
      type: 'url',
      validation: Rule => Rule.required()
    },
    {
      title: 'Hero Video Looper (Desktop Aspect)',
      name: 'heroVideo',
      description: 'The raw Vimeo URL for the video that will loop in the background of the hero',
      type: 'url',
      validation: Rule => Rule.required()
    },
    {
      title: 'Hero Video Looper (Mobile Aspect)',
      name: 'heroVideoMobile',
      description: 'The raw Vimeo URL for the video that will loop in the background of the hero',
      type: 'url',
      // validation: Rule => Rule.required()
    },
    {
      title: 'Hero Video Poster Image (Desktop Aspect)',
      name: 'heroVideoPosterDesktop',
      description: 'The fallback image for the video for slower network connections, ideally use the first frame of the video',
      type: 'defaultImage',
    },
    {
      title: 'Hero Video Poster Image (Mobile Aspect)',
      name: 'heroVideoPosterMobile',
      description: 'The fallback image for the video for slower network connections, ideally use the first frame of the video',
      type: 'defaultImage',
    },
    {
      title: 'Intro Content Heading',
      name: 'introContentHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Intro Content Text',
      name: 'introContentText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Intro Content Images',
      name: 'introContentImages',
      description: 'The array of images that are scattered across the section, from left to right',
      type: 'array',
      of: [
        {
          name: 'image',
          type: 'defaultImage',
          title: 'Image',
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: Rule => Rule.required().min(3).max(3)
    },
    {
      title: 'Text Ticker 1 Words',
      name: 'textTicker1Words',
      description: 'The array of words that are within the ticker text, ideally capped to 3 or 4 as it will automatically duplicate',
      type: 'array',
      of: [
        {
          name: 'text',
          type: 'string',
        },
      ],
      validation: Rule => Rule.required().min(2).max(5)
    },
    {
      title: 'Text Ticker 2 Words',
      name: 'textTicker2Words',
      description: 'The array of words that are within the second line of the ticker text, ideally capped to 3 or 4 as it will automatically duplicate',
      type: 'array',
      of: [
        {
          name: 'text',
          type: 'string',
        },
      ],
      validation: Rule => Rule.required().min(2).max(5)
    },
    {
      title: 'Whats On Section Heading',
      name: 'whatsOnSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Whats On Section Text',
      name: 'whatsOnSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Whats On Section Image',
      name: 'whatsOnSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Latest News Posts',
      name: 'latestNewsPosts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type : 'news' }]
        }
      ],
      validation: Rule => Rule.max(6)
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare ({ title }) {
      return {
        title
      }
    }
  }
}