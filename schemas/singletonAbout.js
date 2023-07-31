export default {
  title: 'About',
  name: 'about',
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
      title: 'Hero Images',
      name: 'heroImage',
      description: 'The array of images that are scattered across the hero, from left to right',
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
      title: 'Intro Text',
      name: 'introText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'First Section Heading',
      name: 'firstSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'First Section Text',
      name: 'firstSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'First Section Image',
      name: 'firstSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Second Section Heading',
      name: 'secondSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Second Section Text',
      name: 'secondSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Second Section Button Link',
      name: 'secondSectionButtonLink',
      type: 'reference',
      to: [{type: 'news'}]
    },
    {
      title: 'Second Section Image',
      name: 'secondSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Event Calendar Section Heading',
      name: 'eventCalendarSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Event Calender Section Text',
      name: 'eventCalenderSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Event Calender Section PDF Download',
      name: 'eventCalenderSectionPdfDownload',
      type: 'file'
    },
    {
      title: 'Event Calendar Section Image',
      name: 'eventCalendarSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Third Section Heading',
      name: 'thirdSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Third Section Text',
      name: 'thirdSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Third Section Image',
      name: 'thirdSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Crime Reduction Initiatives',
      name: 'crimeReductionInitiatives',
      type: 'array',
      of: [
        {
          type: "object",
          name: "initiative",
          fields: [
            { type: "string", name: "title", validation: Rule => Rule.required()},
            { type: "defaultImage", name: "teaserImage" },
            { type: "text", name: "excerpt", rows: 4 },
            { type: 'reference', name: 'article', to: [ {type: 'news'}]},
          ],
          preview: {
            select: {
              title: 'title',
              media: 'teaserImage',
            },
            prepare ({ title, media }) {
              return {
                title,
                media
              }
            }
          }
        }
      ],
    },
    {
      title: 'Crime Reduction Button Link',
      name: 'crimeReductionButtonLink',
      type: 'reference',
      to: [{type: 'news'}]
    },
    {
      title: 'Our People Section Heading',
      name: 'ourPeopleSectionHeading',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Our People Section Text',
      name: 'ourPeopleSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Our People Section Board Of Directors Link',
      name: 'ourPeopleSectionBoardOfDirectorsLink',
      type: 'url',
    },
    {
      title: 'Our People Section The IIN Team Link',
      name: 'ourPeopleSectionTheIinTeamLink',
      type: 'url',
    },
    {
      title: 'Our People Section Image',
      name: 'ourPeopleSectionImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Key Resources Section Text',
      name: 'keyResourcesSectionText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Key Resources Downloads',
      name: 'keyResourcesDownloads',
      type: 'array',
      of: [
        {
          type: "object",
          name: "resource",
          fields: [
            { type: "string", name: "title", validation: Rule => Rule.required()},
            { type: "file", name: "file"},
            { type: "url", name: "link"},
          ]
        }
      ],
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare ({ title }) {
      return {
        title
      }
    }
  }
}