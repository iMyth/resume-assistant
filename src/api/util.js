// import { resolve } from "path"
// web only
// import router from '../router'
import localStorage from 'localStorage'
import service from 'service'
import bridge from 'bridge'

const dom = weex.requireModule('dom')
const Navigator = weex.requireModule('navigator')

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isWeb () {
  const { platform } = weex.config.env
  return typeof (window) === 'object' && platform.toLowerCase() === 'web'
}
export function isIOS () {
  const { platform } = weex.config.env
  return platform.toLowerCase() === 'ios'
}

// buggie
export function isIPhoneX () {
  return weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6')
}
export function iPhoneXPrefix () {
  return {
    marginBottom: isIPhoneX() ? '68px' : 0
  }
}
export const iPhoneXButtonPrefixStyle = {
  bottom: isIPhoneX() ? '68px' : 0
}
export function isIPhonePlus () {
  const { deviceWidth } = weex.config.env
  if (isWeb()) {
    return false // buggie
  }
  return isIOS() && deviceWidth === 1242
}
export function isAndroid () {
  const { platform } = weex.config.env
  return platform.toLowerCase() === 'android'
}

/**
 * get the actual height of weex screen, should minus nav height
 * @returns {Number}
 */
export function getPageHeight () {
  const { env } = weex.config
  const { deviceHeight, deviceWidth, scale } = env
  // TBA: not correct corrently
  let navHeight = isWeb() ? 0 : (
    isIPhoneX()
      ? 176 : (64 * scale * 750 / deviceWidth))
  return deviceHeight / deviceWidth * 750 - navHeight
}

export function getCssPageHeight () {
  const { env } = weex.config
  return 750 / env.deviceWidth * env.deviceHeight
}

/**
 * get element Rect
 * @param el {Element}
 * @returns {Promise}
 */
export function getRect (el) {
  return new Promise((resolve, reject) => {
    if (!el) {
      return reject(new Error('Element is undefined!'))
    }
    dom.getComponentRect(el, res => {
      if (res.result) {
        resolve(res.size)
      } else {
        reject(res)
      }
    })
  })
}

/**
 * @param {Array} array
 * @param {Nember} number
 * @returns {Number} index
 */
export function getNearestNumberOfArray (array, number) {
  let index = 0
  for (let i = index, l = array.length; i < l; i++) {
    if (Math.abs(number - array[i]) < Math.abs(number - array[index])) {
      index = i
    }
  }
  return index
}

// const _handlerDate = (str) => {
//   str = str || ''
//   return str.replace(/-/g, '.').slice(0, 7)
// }

export function periodToString (period) {
  if (!period || (!period.start && !period.end)) {
    return ''
  }
  return `${period.start || ''}-${period.end || ''}`// `${_handlerDate(period.start || '')}-${_handlerDate(period.end || '')}`
}

export function objToQuery (obj) {
  let query = '?'
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue
    }
    query += `${key}=${obj[key]}&`
  }
  return query.slice(0, -1)
}

export function setNavigatorTitle (title) {
  Navigator.setNavBarTitle({
    title: title
  }, () => { })
}

export function goBack () {
  Navigator.pop()
}

const mapping = {
  basicInfo: 'base_info',
  career: 'job_intention',
  education: 'education',
  careerBackground: 'experience',
  association: 'school_experience',
  experience: 'program_experience',
  qualifications: 'honor',
  skills: 'skill',
  hobbies: 'hobby',
  selfAppraisal: 'self_evaluation',
  customized: 'extra',
  customizedCategory: 'extra'
}

const _getCategory = themeInfo => ({
  template_id: themeInfo.zt_id,
  originalPrice: Math.round(themeInfo.price / 100),
  price: Math.round((themeInfo.price * +themeInfo.discount) / 100)
})

export function getThemeInfo () {
  return new Promise((resolve, reject) => {
    localStorage.getAppInfo().then(appInfo => {
      if (!appInfo) {
        reject(new Error('appInfo is not defined!'))
        return
      }
      let { themeInfo } = appInfo
      if (!themeInfo) {
        reject(new Error('themeInfo is not defined!'))
        return
      }
      resolve(themeInfo)
    })
  })
}

export function checkHasBought () {
  return localStorage.getAppInfo().then(appInfo => {
    if (!appInfo || !appInfo.themeInfo) {
      console.error('appInfo=>', appInfo)
      throw new Error('appInfo/themeInfo is not defined!')
    }
    let { themeInfo } = appInfo
    return bridge.checkHasBought({
      category_id: themeInfo.zt_id
    })
  })
}

export function processPayment (param) {
  return getThemeInfo().then(themeInfo => {
    return bridge.pay(
      Object.assign({
        buy_kit_reason: 1,
        category: _getCategory(themeInfo)
      }, param)
    )
  })
}

export function formatDate (date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function showPurchases (param) {
  return getThemeInfo().then(themeInfo => {
    return bridge.showPurchases(
      Object.assign({
        category: _getCategory(themeInfo)
      }, param)
    )
  })
}

export function queryUrlStr (key) {
  let value = ''
  let query = weex.config.bundleUrl.split('?')[1]
  if (!query) {
    return value
  }
  query = query.split('#')[0]
  let arr = query.split('&')
  arr.forEach(p => {
    let map = p.split('=')
    if (map[0] === key) {
      value = map[1]
    }
  })
  return value
}

export function queryHashStr (key) {
  if (typeof window === 'undefined') {
    return ''
  }
  let value = ''
  let hash = window.location.hash.split('?')[1]
  if (!hash) {
    return value
  }
  let arr = hash.split('&')
  arr.forEach(p => {
    let map = p.split('=')
    if (map[0] === key) {
      value = map[1]
    }
  })
  return value
}

export function throttle (action, delay, isReverse) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout && !isReverse) {
      return
    }
    if (isReverse) {
      clearTimeout(timeout)
      lastRun = Date.now()
    }
    let elapsed = Date.now() - lastRun
    let context = this
    let args = arguments
    let runCallback = function () {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
  }
}

export function updateResume (dictionary) {
  // 注意：name，sex，phone，brithday，city, mail, workage是包含在base_info的json里面的，请确保每次更新base_info都包括name，sex，phone，brithday，city, mail, workage在里面。
  // 其他的字段和baseinfo字段都是可省略的
  // 总字段如下
  // base_info: {"name":"hjy","phone":"1234567","sex":"male"} 用户基本信息
  // job_intention: NULL 求职意向
  // experience: {"company":"zb"} 工作经验
  // education: [{"school":"scut"},{"school":"hzh"}] 教育背景
  // school_experience: NULL 在校经历
  // program_experience: NULL 项目经验
  // hobby: ["baseball","basketball"] 爱好
  // skill: NULL 技能特长
  // extra: NULL 自定义
  // head:
  // "http://img1.file.cache.docer.com/storage/image/a/8/b/f/a/a40fa68b82db46deb8b67b69f65ea3a4.png/484x271.png"
  // 用户头像地址
  // intro: NULL 一句话简介
  // self_evaluation: NULL 自我评价
  // honor: NULL 荣誉证书
  // do not handle unnecessary data
  if (!dictionary || !dictionary.key || !mapping[dictionary.key]) {
    return
  }
  let target
  if (dictionary.key === 'base_info') {
    let {
      name,
      gender,
      birthday,
      city,
      mail,
      phone,
      url,
      yearsOfService,
      localPath
    } = dictionary.value
    target = {
      head: url,
      base_info: {
        name,
        sex: gender,
        birthday,
        city,
        mail,
        workage: yearsOfService,
        phone,
        localPath
      }
    }
  } else {
    target = {
      [mapping[dictionary.key]]: dictionary.value
    }
  }
  // force login
  // bridge.islogin().then(p => {
  //   if (!p.is_login) {
  //     bridge.showLogin()
  //   } else {
  //     service.updateResume({
  //       data: {
  //         resume: target
  //       }
  //     })
  //   }
  // })
  service.updateResume({
    data: {
      resume: target
    }
  })
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

let _loginCheckHandler = 0
let retryTimes = 180
let _currentRetryTimes = 0
let _interval = 1000

export function continuesChecking (callback, doNotReset) {
  clearTimeout(_loginCheckHandler)
  doNotReset || (_currentRetryTimes = 0)
  if (_currentRetryTimes > retryTimes) {
    return
  }
  _currentRetryTimes++
  bridge.islogin().then(p => {
    if (!p.is_login) {
      _loginCheckHandler = setTimeout(() => {
        continuesChecking(callback, true)
      }, _interval)
      return
    }
    callback()
  })
}

export function tryCheckLogin () {
  return new Promise((resolve, reject) => {
    bridge.islogin().then(p => {
      if (!p.is_login) {
        bridge.showLogin()
        reject(new Error('no login'))
        return
      }
      resolve('ok')
    })
  })
}
