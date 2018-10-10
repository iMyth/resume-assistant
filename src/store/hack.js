import { RESUME_TYPES } from 'strings'
import { ITEM, appInfo, STORAGE_KEY } from 'config'
import service from 'service'
import localStorage from 'localStorage'
import * as types from './mutation-types'

const initMapping = [
  'resumeTypes', 'basicInfo', 'career', 'education',
  'careerBackground', 'association', 'experience',
  'qualifications', 'skills', 'hobbies', 'selfAppraisal',
  'customizedCategory', 'customized', 'availableItems',
  'jobTitleTree', 'customized'
]

export let state = {
  resumeTypes: RESUME_TYPES.SOCIAL,
  // basic info
  basicInfo: {
    name: '',
    gender: '',
    birthday: '',
    city: '',
    mail: '',
    phone: '',
    url: '',
    localPath: '',
    yearsOfService: ''
  },
  /**
   * career objective
   * @example
   *
   * {
   *   objective: '',
   *   type: '',
   *   city: '',
   *   salary: '',
   *   industry: ''
   * }
   */
  career: {
    objective: '',
    type: '',
    city: '',
    salary: '',
    industry: ''
  },
  /**
   * education background
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   major: '',
   *   degree: '',
   *   period: { start, end },
   *   status
   * }, ...]
   */
  education: [],
  /**
   * career background
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   position: '',
   *   period: { start: 'start', end: 'end' },
   *   specification: '',
   *   content: '',
   *   status: ''
   * }, ...]
   */
  careerBackground: [],
  /**
   * association activity
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   position: '',
   *   period: { start: 'start', end: 'end' },
   *   desc: '',
   *   status: 0
   * }, ...]
   */
  association: [],
  /**
   * project experience
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   category: '',
   *   role: '',
   *   period: { start: 'start', end: 'end' },
   *   content: '',
   *   status: 0
   * }, ...]
   */
  experience: [],
  /**
   * qualifications
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   date: 'date',
   *   status: 0
   * }, ...]
   */
  qualifications: [],
  /**
   * skills
   * @example
   *
   * [{
   *   id: 0,
   *   name: '',
   *   level: '',
   *   status: 0
   * }, ...]
   */
  skills: [],
  /**
   * hobbies
   * @example
   * [{
   *   id: 0,
   *   name: ''
   * }, ...]
   */
  hobbies: [],
  // self appraisal
  selfAppraisal: '',
  /**
   * @example
   *
   * [{
   *   id: 0,
   *   name: ''
   * }, ...]
   */
  customizedCategory: [],
  /**
   * customized modules
   * @example
   *
   * [{
   *   id: 0,
   *   name: 'name',
   *   categoryId: 0,
   *   role: '',
   *   period: { start: 'start', end: 'end' },
   *   desc: ''
   * }, ...]
   */
  customized: [],

  /**
   * available items id, which should be pinned on profile
   */
  availableItems: [
    ITEM.CAREER_OBJECTIVE,
    ITEM.EDUCATION_BACKGROUND,
    ITEM.CAREER_BACKGROUND
    // ITEM.ASSOCIATION_ACTIVITY,
    // ITEM.PROJECT_EXPERIENCE,
    // ITEM.QUALIFICATIONS,
    // ITEM.SKILL,
    // ITEM.HOBBIES,
    // ITEM.SELF_APPRAISAL
  ],
  /**
   * @example
   * {
   *    "互联网通信": {
   *        "产品": [
   *            "产品经理", ...
   *        ],
   *    },
   *    ...
   *  }
   */
  jobTitleTree: {}
}

// mutations
const mutations = {
  [types.ADD_ITEM] (param) {
    let { name, data } = param
    this[name].push(data)
    localStorage.setDataByKey(name, this[name])
  },
  [types.EDIT_ITEM] (param) {
    let { name, data } = param
    Object.assign(this[name], data)
    localStorage.setDataByKey(name, this[name])
  },
  [types.EDIT_ARRAY_ITEM] (param) {
    let { name, index, data } = param
    Object.assign(this[name][index], data)
    localStorage.setDataByKey(name, this[name])
  },
  [types.REMOVE_ARRAY_ITEM] (param) {
    let { name, index } = param
    this[name].splice(index, 1)
    return localStorage.setDataByKey(name, this[name], false, true)
  },
  [types.ADD_MODULE] (param) {
    let { id } = param
    if (!~this.availableItems.indexOf(id)) {
      this.availableItems.push(id)
    }
    localStorage.setDataByKey(STORAGE_KEY.AVAILABLE_ITEMS, this.availableItems, false, true)
  },
  [types.ADD_CUSTOMIZED_MODULE] (param) {
    let id = 0
    // if (this.customizedCategory.length > 0) {
    //   id = Math.max.apply(null, this.customizedCategory.map(p => +p.id || 0)) + 1
    // }
    // this.customizedCategory.push({
    //   name: param.name,
    //   id
    // })
    this.customizedCategory = [{
      name: param.name,
      id
    }]
    return localStorage.setDataByKey(STORAGE_KEY.CUSTOMIZED_CATEGORY, this.customizedCategory, false, true)
  },
  [types.EDIT_CUSTOMIZED_NAME] (param) {
    let id = param.id || 0
    let item = this.customizedCategory.find(p => p.id === id) || this.customizedCategory[0]
    if (!item) {
      return
    }
    item.name = param.name
    localStorage.setDataByKey(STORAGE_KEY.CUSTOMIZED_CATEGORY, this.customizedCategory, false, true)
  },
  [types.ADD_CUSTOMIZED_ITEM] (param) {},
  [types.SET_JOB_TITLE_TREE] (param) {
    this.jobTitleTree = param
    localStorage.setAllCareers(this.jobTitleTree)
  }
}

export let actions = {
  getInitialState () {
    let promiseList = []
    initMapping.forEach(p => {
      promiseList.push(localStorage.getDataByKey(p).then(data => {
        if (data) {
          this[p] = data
        }
        if (p === 'careerBackground') {
          if (data && data.length) {
            this.hasShowGuide = true
          }
        }
        // if (p === 'customized' && (!data || !data.length)) {
        //   this.customizedCategory = []
        // }
        return new Promise((resolve, reject) => {
          resolve('ok')
        })
      }))
    })
    return Promise.all(promiseList)
  },
  addOrEditItem (param) {
    let { name, data } = param
    let target = this[name]
    if (!target) {
      return
    }
    if (Array.isArray(target)) {
      let index = target.findIndex(p => p.id === data.id)
      if (~index) {
        return mutations[types.EDIT_ARRAY_ITEM].call(this, { name, index, data })
      }
      return mutations[types.ADD_ITEM].call(this, { name, data })
    }
    return mutations[types.EDIT_ITEM].call(this, { name, data })
  },
  showOrHideItem (param) {
    let { name, id } = param
    let target = this[name]
    if (!target || !Array.isArray(target)) {
      return
    }
    let item = target.find(p => p.id === id)
    item.status = item.status ^ 1
    mutations[types.EDIT_ITEM].call(this, { name, item })
  },
  removeItem (param) {
    let { name, id } = param
    let target = this[name]
    if (!target || !Array.isArray(target)) {
      return
    }
    let index = target.findIndex(p => p.id === id)
    if (!~index) {
      return
    }
    return mutations[types.REMOVE_ARRAY_ITEM].call(this, { name, index })
  },
  addModule (param) {
    mutations[types.ADD_MODULE].call(this, param)
    // hack, scroll to elememt
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok')
      }, 200)
    })
  },
  addCustomizedModule (param) {
    return mutations[types.ADD_CUSTOMIZED_MODULE].call(this, param)
  },
  editCustomizedModuleName (param) {
    mutations[types.EDIT_CUSTOMIZED_NAME].call(this, param)
  },
  addCustomizedItem (param) {
    mutations[types.ADD_CUSTOMIZED_ITEM].call(this, param)
  },
  retrieveJobTitles (param) {
    return service.fetchJobTitle({
      data: appInfo
    }).then(p => {
      mutations[types.SET_JOB_TITLE_TREE].call(this, param)
      return new Promise((resolve, reject) => {
        resolve(p)
      })
    })
  }
}

export let getters = {
  percentage () {
    let {
      basicInfo = { name: '' },
      career = {},
      education = [],
      careerBackground = [],
      association = [],
      experience = [],
      qualifications = [],
      skills = [],
      hobbies = [],
      selfAppraisal = ''
    } = this
    return Object.keys(basicInfo)
      .map(p => (basicInfo[p] && basicInfo.hasOwnProperty(p)) && p !== 'localPath' ? 1 : 0)
      .reduce((p, q) => p + q) * 2 +
      (career.objective && career.type && career.city && career.salary ? 10 : 0) +
      (education.length > 0 ? 10 : 0) +
      (careerBackground.length > 0 ? 20 : 0) +
      (association.length > 0 ? 15 : 0) +
      (experience.length > 0 ? 10 : 0) +
      (qualifications.length > 0 ? 2 : 0) +
      (skills.length > 0 ? 2 : 0) +
      (hobbies.length > 0 ? 2 : 0) +
      (selfAppraisal.length > 0 ? 13 : 0)
  }
}
