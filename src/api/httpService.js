import { fetch } from './fetch.js'
import { defaultHandler } from './responseHandler.js'
import { requestType } from 'config'

export default class HttpService {
  constructor (option) {
    this.option = option
    return param => {
      return this.send(param)
    }
  }

  // fetch data
  send (params) {
    let { method = requestType.POST, url } = this.option
    return new Promise((resolve, reject) => {
      fetch({
        method,
        url,
        params: params.data || {}
      }).then(function (resp) {
        defaultHandler(resp, resolve, reject)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  }
}
