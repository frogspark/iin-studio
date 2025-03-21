import ExternalLinkRenderer from "../components/ExternalLiukRenderer";
import { LuMail } from "react-icons/lu";

export default {
  title: 'Content Simple',
  name: 'contentSimple',
  type: 'array',
  of: [
    {
      type: 'block',
      lists: [],
      styles: [],
      fields: [
        {
          name: "anchorId",
          title: "Anchor ID",
          type: "string",
          description: "Add a unique ID for internal linking.",
        },],
      marks: {
        decorators: [
          {title: 'Italic', value: 'em'},
          {title: 'Bold', value: 'strong'},
          {title: 'Display Font', value: 'strike-through' }
        ],
        annotations: [
          {
            name: "anchorLink",
            title: "Anchor Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
              },
            ],
          },
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
          {
            name: 'mailToLink',
            type: 'object',
            title :'Mailto Link',
            icon: LuMail,
            fields: [
              {
                name: 'email',
                type: 'email',
                title: 'Email'
              }
            ]
          }
        ]
      }
    }
  ]
}