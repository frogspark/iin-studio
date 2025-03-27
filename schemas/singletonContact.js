import { FiSmile } from "react-icons/fi"

export default {
  title: 'Contact',
  name: 'contact',
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
      title: 'Email Address',
      name: 'emailAddress',
      type: 'string'
    },
    {
      title: 'Form Intro Text',
      name: 'formIntroText',
      type: 'array', 
      of: [{type: 'block',
        marks: {
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
        }
      }]
    },
    {
      title: 'Socials',
      name: 'socials',
      type: 'array',
      of: [{
        type: 'object',
        icon: FiSmile,
        fields: [
          {
            title: 'Name',
            name: 'name',
            type: 'string',
            description: 'eg: "Facebook" or "Twitter"',
            validation: Rule => Rule.required()
          },
          {
            title: 'URL',
            name: 'url',
            type: 'url',
            validation: Rule => Rule.required()
          }
        ],
      }],
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