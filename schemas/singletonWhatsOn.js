import { FiImage } from "react-icons/fi"

export default {
  title: 'Whats On',
  name: 'whatsOn',
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
      title: 'Mobile Hero Image',
      name: 'mobileHeroImage',
      type: 'defaultImage'
    },
    {
      title: 'Intro Text',
      name: 'introText',
      type: 'contentSimple',
      validation: Rule => Rule.required()
    },
    {
      title: 'Image Blocks',
      name: 'imageBlocks',
      description: 'The array of images scattered across the page and their captions, top to bottom',
      type: 'array',
      of: [{
        type: 'object',
        icon: FiImage,
        fields: [
          {
            title: 'Image',
            name: 'image',
            type: 'defaultImage',
            validation: Rule => Rule.required()
          },
          {
            title: 'Caption Text',
            name: 'captionText',
            type: 'contentSimple',
            validation: Rule => Rule.required()
          }
        ],
        preview: {
          select: {
            title: 'captionText',
            media: 'image'
          },
          prepare ({ title, media }) {
            return {
              title: 'Image Block',
              media
            }
          }
        }
      }],
      validation: Rule => Rule.required().min(3).max(3)
    },
    {
      title: 'offer slider',
      name: 'offerslider',
      type: 'array',
      of: [
        {
          type: "object",
          name: "initiative",
          fields: [
            { type: "string", name: "title", validation: Rule => Rule.required()},
            { type: "text", name: "address"},
            { type: "defaultImage", name: "teaserImage" },
            { type: "text", name: "excerpt", rows: 4 },
   
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
      title: 'event slider',
      name: 'eventslider',
      type: 'array',
      of: [
        {
          type: "object",
          name: "initiative",
          fields: [
            { type: "string", name: "title", validation: Rule => Rule.required()},
            { type: 'date', name: 'dateValue', title: 'Date'},
            { type: "defaultImage", name: "teaserImage" },
            { type: "text", name: "excerpt", rows: 4 },
            { type: "text", name: "address"},
            { type: "number", name: "price"},
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