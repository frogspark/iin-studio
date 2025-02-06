import { FiImage } from "react-icons/fi"

export default {
  title: 'Offers',
  name: 'offers',
  type: 'document',
  __experimental_actions: ['update', 'create', 'delete', 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: "Order Rank",
      name: "orderRank",
      type: "string",
      hidden: true,
    },
    {
      title: 'Mobile Hero Image',
      name: 'mobileHeroImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Hero Image',
      name: 'heroImage',
      type: 'defaultImage',
      validation: Rule => Rule.required()
    },
    {
      title: 'Address',
      name: 'address',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Date & Time',
      name: 'dateTime',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today'
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'Intro Text',
      name: 'introText',
      type: 'contentSimple',

    },
    {
      title: 'Price',
      name: 'price',
      type: 'number',
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