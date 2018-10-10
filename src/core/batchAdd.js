import {
  updateBookmarkBlock,
  copyAndPasteBookmarkBlock,
  deleteBookmark,
  getAllBookmarksName,
  getBookmarkRegExp
} from './util.js'
import { addModuleAdaptor } from './bookmarkAdaptors.js'
import { getActiveDocument } from './openFile.js'

/**
 * apply data to config
 * @param {*} p: config, dataCount: ??, i: ??
 */
const _dataAdaptor = ({p, dataCount, i}) => {
  let originItems = Object.keys(p.subItems)
  let subItems = originItems.map(key => key + i)
  let applyData = {}
  subItems.forEach((s, index) => {
    applyData[s] = p.subItems[originItems[index]].apply(null, [p.data, dataCount - 1])
  })
  return {
    subBookmarks: subItems,
    contentMapping: applyData
  }
}

const _deleteAndUpdateBookmarks = ({ doc, p, blockCount, dataCount }) => {
  let shouldDeleteCount = blockCount - dataCount
  let currentCount = dataCount
  for (let i = blockCount; i > shouldDeleteCount; i--) {
    updateBookmarkBlock({
      doc,
      ..._dataAdaptor({p, dataCount: currentCount, i})
    })
    currentCount--
  }
  for (let i = 0; i < shouldDeleteCount; i++) {
    deleteBookmark(doc, p.block + (i + 1))
  }
  if (dataCount === 0) {
    deleteBookmark(doc, p.block.slice(0, -1))
  }
}

const _dropAllBlock = ({ doc, p, blockCount }) => {
  for (let i = 0; i < blockCount; i++) {
    deleteBookmark(doc, p.block + (i + 1))
  }
  deleteBookmark(doc, p.block.slice(0, -1))
}

const _addAndUpdateBookmarks = ({ doc, p, blockCount, dataCount }) => {
  let shouldAddCount = dataCount - blockCount + 1
  let currentCount = dataCount
  for (let i = blockCount; i > 1; i--) {
    updateBookmarkBlock({
      doc,
      ..._dataAdaptor({p, dataCount: currentCount, i})
    })
    currentCount--
  }
  for (let i = 0; i < shouldAddCount; i++) {
    updateBookmarkBlock({
      doc,
      ..._dataAdaptor({
        p,
        dataCount: shouldAddCount - i,
        i: 1
      })
    })
    if (i !== shouldAddCount - 1) {
      copyAndPasteBookmarkBlock(doc, p.block + 1)
    }
  }
}

export const addBookmarkBlock = ({
  education, careerBackground, association,
  experience, qualifications, skills, customized
}) => {
  let doc = getActiveDocument()
  let bookmarks = getAllBookmarksName(doc)
  let mapping = addModuleAdaptor({
    education,
    careerBackground,
    association,
    experience,
    qualifications,
    skills,
    customized
  })
  mapping.forEach(p => {
    let reg = getBookmarkRegExp(p.block)
    let blockCount = bookmarks.filter(p => reg.test(p)).length
    let dataCount = p.data.length
    if (!p.data || !p.data.length) {
      _dropAllBlock({ doc, p, blockCount })
      return
    }
    if (!blockCount) {
      console.error('bookmark=>', reg, 'not found')
      return
    }
    if (blockCount > dataCount) {
      _deleteAndUpdateBookmarks({ doc, p, blockCount, dataCount })
    } else {
      _addAndUpdateBookmarks({ doc, p, blockCount, dataCount })
    }
  })
}
