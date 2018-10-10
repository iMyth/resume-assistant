// const clipboard = weex.requireModule('clipboard')

/**
 * update the bookmark content, keep bookmark
 * @param {Object} doc document content
 * @param {String} bookmark bookmark
 * @param {String} content new content
 */
export function updateBookmarkContent (doc, bookmark, content) {
  content = content || ' '
  let item = doc.Bookmarks.Item(bookmark)
  if (!item) {
    return
  }
  item.Select()
  let docSelection = doc.Selection
  let start = docSelection.Start
  docSelection.TypeText(content)
  // buggie, 某些特殊字符并不会占用排版的长度，所以content.length并不能直接用来设置Selection
  docSelection.SetRange(start, docSelection.End)
  doc.Bookmarks.Add(bookmark)
}

/**
 * update bookmark block
 * @param {Object} doc document content
 * @param {Array} subBookmarks bookmarks list
 * @param {Object} contentMapping content mapping
 */
export function updateBookmarkBlock ({ doc, subBookmarks, contentMapping }) {
  subBookmarks.forEach(bookmark => {
    updateBookmarkContent(doc, bookmark, contentMapping[bookmark] || ' ')
  })
}

/**
 * speculate line breaks bookmark name
 * @param {String} bookmark parent bookmark name
 */
const getBookmarkSpaceName = bookmark => {
  let bookmarkSpace = ''
  let reg = new RegExp('_[0-9]+$')
  let result = reg.exec(bookmark)
  if (result && result[0]) {
    bookmarkSpace = bookmark.replace(reg, `_space${result[0]}`)
  }
  return bookmarkSpace
}

/**
 * copy and paste bookmark
 * @param {Object} doc document content
 * @param {String} bookmark bookmark name
 * @param {String} bookmarkSpace bookmark line breaks name
 */
export function copyAndPasteBookmarkBlock (doc, bookmark, bookmarkSpace) {
  bookmarkSpace = bookmarkSpace || getBookmarkSpaceName(bookmark)
  let spacemark = doc.Bookmarks.Item(bookmarkSpace)
  let docSelection = doc.Selection
  let block = doc.Bookmarks.Item(bookmark)
  if (!block) {
    return
  }
  if (spacemark) {
    spacemark.Select()
    let contentStart = docSelection.End
    docSelection.Copy()
    docSelection.SetRange(docSelection.End, docSelection.End)
    docSelection.Paste()
    block.Select()
    docSelection.Copy()
    docSelection.SetRange(contentStart, contentStart)
    docSelection.Paste()
  } else {
    block.Select()
    let contentEnd = docSelection.End
    docSelection.Copy()
    docSelection.SetRange(docSelection.End, docSelection.End)
    // hack, do not insert paragraph for education background
    if (bookmark !== 'education_1' && bookmark !== 'skills_1') {
      docSelection.InsertParagraph()
      docSelection.SetRange(contentEnd + 1, contentEnd + 1)
    }
    docSelection.Paste()
  }
}

/**
 * delete block by bookmark name
 * @param {Object} doc document content
 * @param {String} bookmark bookmark name
 * @param {String} bookmarkSpace bookmark line breaks name
 */
export function deleteBookmark (doc, bookmark, bookmarkSpace) {
  let block = doc.Bookmarks.Item(bookmark)
  if (!block) {
    return
  }
  let docSelection = doc.Selection
  block.Select()
  let start = docSelection.Start
  let end = docSelection.End
  // if (/^(skills)|(education)_[0-9]+$/.test(bookmark)) {
  //   end--
  // }
  docSelection.SetRange(start, end + 1)
  docSelection.Delete()
  bookmarkSpace = bookmarkSpace || getBookmarkSpaceName(bookmark)
  let spacemark = doc.Bookmarks.Item(bookmarkSpace)
  if (spacemark) {
    spacemark.Select()
    docSelection.Delete()
  }
}

/**
 * gen RegExp
 * @param {String} bookmarkPrefix
 */
export const getBookmarkRegExp = bookmarkPrefix => {
  return new RegExp(new RegExp(`^${bookmarkPrefix}[0-9]+$`))
}

/**
 * get bookmark names list
 * @param {Object} document content
 */
export function getAllBookmarksName (doc) {
  let bookmarks = []
  // let bookmarkCollection = doc.Bookmarks
  for (let i = 0, l = doc.Bookmarks.Count; i < l; i++) {
    bookmarks.push(doc.Bookmarks.Item(i + 1).Name)
  }
  return bookmarks
}
