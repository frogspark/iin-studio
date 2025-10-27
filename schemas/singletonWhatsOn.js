import { FiImage, FiCode, FiUser } from "react-icons/fi";
import { LuMail } from "react-icons/lu";
import { MdLink } from "react-icons/md";
import { FaAnchor, FaAnchorLock } from "react-icons/fa6";

export default {
  title: "Whats On",
  name: "whatsOn",
  type: "document",
  __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Mobile Hero Image",
      name: "mobileHeroImage",
      type: "defaultImage",
    },
    {
      title: "Intro Text",
      name: "introText",
      type: "contentSimple",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Image Blocks",
      name: "imageBlocks",
      description:
        "The array of images scattered across the page and their captions, top to bottom",
      type: "array",
      of: [
        {
          type: "object",
          icon: FiImage,
          fields: [
            {
              title: "Image",
              name: "image",
              type: "defaultImage",
              validation: (Rule) => Rule.required(),
            },
            {
              title: "Caption Text",
              name: "captionText",
              type: "contentSimple",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "captionText",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: "Image Block",
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(3),
    },
    {
      title: "Offer text",
      name: "offerText",
      type: "string",
    },
    {
      title: "Event text",
      name: "eventText",
      type: "string",
    },
    {
      title: 'Content',
      name: 'content',
      description: 'Flexible text/content block underneath offers & events for SEO and flexibility',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                name: "anchorLink",
                icon: FaAnchor,
                title: "Anchor Link",
                type: "object",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
              {
                name: "anchorId",
                icon: FaAnchorLock,
                title: "Anchor ID",
                type: "object",
                fields: [
                  {
                    name: "anchorId",
                    title: "Anchor ID",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                  },
                ],
                description: "Add a unique ID for internal linking.",
              },
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ]
              },
              {
                name: 'internalLink',
                icon: MdLink,
                type: 'object',
                title: 'Internal link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [
                      {type: 'home'},
                      {type: 'about'},
                      {type: 'categories'},
                      {type: 'news'},
                      {type: 'contact'},
                      {type: 'newsLanding'},
                      {type: 'policies'},
                      {type: 'whatsOn'},
                      {type: 'events'},
                      {type: 'offers'},
                    ]
                  }
                ]
              },
              {
                name: 'mailToLink',
                type: 'object',
                title: 'Mailto Link',
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
        },
        {type: 'embed', name: 'Embed', icon: FiCode },
        {type: 'blockQuote', name: 'Quote', icon: FiUser },
        {type: 'inlineImage', name: 'Image', icon: FiImage}
      ],
    },
    {
      title: "SEO / Share Settings",
      name: "seo",
      type: "seo",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
};
