<template>
  <div
    :style="iPhoneXPrefix"
    class="preview"
  >
    <officepreview
      class="img"
      ref='wpsimage'
      pagespace="10"
      contentinsetleft = "10"
      contentinsetright = "10"
      :defaultimagesrc = "defaultImg"
      officecomponent = "wps"
      :style="getOfficePreviewStyle"
    ></officepreview>
    <preview-list
      :listData="listData"
      @changeIndex="changeIndex"
      :currentIndex="currentIndex"
    ></preview-list>
    <preview-footer
      @clickCancel="toast"
      @clickComfirm="tryApplyDoc"
      @changeTpl="changeTpl"
      @export="saveAs"
      :finished="finished"
    ></preview-footer>
  </div>
</template>

<script>
import PreviewFooter from 'components/preview/PreviewFooter'
import PreviewList from 'components/preview/PreviewList'
import service from 'service'
import config, { STORAGE_KEY } from 'config'
// import listData from '@/data/tpls.json'
// import { mapState } from 'vuex'

import wpsCore from '@/core'
import bridge from 'bridge'
import { download } from '@/api/downloadManager.js'
import localStorage from 'localStorage'
import { queryUrlStr, iPhoneXPrefix, getPageHeight, isIPhoneX, checkHasBought, getThemeInfo } from 'util'

const modal = weex.requireModule('modal')
const initMapping = [
  'basicInfo', 'career', 'education',
  'careerBackground', 'association', 'experience',
  'qualifications', 'skills', 'hobbies', 'selfAppraisal'
]
let info = {}

export default {
  data () {
    return {
      listData: [],
      finished: false,
      currentIndex: 0,
      downloadInProgress: false,
      filePath: '',
      iPhoneXPrefix: iPhoneXPrefix(),
      showActiveDocument: false,
      showPreviewList: true,
      customizedNameArray: [],
      currentFilePath: '',
      exportInProgress: false
    }
  },
  computed: {
    // ...mapState('profile', [
    //   'basicInfo', 'career', 'selfAppraisal'
    // ]),
    defaultImg () {
      if (this.showActiveDocument) {
        return ''
      }
      let item = this.listData[this.currentIndex]
      if (!item) {
        return ''
      }
      return item.thumb_big_url || ''
    },
    getOfficePreviewStyle () {
      let height = getPageHeight() - (isIPhoneX() ? 68 : 0) - 88 -84 - (this.showPreviewList ? 202 : 0)
      return {
        height: `${height}px`,
        width: '750px'
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.genCustomizedName()
      service
        .fetchResumes({
          data: {
            zt_id: config.themeId,
            mb_platform: config.platform,
            file_type: config.fileType
          }
        })
        .then(p => {
          this.listData = p.data
          let templateId = queryUrlStr('template_id')
          if (templateId) {
            let index = p.data.findIndex(p => +p.mb_id === +templateId)
            if (!~index) {
              index = 0
            }
            this.currentIndex = index
          }
          this.$refs.wpsimage.reload()
          // this.tryApplyDoc()
        })
        .catch(e => {
          console.log(JSON.stringify(e))
        })
    })
  },
  destroyed () {
    wpsCore.close()
  },
  methods: {
    genCustomizedName () {
      return new Promise((resolve, reject) => {
        localStorage.getDataByKey(STORAGE_KEY.CUSTOMIZED_CATEGORY).then(p => {
          if (p && Array.isArray(p)) {
            this.customizedNameArray = p.map(q => q.name)
            resolve('ok')
          }
          resolve('ok')
        })
      })
    },
    renderTpl () {
      return new Promise((resolve, reject) => {
        if (this.currentFilePath) {
          wpsCore.getActiveDocument(this.currentFilePath)
          this.genCustomizedName().then(() => {
            this.applyTpl().then(() => {
              resolve('ok')
            })
          })
        } else {
          reject('not ready')
        }
      })
    },
    showDialogByName (name) {
      this.$emit('showDialog', name)
    },
    tryApplyDoc () {
      this.checkHasBasicInfo().then(() => {
        return this.downloadTpl()
      }).then(() => {
        this.renderTpl()
      })
    },
    toast (param = {}) {
      this.$emit('toast', {
        show: param.show,
        text: param.text || ''
      })
    },
    changeTpl () {
      this.finished = false
      this.showActiveDocument = false
      // this.showPreviewList = true
      this.currentFilePath = ''
      wpsCore.close()
    },
    downloadTpl () {
      return new Promise((resolve, reject) => {
        if (this.downloadInProgress) {
          reject('busy')
          return
        }
        this.downloadInProgress = true
        setTimeout(() => {
          this.downloadInProgress = false
        }, 1000)
        download(this.listData[this.currentIndex]).then(p => {
          this.downloadInProgress = false
          if (p.filePath) {
            this.currentFilePath = p.filePath
            resolve(p.filePath)
            // this.renderTpl()
          }
          reject('download failed')
        })
        .catch(e => {
          this.downloadInProgress = false
          reject(e)
        })
      })
    },
    applyTpl () {
      // TODO: buggie
      // this.showPreviewList = false
      bridge.showLoading()
      this.finished = true
      return new Promise((resolve, reject) => {
        Promise.all([
          wpsCore.replaceBookmarkBlock({
            customizedName: this.customizedNameArray[0] || 'default'
          }),
          wpsCore.addAllBookmarkBlock()
        ]).then(() => {
          this.showActiveDocument = true
          bridge.hideLoading()
          this.$nextTick(() => {
            this.$refs.wpsimage.reload()
            resolve('ok')
          })
        }).catch(e => {
          bridge.hideLoading()
          reject(e)
        })
      })
    },
    saveAs () {
      if (this.exportInProgress) {
        return
      }
      this.checkHasBasicInfo().then(() => {
        if (!this.showActiveDocument) {
          this.downloadTpl().then(() => {
            return this.renderTpl()
          }).then(() => {
            this.tryExportFile()
          })
        } else {
          this.tryExportFile()
        }
      }).catch(() => {
        this.showDialogByName('editPrompt')
      })
    },
    tryExportFile () {
      this.checkHasBasicInfo().then(() => {
        this.exportFile()
      }).catch(() => {
        this.showDialogByName('editPrompt')
      })
      setTimeout(() => {
        this.exportInProgress = false
      }, 1000)
    },
    exportFile () {
      let isPurchased = false
      this.exportInProgress = true
      checkHasBought().then(p => {
        isPurchased = p.bought
        return getThemeInfo()
      }).then(themeInfo => {
        let template = (this.listData[this.currentIndex] || {}).mb_id
        bridge.statistic({
          event: 'SupercvExportCk',
          attributes: {
            template
          }
        })
        return bridge.saveAs({
          path: '',
          isPurchased: isPurchased,
          categoryParams: {
            template_id: themeInfo.zt_id,
            originalPrice: Math.round(themeInfo.price / 100),
            price: Math.round((themeInfo.price * +themeInfo.discount) / 100)
          }
        })
      })
      .then(p => {
        // wpsCore.close()
        this.filePath = p.path
        this.$emit('showDialog', 'exportSuccessfully')
      })
    },
    changeIndex (index) {
      this.currentIndex = index
      this.changeTpl()
      this.tryApplyDoc()
    },
    openFile () {
      wpsCore.close()
      bridge.openFile({
        path: this.filePath
      })
    },
    checkHasBasicInfo () {
      return this.getallData().then(() => {
        return new Promise((resolve, reject) => {
          let {
            basicInfo = { name: '' },
            career = {},
            education = [],
            careerBackground = [],
            association = [],
            experience = [],
            qualifications = [],
            skills = [],
            hobbies = [],
            selfAppraisal = ''
          } = info
          let status = Object.keys(basicInfo)
            .map(p => (basicInfo[p] && basicInfo.hasOwnProperty(p)) && p !== 'localPath' ? 1 : 0)
            .reduce((p, q) => p + q) * 2 +
            (career.objective && career.city && career.salary ? 10 : 0) +
            (education.length > 0 ? 10 : 0) +
            (careerBackground.length > 0 ? 20 : 0) +
            (association.length > 0 ? 15 : 0) +
            (experience.length > 0 ? 10 : 0) +
            (qualifications.length > 0 ? 2 : 0) +
            (skills.length > 0 ? 2 : 0) +
            (hobbies.length > 0 ? 2 : 0) +
            (selfAppraisal.length > 0 ? 13 : 0)
          if (status > 0) {
            resolve('ok')
          } else {
            reject('not ok')
          }
        })
      })
      // return new Promise((resolve, reject) => {
      //   localStorage.getDataByKey(STORAGE_KEY.BASIC_INFO).then(p => {
      //     if (!p || !p.name) {
      //       reject('not ok')
      //     } else {
      //       resolve('ok')
      //     }
      //   })
      // })
    },
    getallData () {
      let promiseList = []
      initMapping.forEach(p => {
        promiseList.push(localStorage.getDataByKey(p).then(data => {
          info[p] = data
          return new Promise((resolve, reject) => {
            resolve('ok')
          })
        }))
      })
      return Promise.all(promiseList)
    }
  },
  components: { PreviewFooter, PreviewList }
}
</script>

<style scoped>
.preview {
  flex: 1; width: 750px; align-items: center; background: #FFFFFF;
}
.img {
  height: 1061px;
  width: 750px;
}
</style>
