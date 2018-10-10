// import Proxy from './proxyPolyfill.js'
// var modal = weex.requireModule('modal')

const protocol = 'wpsoffice://'

const mapping = {
  islogin: 'account/is_login',
  isVip: 'account/is_wps_vip',
  isDocerVip: 'account/is_docer_vip',
  showLogin: 'account/show_login',
  showPurchases: 'pay/open_superresume_detail',
  pay: 'pay/superresume_kit',
  download: 'template/download',
  config: 'module_loader/configure', // 配置加载器
  loadModule: 'module_loader/load', // 加载模块s
  unload: 'module_loader/unload', // 卸载模块
  isModuleLoaded: 'module_loader/isload', // 判断是否加载模块
  saveAs: 'documentUI/show_saveAs', // 组件UI模块 - DocumentUI
  fetch: 'http/request', // http request
  pickImage: 'documentUI/show_imagePicker',
  uploadFile: 'documentUI/uploadFile',
  refreshUrl: 'documentUI/refreshKS3Url',
  checkHasBought: 'pay/check_kit',
  openFile: 'documentUI/open_saveAsDocument',
  downloadImage: 'documentUI/downloadFile',
  getUserId: 'account/user_id',
  showLoading: 'utils/open_progress_hud',
  hideLoading: 'utils/close_progress_hud',
  statistic: 'utils/statistic' // 埋点
}

const STATUS_CODE = {
  OK: 0,
  URL_NOT_FOUND: 1001,
  PARAMETER_ERROR: 1002,
  OTHER_ERROR: 1999
}

const resultHandler = (resolve, reject, res, name) => {
  // modal.toast({
  //   message: JSON.stringify(res),
  //   duration: 0.8
  // })
  if (res.code === STATUS_CODE.OK) {
    resolve(res.data)
  } else {
    reject(new Error(`${name} failed, error code -> ${res.code} <-`))
  }
}

const callNative = (url, params) => {
  return new Promise((resolve, reject) => {
    if (typeof wps_native === 'undefined') {
      reject(new Error('wps_native is not defined!'))
      return
    }
    wps_native.handleReq({
      url: `${protocol}${mapping[url]}`,
      params: params || {}
    }, res => resultHandler(resolve, reject, res, mapping[url]))
  })
}

// Proxy is not supported in iOS 9!
const bridge = {}

for (let key in mapping) {
  bridge[key] = params => callNative(key, params)
}

// const bridge = new Proxy({}, {
//   get (target, name) {
//     return params => callNative(name, params)
//   }
// })

/**
 * call native api
 * @example
 *
 * bridge.islogin().then(ret => ret.is_login)
 * bridge.isVip().then(ret => ret.is_wps_vip)
 * bridge.isDocerVip().then(ret => ret.is_docer_vip)
 * bridge.showLogin().then(ret => ret.is_docer_vip)
 * buytype: 0:购买工具包,1:单独购买模板,其他购买失败
 * @param {Object} param
 * bridge.pay(param).then(ret => ret.buytype)
 * status: 0:用户取消下载,1:下载成功,其他为失败 'filePath': "路径"
 * @param {Object} param
 * bridge.download(param)then(ret => ({status: ret.status, filePath: ret.filePath}))
 * bridge.loadModule({module: 'name'}).then(ret => {is_success: ret.is_success})
 */
export default bridge
