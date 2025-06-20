import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Singletons
import singletonHome from './singletonHome'
import singletonAbout from './singletonAbout'
import singletonWhatsOn from './singletonWhatsOn'
import singletonEvents from './singletonEvents'
import singletonOffers from './singletonOffers'
import singletonContact from './singletonContact'
import singletonGlobalOptions from './singletonGlobalOptions'

// Documents
import news from './news'

// Common
import seo from './common/seo'
import contentSimple from './common/contentSimple'
import inlineImage from './common/inlineImage'
import embed from './common/embed'
import blockQuote from './common/blockQuote'
import defaultImage from './common/defaultImage'
import policies from './policies'
import categories from './categories'
import singletonNewsLanding from './singletonNewsLanding'
import redirects from './redirects'
import syncEvent from './syncEvent'
export default createSchema({
  name: 'default',
  
  types: schemaTypes.concat([
    singletonHome,
    singletonContact,
    singletonAbout,
    singletonWhatsOn,
    singletonEvents,
    singletonOffers,
    singletonNewsLanding,
    singletonGlobalOptions,
    news,
    syncEvent,
    categories,
    policies,
    redirects,
    defaultImage,
    embed,
    blockQuote,
    inlineImage,
    contentSimple,
    seo
  ]),
})
