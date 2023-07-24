export default {
  title: 'Inline Image',
  name: 'inlineImage',
  type: 'object',
  fields: [
    {
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
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