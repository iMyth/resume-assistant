import urls from './rest.js'
import HttpService from './httpService.js'

class ServiceFactory {
  constructor (apis) {
    this.services = {}
    apis.forEach(api => {
      this.services[api.name] = this.getService(api)
    })
  }
  getService (param) {
    // only 'http' is supported currently
    return new HttpService(param)
  }
  getInstance () {
    return this.services
  }
}

const service = new ServiceFactory(urls)
export default service.getInstance()
