import { periodToString } from 'util'
import { PROFICIENCY_LEVEL } from 'strings'

export const replacementAdaptor = ({
  basicInfo = {},
  career = {},
  selfAppraisal = '',
  hobbies = [],
  qualifications = [],
  customizedName = ''
}) => ({
  // basicInfo
  name: basicInfo.name,
  gender: basicInfo.gender,
  birthday: basicInfo.birthday,
  livecity: basicInfo.city,
  workinglife: basicInfo.yearsOfService,
  phone: basicInfo.phone,
  photo: basicInfo.url,
  email: basicInfo.mail,

  // career vision
  post: career.objective,
  hopecity: career.city,
  posttype: career.type,
  salary: career.salary,
  assessment_content: selfAppraisal,
  hobbies_content: hobbies.filter(p => p.status).map(p => p.name || '').join('、'),
  honor_content: qualifications.filter(p => p.status).map(p => p.name || '').join('、'),
  userdefined_name_ch: customizedName
})

export const addModuleAdaptor = ({
  education, careerBackground, association,
  experience, qualifications, skills,
  customized
}) => {
  return [{
    block: 'work_',
    subItems: {
      work_company_: (p, i) => p[i].name || '',
      work_time_: (p, i) => periodToString(p[i].period),
      work_position_: (p, i) => p[i].position || '',
      work_describe_: (p, i) => p[i].content || '',
      work_type_: (p, i) => p[i].specification ? `（${p[i].specification}）` : ''
    },
    data: careerBackground
  }, {
    block: 'education_',
    subItems: {
      education_school_: (p, i) => p[i].name || '',
      education_time_: (p, i) => periodToString(p[i].period),
      education_major_: (p, i) => p[i].major || '',
      education_degree_: (p, i) => p[i].degree || ''
    },
    data: education
  }, {
    block: 'school_experience_',
    subItems: {
      school_experience_project_: (p, i) => p[i].name || '',
      school_experience_time_: (p, i) => periodToString(p[i].period),
      school_experience_role_: (p, i) => p[i].position || '',
      school_experience_describe_: (p, i) => p[i].desc || ''
    },
    data: association
  }, {
    block: 'project_',
    subItems: {
      project_name_: (p, i) => p[i].name || '',
      project_time_: (p, i) => periodToString(p[i].period),
      project_position_: (p, i) => p[i].role || '',
      project_describe_: (p, i) => p[i].content || ''
    },
    data: experience
  }, {
    block: 'skills_',
    subItems: {
      skills_content_: (p, i) => p[i].name || '',
      skills_content_proficiency_: (p, i) => PROFICIENCY_LEVEL[p[i].level] || ''
    },
    data: skills
  }, {
    block: 'userdefined_',
    subItems: {
      user_project_: (p, i) => p[i].name || '',
      user_time_: (p, i) => periodToString(p[i].period) || '',
      user_position_: (p, i) => p[i].role || '',
      user_describe_: (p, i) => p[i].desc || ''
    },
    data: customized
  }]
}
