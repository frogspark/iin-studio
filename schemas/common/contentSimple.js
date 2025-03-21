import ExternalLinkRenderer from "../components/ExternalLiukRenderer";

export default {
  title: 'Content Simple',
  name: 'contentSimple',
  type: 'array',
  of: [
    {
      type: 'block',
      lists: [],
      styles: [],
      marks: {
        decorators: [
          {title: 'Italic', value: 'em'},
          {title: 'Bold', value: 'strong'},
          {title: 'Display Font', value: 'strike-through' }
        ],
        annotations: [
          {
            name: "anchorLink",
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
    }
  ]
}