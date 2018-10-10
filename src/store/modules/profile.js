import { RESUME_TYPES } from 'strings'
import { ITEM, appInfo } from 'config'
import * as types from '../mutation-types'
import service from 'service'

// initial state
const state = {
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
   *   salary: ''
   * }
   */
  career: {
    objective: '',
    type: '',
    city: '',
    salary: ''
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
   * project experience
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
    ITEM.EDUCATION_BACKGROUND
    // ITEM.CAREER_BACKGROUND,
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
  jobTitleTree: {
    '互联网通信': {
      '产品': [
        '产品经理',
        '产品策划',
        '游戏策划'
      ],
      '技术': [
        '前端开发',
        '后端开发',
        '移动开发'
      ]
    },
    '休闲服务': {
      '体育保健': [
        '健身教练',
        '健身顾问'
      ],
      '旅游': [
        '导游',
        '旅游顾问'
      ]
    }
  }
}

// mutations
const mutations = {
  [types.ADD_ITEM] (state, param) {
    let { name, data } = param
    state[name].push(data)
  },
  [types.EDIT_ITEM] (state, param) {
    let { name, data } = param
    Object.assign(state[name], data)
  },
  [types.EDIT_ARRAY_ITEM] (state, param) {
    let { name, index, data } = param
    Object.assign(state[name][index], data)
  },
  [types.REMOVE_ARRAY_ITEM] (state, param) {
    let { name, index } = param
    state[name].splice(index, 1)
  },
  [types.ADD_MODULE] (state, param) {
    let { id } = param
    if (!~state.availableItems.indexOf(id)) {
      state.availableItems.push(id)
    }
  },
  [types.ADD_CUSTOMIZED_MODULE] (state, param) {
    let id = 0
    if (state.customizedCategory.length > 0) {
      id = Math.max.apply(null, state.customizedCategory.map(p => +p.id || 0)) + 1
    }
    state.customizedCategory.push({
      name: param.name,
      id
    })
  },
  [types.SET_JOB_TITLE_TREE] (state, param) {
    state.jobTitleTree = param
  }
}

// actions
const actions = {
  addOrEditItem ({ commit }, param) {
    let { name, data } = param
    let target = state[name]
    if (!target) {
      return
    }
    if (Array.isArray(target)) {
      let index = target.findIndex(p => p.id === data.id)
      if (~index) {
        return commit(types.EDIT_ARRAY_ITEM, { name, index, data })
      }
      return commit(types.ADD_ITEM, { name, data })
    }
    return commit(types.EDIT_ITEM, { name, data })
  },
  removeItem ({ commit }, param) {
    let { name, id } = param
    let target = state[name]
    if (!target || !Array.isArray(target)) {
      return
    }
    let index = target.findIndex(p => p.id === id)
    if (~index) {
      return
    }
    commit(types.REMOVE_ARRAY_ITEM, { name, index })
  },
  addModule ({commit}, param) {
    commit(types.ADD_MODULE, param)
  },
  addCustomizedModule ({ commit }, param) {
    commit(types.ADD_CUSTOMIZED_MODULE, param)
  },
  retrieveJobTitles ({ commit }, param) {
    return service.fetchJobTitle({
      data: appInfo
    }).then(p => {
      commit(types.SET_JOB_TITLE_TREE, param)
      return new Promise((resolve, reject) => {
        resolve(p)
      })
    })
  }
}

// getters
const getters = {
  percentage (state) {
    let {
      basicInfo,
      career,
      education,
      careerBackground,
      association,
      experience,
      qualifications,
      skills,
      hobbies,
      selfAppraisal
    } = state
    return Object.keys(basicInfo)
      .map(p => (basicInfo[p] && basicInfo.hasOwnProperty(p)) ? 1 : 0)
      .reduce((p, q) => p + q) * 2 +
      (career.length > 0 ? 10 : 0) +
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

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
