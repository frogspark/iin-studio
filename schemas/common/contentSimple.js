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
        annotations: []
      }
    }
  ]
}