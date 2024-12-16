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
                name: 'url',
                title: 'URL',
                type: 'url'
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