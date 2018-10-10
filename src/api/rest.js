import config, { requestType } from 'config'

const baseUrl = `${config.protocol}://rh.docer.wps.cn/wppv3/rh`
const resumeUrl = `${config.protocol}://docer.wps.cn/v3.php`

export default [{
  name: 'fetchJobTitle',
  url: `${baseUrl}/fetch/jobtree`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchResumes',
  url: `${resumeUrl}/resume/api/zhuanti/v1/index/mbs`,
  method: requestType.GET,
  dataType: 'json'
}, {
  name: 'updateResume',
  url: `${baseUrl}/update/resume`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchUserInfo',
  url: `${baseUrl}/fetch/resume`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchThemeInfo',
  url: `${resumeUrl}/resume/api/zhuanti/v1/index/details`,
  method: requestType.GET,
  dataType: 'json'
}, {
  name: 'fetchAssociation',
  url: `${baseUrl}/fetch/schoolexp`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchSelfAppraisal',
  url: `${baseUrl}/fetch/selfevaluation`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchProjectExp',
  url: `${baseUrl}/fetch/projectexp`,
  method: requestType.POST,
  dataType: 'json'
}, {
  name: 'fetchCareerExp',
  url: `${baseUrl}/fetch/workexp`,
  method: requestType.POST,
  dataType: 'json'
}]
