import { RESUME_TYPES, GENDER, YEARS_OF_SERVICE, FULL_LIST } from 'strings'
import { GUIDE } from 'icons'

export default {
  protocol: 'http',
  platform: 32,
  themeId: 2971579,
  // themeId: 2442582,
  fileType: 31,
  baseUrl: weex.config.bundleUrl
    .replace(/(\/Resume.js.*)|(\/CareerVision.js.*)|(\/CareerBackground.js.*)|(\/BasicInfo.js.*)|(\/Guide.js.*)/, '/')
}

export const requestType = {
  GET: 'GET',
  POST: 'POST',
  JSONP: 'JSONP'
}

export const appInfo = {
  protocolVersion: '1.0',
  appId: 'wps_pc',
  clientVersion: '10.1.0.6749'
}

export const callbacks = {
  NOTIFY_ISLOGINED: 'userStateChanged'
}

export const STORAGE_KEY = {
  APP_INFO: 'appInfo',
  PARAMS: 'PARAMS',
  RESUMETYPES: 'resumeTypes',
  BASIC_INFO: 'basicInfo',
  CAREER_OBJECTIVE: 'career',
  EDUCATION_BACKGROUND: 'education',
  CAREER_BACKGROUND: 'careerBackground',
  ASSOCIATION_ACTIVITY: 'association',
  PROJECT_EXPERIENCE: 'experience',
  QUALIFICATIONS: 'qualifications',
  SKILL: 'skills',
  HOBBIES: 'hobbies',
  SELF_APPRAISAL: 'selfAppraisal',
  CUSTOMIZED_CATEGORY: 'customizedCategory',
  CUSTOMIZED: 'customized',
  JOB_TITLES: 'jobTitleTree',
  AVAILABLE_ITEMS: 'availableItems',
  CAREER_VISION: 'career_vision',
  CAREER_VISION_TYPE: 'career_vision_type',
  HAS_SHOW_GUIDE: 'hasShowGuide',
  HAS_SHOW_GUIDE_OVERLAY: 'hasShowGuideOverlay',
  HAS_SHOW_GUIDE_PAGE: 'hasShowGuidePage',
  CITY: 'city'
}

export const VIEWS = {
  index: 'Resume.js',
  guide: 'Guide.js',
  career: 'CareerVision.js',
  basic: 'BasicInfo.js',
  skill: 'Skill.js',
  choosetitle: 'ChooseJobTitle.js',
  education: 'EducationBackground.js',
  careerbackground: 'CareerBackground.js',
  association: 'AssociationActivity.js',
  experience: 'ProjectExperience.js',
  self: 'SelfAppraisal.js',
  qualifications: 'Qualifications.js',
  hobbies: 'Hobbies.js',
  customized: 'Customized.js',
  choosecity: 'ChooseCity.js'
}

export const ITEM = {
  CAREER_OBJECTIVE: 1,
  EDUCATION_BACKGROUND: 2,
  CAREER_BACKGROUND: 3,
  ASSOCIATION_ACTIVITY: 4,
  PROJECT_EXPERIENCE: 5,
  QUALIFICATIONS: 6,
  SKILL: 7,
  HOBBIES: 8,
  SELF_APPRAISAL: 9
}

export const RESUME_TYPES_LIST = [{
  id: 0,
  name: RESUME_TYPES.SOCIAL,
  icon: GUIDE.SOCIAL
}, {
  id: 1,
  name: RESUME_TYPES.CAMPUS,
  icon: GUIDE.CAMPUS
}, {
  id: 2,
  name: RESUME_TYPES.INTERNSHIP,
  icon: GUIDE.INTERNSHIP
}]

// basic=基本信息，expect=求职意向，
// edu=教育经历，work=工作经历，school=在校经历，
// proj=项目经历，award=奖励证书，skill=技能特长，
// hobby=兴趣爱好，self=自我评价，other=自定义
export const PROFILE_ITEM_LIST = [{
  id: ITEM.CAREER_OBJECTIVE,
  title: FULL_LIST.CAREER_OBJECTIVE,
  view: 'career',
  mapState: 'career',
  hasContent: true,
  ref: 'refCareer',
  info: 'expect'
}, {
  id: ITEM.EDUCATION_BACKGROUND,
  title: FULL_LIST.EDUCATION_BACKGROUND,
  view: 'education',
  mapState: 'education',
  ref: 'refEducation',
  info: 'edu'
}, {
  id: ITEM.CAREER_BACKGROUND,
  title: FULL_LIST.CAREER_BACKGROUND,
  view: 'careerbackground',
  mapState: 'careerBackground',
  ref: 'refCareerbackground',
  showTips: true,
  info: 'work'
}, {
  id: ITEM.ASSOCIATION_ACTIVITY,
  title: FULL_LIST.ASSOCIATION_ACTIVITY,
  view: 'association',
  mapState: 'association',
  ref: 'refAssociation',
  showTips: true,
  info: 'school'
}, {
  id: ITEM.PROJECT_EXPERIENCE,
  title: FULL_LIST.PROJECT_EXPERIENCE,
  view: 'experience',
  mapState: 'experience',
  ref: 'refExperience',
  showTips: true,
  info: 'proj'
}, {
  id: ITEM.QUALIFICATIONS,
  title: FULL_LIST.QUALIFICATIONS,
  view: 'qualifications',
  mapState: 'qualifications',
  ref: 'refQualifications',
  info: 'award'
}, {
  id: ITEM.SKILL,
  title: FULL_LIST.SKILL,
  view: 'skill',
  mapState: 'skills',
  ref: 'refSkills',
  info: 'skill'
}, {
  id: ITEM.HOBBIES,
  title: FULL_LIST.HOBBIES,
  view: 'hobbies',
  mapState: 'hobbies',
  ref: 'refHobbies',
  info: 'hobby'
}, {
  id: ITEM.SELF_APPRAISAL,
  title: FULL_LIST.SELF_APPRAISAL,
  view: 'self',
  mapState: 'selfAppraisal',
  ref: 'refSelfAppraisal',
  showTips: true,
  info: 'self'
}]

export const CUSTOMIZED_VIEW = 'customized'

export const GENDER_OPTIONS = [ GENDER.MALE, GENDER.FEMALE ]

export const YEARS_OF_SERVICE_OPTIONS = YEARS_OF_SERVICE
