// All Slugs go here...
const globalSlugs = {
  home: '/',
  news: '/news',
  whatsOn: '/whats-on',
  about: '/about',
  contact: '/contact'
}

const secret = process.env.SANITY_STUDIO_SANITY_PREVIEW_SECRET
export const getGlobalSlug = (slug) => globalSlugs[slug]

// Change remote url...
const remoteURL = 'https://www.itsinnottingham.com/'
const localURL = 'http://localhost:3000'
export const previewURL = window.location.hostname === 'localhost' ? localURL : remoteURL

export const createUrl = ({ slug, globalSlug }) => {
  if (!globalSlug || !previewURL) {
    console.warn('Missing slug or previewURL', { globalSlug, previewURL })
    return ''
  }
  let path = `${globalSlug}`
  if (slug) path += `/${slug.current}`
  return `${previewURL}/api/preview?secret=skDppZHbaNOnOuUuohT2emGuj4Eodhdv4tUnbMGSwUqE0aHQ1OepqE8hJkzyx1I2EswZqJ1EMMUNdFa3CiDCxfJu3ZxLS9Ipv4FXJ6ShQGzaepEUWXm9ne5FCQFeMrwTT9DwFqi4fCVLBbOBKEjy5o5lrd49hcnBU42HfIIpD7yR0QUznDtC&slug=${path}`
}

export default function resolveProductionUrl (document) {
  const url = createUrl({ globalSlug: getGlobalSlug(document._type), slug: document.slug })
  return url
}
