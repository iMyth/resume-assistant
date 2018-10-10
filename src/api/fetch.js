import bridge from 'bridge'
import { requestType } from 'config'
import { objToQuery } from 'util'
const stream = weex.requireModule('stream')
const defaultOptions = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}
export function fetch (param) {
  return new Promise((resolve, reject) => {
    if (WXEnvironment.platform !== 'Web') {
      if (param.method === requestType.GET && param && param.params) {
        param.url += objToQuery(param.params)
      }
      bridge.fetch(param).then(response => {
        if (response.result === 'ok') {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(e => {
        console.error('bridge.fetch error ===============>', e)
      })
    } else {
      if (param.method === requestType.GET && param && param.params) {
        param.url += objToQuery(param.params)
      }
      if (param.method === requestType.POST) {
        param.body = JSON.stringify(Object.assign({
          'protocolVersion': '1.0',
          'appId': 'wps_pc',
          'clientVersion': '10.1.0.6749',
          'wps_sid': 'V02SEE37deZ6mJLlbdtRktU314OPyFQ00adb5192000e3b73d7'
        }, param.params))
      }
      stream.fetch(Object.assign({}, defaultOptions, param), response => {
        if (response.ok) {
          resolve(response.data)
        } else {
          reject(response)
        }
      }, () => {})
    }
  })
}
