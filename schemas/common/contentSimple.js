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