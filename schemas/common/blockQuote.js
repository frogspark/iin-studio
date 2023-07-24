export default {
  title: 'Blockquote',
  name: 'blockQuote',
  type: 'object',
  fields: [
    {
      title: 'Author',
      name: 'author',
      type: 'string',
      description: 'The name of the person(s) who said this quote'
    },
    {
      title: 'Quote',
      name: 'quote',
      type: 'contentSimple',
    }
  ]
}