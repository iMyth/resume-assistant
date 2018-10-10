import { STORAGE_KEY } from 'config'
import { updateResume } from 'util'
import bridge from 'bridge'

const storage = weex.requireModule('storage')

const sortData = arr => {
  return arr.sort((a, b) => {
    if (!a.period || !b.period) {
      return -1
    }
    if (b.period.end < a.period.end) {
      return -1
    }
    if (b.period.end === a.period.end && b.period.start < a.period.start) {
      return -1
    }
    if (b.period.start === a.period.start && b.id < a.id) {
      return -1
    }
    return 1
  })
}

let userId = ''

if (WXEnvironment.platform === 'Web') {
  userId = '_'
}

const getUserId = () => {
  return new Promise((resolve, reject) => {
    if (userId) {
      resolve(userId)
    } else {
      bridge.getUserId().then(p => {
        userId = p.user_id || ''
        resolve(userId)
      })
    }
  })
}

const _updateAdaptor = function (dictionary) {
  if (dictionary.key === 'customized' || dictionary.key === 'customizedCategory') {
    let customized, customizedCategory
    _getData(STORAGE_KEY.CUSTOMIZED_CATEGORY).then(p => {
      customizedCategory = p
      return _getData(STORAGE_KEY.CUSTOMIZED)
    }).then(p => {
      customized = p
      dictionary.value = {
        customized,
        customizedCategory
      }
      updateResume(dictionary)
    })
  } else {
    updateResume(dictionary)
  }
}

const _getData = (key, noUserId) => {
  return getUserId().then(userId => {
    key = key + (noUserId ? '' : userId)
    return new Promise((resolve, reject) => {
      storage.getItem(key, res => {
        if (res.result === 'success') {
          resolve(JSON.parse(res.data))
        } else {
          // reject(new Error(res.data))
          resolve(undefined)
        }
      })
    })
  })
}

const _setData = (key, data, noUserId) => {
  return getUserId().then(userId => {
    key = key + (noUserId ? '' : userId)
    return new Promise((resolve, reject) => {
      storage.setItem(key, JSON.stringify(data), () => {
        resolve('ok')
      })
    })
  })
}

const _removeData = (key, noUserId) => {
  return getUserId().then(userId => {
    key = key + (noUserId ? '' : userId)
    return new Promise((resolve, reject) => {
      storage.removeItem(key, () => {
        resolve('ok')
      })
    })
  })
}

const _checkOnce = (key, noUserId = true, defaultValue = 1) => {
  return new Promise((resolve, reject) => {
    _getData(key, noUserId).then(p => {
      _setData(key, defaultValue, noUserId)
      resolve(!!p)
    })
  })
}

export default {
  getAllJobs () {
    return _getData(STORAGE_KEY.JOB_TITLES, true).then(p => {
      let jobs = []
      for (let i in p) {
        if (!p[i]) {
          continue
        }
        for (let j in p[i]) {
          let arr = p[i][j]
          if (!Array.isArray(arr)) {
            continue
          }
          jobs.push(...arr)
        }
      }
      return new Promise((resolve, reject) => {
        resolve(jobs)
      })
    })
  },
  getAllCareersTree () {
    return _getData(STORAGE_KEY.JOB_TITLES, true).then(p => {
      return new Promise((resolve, reject) => {
        resolve(p)
      })
    })
  },
  getAllCareers () {
    return _getData(STORAGE_KEY.JOB_TITLES, true).then(p => {
      return new Promise((resolve, reject) => {
        resolve(Object.keys(p))
      })
    })
  },
  getVision (withoutUserId = false) {
    return _getData(STORAGE_KEY.CAREER_VISION, withoutUserId)
  },
  delVision (withoutUserId = false) {
    return _setData(STORAGE_KEY.CAREER_VISION, {}, withoutUserId)
  },
  setVision (data, withoutUserId = false) {
    return _setData(STORAGE_KEY.CAREER_VISION, data, withoutUserId)
  },
  getVisionType () {
    return _getData(STORAGE_KEY.CAREER_VISION_TYPE, true)
  },
  setVisionType (data) {
    return _setData(STORAGE_KEY.CAREER_VISION_TYPE, data, true)
  },
  removeVisionType () {
    return _removeData(STORAGE_KEY.CAREER_VISION_TYPE, true)
  },
  setAllCareers (data) {
    return _setData(STORAGE_KEY.JOB_TITLES, data, true)
  },
  initResumeType (arr) {
    return new Promise((resolve, reject) => {
      _getData(STORAGE_KEY.AVAILABLE_ITEMS, true).then((p = []) => {
        _setData(
          STORAGE_KEY.AVAILABLE_ITEMS,
          arr.concat(p).reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort(),
          true
        )
        resolve('ok')
      })
    })
  },
  checkHasShowGuide () {
    return _checkOnce(STORAGE_KEY.HAS_SHOW_GUIDE)
  },
  checkHasShowGuidePage () {
    return _checkOnce(STORAGE_KEY.HAS_SHOW_GUIDE_PAGE)
  },
  checkHasShowGuideOverlayer () {
    return _checkOnce(STORAGE_KEY.HAS_SHOW_GUIDE_OVERLAY)
  },
  getDataByKey (key) {
    return _getData(key)
  },

  setDataByKey (key, data, doNotUpdateServer) {
    if (!doNotUpdateServer) {
      _updateAdaptor({
        key,
        value: data
      })
    }
    return _setData(key, data)
  },

  removeDataByKey (key) {
    return _removeData(key)
  },

  deleteItemByKey (key, data) {
    _getData(key).then(array => {
      if (!Array.isArray) {
        return
      }
      let index = array.findIndex(p => p.id === data.id)
      if (!~index) {
        return
      }
      array.splice(index, 1)
      _setData(key, array)
      _updateAdaptor({
        key,
        value: array
      }, true)
    })
  },
  addOrEditData (key, data) {
    _getData(key).then(array => {
      if (array) {
        if (!Array.isArray) {
          throw new Error(`localstorage -> ${key} <- should be an Array`)
        }
        if (data.id === -1) {
          data.id = array.length ? Math.max.apply(null, array.map(p => +p.id || 0)) + 1 : 1
        }
        let index = array.findIndex(p => p.id === data.id)
        ~index ? (array[index] = data) : array.push(data)
      } else {
        array = [].concat(data)
        data.id = 1
      }
      sortData(array)
      _setData(key, array)
      _updateAdaptor({
        key,
        value: array
      })
    })
  },

  getParameters () {
    return _getData(STORAGE_KEY.PARAMS)
  },
  /**
   * use localstorage to pass parameters
   * @param {Object || String || Array} data
   */
  setParameters (data) {
    return _setData(STORAGE_KEY.PARAMS, data)
  },

  getAppInfo () {
    return _getData(STORAGE_KEY.APP_INFO, true)
  },

  setAppInfo (info) {
    return _setData(STORAGE_KEY.APP_INFO, info, true)
  },

  removeParameters () {
    return _removeData(STORAGE_KEY.PARAMS)
  },

  removeAll () {
    storage.getAllKeys(e => {
      if (e.result === 'success' && e.data.length > 0) {
        e.data.forEach(p => {
          storage.removeItem(p, event => {
            console.log('delete value:', event.data)
          })
        })
      }
    })
  }
}
