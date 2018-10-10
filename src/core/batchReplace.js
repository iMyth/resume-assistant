import { replacementAdaptor } from './bookmarkAdaptors.js'
import { getActiveDocument } from './openFile.js'
import { updateBookmarkContent, deleteBookmark } from './util.js'
import { addPicture } from './addPicture.js'

const _removeMapping = {
  assessment_content: 'assessment',
  hobbies_content: 'hobbies',
  honor_content: 'honor'
}

const _removeEmpty = (doc, bookmark) => {
  if (!_removeMapping[bookmark]) {
    return
  }
  deleteBookmark(doc, _removeMapping[bookmark])
  // updateBookmarkContent(doc, _removeMapping[bookmark], ' ')
}

export const replaceBookmarks = ({
  basicInfo = {},
  career = {},
  selfAppraisal = '',
  hobbies = [],
  qualifications = [],
  customizedName = ''
 }) => {
  let doc = getActiveDocument()
  let mapping = replacementAdaptor({
    career,
    basicInfo,
    selfAppraisal,
    hobbies,
    qualifications,
    customizedName
  })
  for (let bookmark in mapping) {
    if (bookmark !== 'photo') {
      updateBookmarkContent(doc, bookmark, mapping[bookmark])
    } else {
      addPicture(basicInfo.localPath)
    }
    if (!mapping[bookmark]) {
      _removeEmpty(doc, bookmark)
    }
    // manually drop assessment bookmark
    // if (bookmark === 'assessment_content' && !mapping[bookmark]) {
    //   updateBookmarkContent(doc, 'assessment', ' ')
    // }
  }
}
