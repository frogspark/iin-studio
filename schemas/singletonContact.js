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
      of: [{type: 'block'}]
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