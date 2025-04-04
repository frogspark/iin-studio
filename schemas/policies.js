import slugify from '../utils/slugify'
import { FaAnchor } from "react-icons/fa";
import { FaAnchorLock } from "react-icons/fa6";
import ExternalLinkRenderer from "./components/ExternalLiukRenderer";
export default {
  title: "Policies",
  name: 'policies',
  type: "document",
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      title: "Content",
      name: "content",
      type: 'array', 
      of: [{type: 'block',      marks: {
        decorators: [
          {title: 'Italic', value: 'em'},
          {title: 'Bold', value: 'strong'},
          {title: 'Display Font', value: 'strike-through' }
        ],
        annotations: [
          {
            name: "anchorLink",
            icon: FaAnchor,
            title: "Anchor Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "string", // Change to string if you want anchor IDs (e.g., "#section")
                validation: (Rule) => Rule.required(),
              },
            ],
          },
          {
            name: "anchorId",
            icon: FaAnchorLock,
            title: "Anchor ID",
            type: "object",
            fields: [
              {
                name: "anchorId", // Match with serializer naming
                title: "Anchor ID",
                type: "string",
                validation: (Rule) => Rule.required(),
              },
            ],
            description: "Add a unique ID for internal linking.",
          },
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url'
              },
              {
                name: 'blank',
                title: "Open in new tab?",
                type: "boolean",
                initialValue: false
              }
            ],
            components: {
              annotation: ExternalLinkRenderer
            }
          },
        ]
      }}],
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'This is required for page routing and can be auto-generated by pressing "generate"',
      options: {
        source: (doc) => {
          let titleSlug = ''
          let campaignSlug = ''
          if (doc.title) {
            titleSlug = `${doc.title}`
          } else {
            titleSlug = ''
          }

          if (doc.campaignTitle) {
            campaignSlug = `-${doc.campaignTitle}`
          } else {
            campaignSlug = ''
          }

          return `${titleSlug}${campaignSlug}`;
        },
        maxLength: 96,
        slugify: (input) => slugify(`${input}`)
      },
      validation: Rule => Rule.required()
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
    }
  }
}