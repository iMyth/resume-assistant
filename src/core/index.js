import { replaceBookmarks } from './batchReplace.js'
import { addBookmarkBlock } from './batchAdd.js'
import { getActiveDocument, close } from './openFile.js'
import { addPicture } from './addPicture.js'
import localStorage from 'localStorage'

const mapState = [
  'education', 'careerBackground', 'association',
  'experience', 'qualifications', 'skills',
  'customized'
]

const getDataByMapState = nama => {
  return localStorage.getDataByKey(nama)
}

const addAllBookmarkBlock = param => {
  let obj = param || {}
  let promiseList = []
  for (let i = 0, l = mapState.length; i < l; i++) {
    let key = mapState[i]
    promiseList.push(getDataByMapState(key).then(p => {
      p = p || []
      obj[key] = p.filter(p => p.status)
      return new Promise((resolve, reject) => {
        resolve(p)
      })
    }))
  }
  return Promise.all(promiseList).then(() => {
    addBookmarkBlock(obj)
    return new Promise((resolve, reject) => {
      resolve('next')
    })
  })
}

const replaceState = [ 'basicInfo', 'career', 'selfAppraisal', 'hobbies', 'qualifications' ]
const replaceBookmarkBlock = param => {
  let obj = param || {}
  let promiseList = []
  for (let i = 0, l = replaceState.length; i < l; i++) {
    let key = replaceState[i]
    promiseList.push(getDataByMapState(key).then(p => {
      obj[key] = p
      return new Promise((resolve, reject) => {
        resolve(p)
      })
    }))
  }
  return Promise.all(promiseList).then(() => {
    replaceBookmarks(obj)
    return new Promise((resolve, reject) => {
      resolve('next')
    })
  })
}

export default {
  replaceBookmarks,
  addBookmarkBlock,
  addPicture,
  getActiveDocument,
  close,
  addAllBookmarkBlock,
  replaceBookmarkBlock
}
