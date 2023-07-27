import S from "@sanity/desk-tool/structure-builder";
import IframePreview from './preview/IFramePreview'

import {
  FiHome,
  FiCamera,
  FiSun,
  FiCalendar,
  FiTarget,
  FiPhone,
  FiFileText,
  FiTag,
  FiSettings,
} from 'react-icons/fi'

import { getGlobalSlug, previewURL } from './utils/resolveProductionUrl'

export const getDefaultDocumentNode = ({ schemaType }) => S.document().views(getPreview(schemaType))

const getPreview = (schemaType) => {
  const globalSlug = getGlobalSlug(schemaType)
  if (globalSlug) {
    return [
      S.view.form(),
      S.view
        .component(IframePreview)
        .title('Web preview')
        .options({ previewURL, isMobile: false, globalSlug }),
      S.view
        .component(IframePreview)
        .title('Mobile preview')
        .options({ previewURL, isMobile: true, globalSlug })
    ]
  }
  return [S.view.form()]
}

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title('Home').child(S.editor().id('home').schemaType('home').documentId('singleton-home').views(getPreview('home'))).icon(FiHome),
      S.divider(),
      S.listItem().title("What's On").child(S.editor().id('whatsOn').schemaType('whatsOn').documentId('singleton-whatsOn').views(getPreview('whatsOn'))).icon(FiCalendar),
      S.divider(),
      S.listItem()
        .title('Latest News')
        .child(
          S.list()
            .title('Latest News')
            .items([
              S.listItem().title('Articles').child(S.documentTypeList('news')).icon(FiSun),
              S.divider(),
              S.listItem().title('Categories').child(S.documentTypeList('categories')).icon(FiTag),
            ]),
        ),
      S.divider(),
      S.listItem().title('About').child(S.editor().id('about').schemaType('about').documentId('singleton-about').views(getPreview('about'))).icon(FiTarget),
      S.divider(),
      S.listItem().title('Contact').child(S.editor().id('contact').schemaType('contact').documentId('singleton-contact').views(getPreview('contact'))).icon(FiPhone),
      S.divider(),
      S.listItem().title('Policies').child(S.documentTypeList('policies')).icon(FiFileText),
      S.divider(),
      S.listItem().title('Global Options').child(S.editor().id('global').schemaType('global').documentId('singleton-global')).icon(FiSettings),
    ]);