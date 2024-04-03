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