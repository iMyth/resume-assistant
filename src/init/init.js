import service from 'service'
import config, { STORAGE_KEY } from 'config'
import localStorage from 'localStorage'

// let app = {
//   themeInfo: {}
// }
const mapping = {
  base_info: 'basicInfo',
  job_intention: 'career',
  education: 'education',
  experience: 'careerBackground',
  school_experience: 'association',
  program_experience: 'experience',
  honor: 'qualifications',
  skill: 'skills',
  hobby: 'hobbies',
  self_evaluation: 'selfAppraisal',
  extra: 'customized'
}
let defaultData = {
  base_info: {},
  job_intention: {},
  education: [],
  experience: [],
  school_experience: [],
  program_experience: [],
  honor: [],
  skill: [],
  hobby: [],
  self_evaluation: '',
  extra: { customized: [], customizedCategory: [] }
}
let app = {}

service.fetchThemeInfo({
  data: {
    zt_id: config.themeId,
    mb_platform: config.platform,
    response_json: 1 // hack
  }
}).then(p => {
  return new Promise((resolve, reject) => {
    app.themeInfo = p
    localStorage.setAppInfo(app)
    resolve(p)
  })
})

export const fetchUserInfo = () => {
  let promiseList = []
  return service.fetchUserInfo({}).then(p => {
    Object.assign(defaultData, p)
    for (var key in defaultData) {
      if (key === 'extra') {
        promiseList.push(localStorage.setDataByKey(
          STORAGE_KEY.CUSTOMIZED,
          defaultData[key].customized,
          true
        ))
        promiseList.push(localStorage.setDataByKey(
          STORAGE_KEY.CUSTOMIZED_CATEGORY,
          defaultData[key].customizedCategory,
          true
        ))
      } else {
        promiseList.push(localStorage.setDataByKey(mapping[key], defaultData[key], true))
      }
    }
    return Promise.all(promiseList)
  })
}
