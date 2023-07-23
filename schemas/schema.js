import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Singletons
import singletonHome from './singletonHome'
import singletonAbout from './singletonAbout'
import singletonWhatsOn from './singletonWhatsOn'
import singletonContact from './singletonContact'

// Documents
import news from './news'

// Common
import seo from './common/seo'
import defaultImage from './common/defaultImage'
import policies from './policies'

export default createSchema({
  name: 'default',
  
  types: schemaTypes.concat([
    singletonHome,
    singletonContact,
    singletonAbout,
    singletonWhatsOn,
    news,
    policies,
    defaultImage,
    seo
  ]),
})
