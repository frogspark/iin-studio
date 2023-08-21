export default {
  title: "Image",
  type: 'image',
  options: {
    hotspot: true,
    metadata: ["lqip"],
  },
  name: "defaultImage",
  fields: [
    {
      title: 'Alternative Text (Optional)',
      description: 'Used by screen readers to describe the image',
      name: 'alt',
      type: 'string'
    },
    {
      title: 'Caption (Optional)',
      description: 'Optional supporting caption',
      name: 'caption',
      type: 'string'
    },
    {
      title: 'Vimeo Video (Optional)',
      description: 'Optionally add a vimeo URL to override this image',
      name: 'vimeoVideo',
      type: 'url'
    },
  ]
}