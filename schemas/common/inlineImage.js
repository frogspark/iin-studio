export default {
  title: 'Inline Image',
  name: 'inlineImage',
  type: 'object',
  fields: [
    {
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
    },
    {
      title: "Layout",
      description: "Pick the layout of this image",
      name: "wrapText",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Wrap Left", value: "wrapleft" },
          { title: "Wrap Right", value: "wrapright" },
        ],
      }
    },
    {
      type: "object",
      name: "customLink",
      fields: [
        {
          title: 'Link?',
          name: 'linkToggle',
          description: 'Toggle this on if you want to link this image somewhere',
          type: 'boolean',
          validation: Rule => Rule.required()
        },
        {
          title: 'Internal Link?',
          name: 'internal',
          description: 'Toggle this on if you want to link internally within the website, rather than link to an external source',
          type: 'boolean',
          hidden: ({ parent, value }) => !value && (parent?.linkToggle == false),
        },
        {
          name: 'internalLink',
          type: 'reference',
          hidden: ({ parent, value }) => !value && (parent?.internal == false),
          title: 'Internal Link',
          to: [
            {type: 'news'},
            {type: 'about'},
            {type: 'contact'},
            {type: 'newsLanding'},
            {type: 'home'},
            {type: 'whatsOn'}
          ]
        },
        {
          title: 'External Link',
          hidden: ({ parent, value }) => !value && (parent?.internal == true),
          name: 'externalLink',
          type: 'url',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https', 'mailto', 'tel']
          })
        }
      ]
    }
  ],
  preview: {
    select: {
      image: 'image',
      caption: 'image',
    },
    prepare ({ title, image }) {
      return {
        title: 'Inline Image',
        subtitle: image.caption,
        media: image
      }
    }
  }
}