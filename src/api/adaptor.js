import { requestType } from './config.js'

export function adaptor (method, param) {
  if (method === requestType.POST) {
    param.bRawData = 1
    if (param.dataType === 'application/x-www-form-urlencoded') {
      param.data = Object.keys(param.data).map(key => {
        return key + '=' + encodeURIComponent(param.data[key])
      }).join('&')
    }
    if (typeof param.data === 'object') {
      param.data = JSON.stringify(param.data)
    }
    return param
  }
  if (param.data) {
    let queryString = (~param.url.indexOf('?') ? '&' : '?') +
    Object.keys(param.data).map(key => {
      return key + '=' +
        encodeURIComponent(param.data[key])
    }).join('&')
    param.url += queryString
  }
  return param
}
