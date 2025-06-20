import { createClient } from '@sanity/client'

const client = createClient({
 projectId: 'qjsm7swb',
  dataset: 'staging',
  token: 'skKjsNiXlYEvWeI58dRdlBl9y5w0Pt1Ofa58eQ5MpaVxMznPDPBOipzKnLjp6WJbjaBlForrIo8eltq2beoqFA6Ygpgmo9kCsaj7Yx5jJ0ynK2B6vK0rYRaHyvm4wizB2g2gHmxnUX5okDe3DJWjevF6iA7FKgHjwwwN5iZvLopcT6HVHLYv',
  
  useCdn: false,
})

async function deleteAllSyncEvents() {
  const docs = await client.fetch('*[_type == "syncEvent"]{_id}')
  const ids = docs.map(doc => doc._id)

  console.log(`Deleting ${ids.length} documents...`)
  for (const id of ids) {
    await client.delete(id)
    console.log(`Deleted ${id}`)
  }

  console.log('Done!')
}

deleteAllSyncEvents().catch(console.error)
