<template>
  <div
    @viewdisappear="viewdisappear"
    class="container"
  >
    <textarea
      name="job-content"
      ref="textarea"
      cols="30"
      rows="10"
      class="textarea"
      maxlength="1000"
      :placeholder="SELF_APPRAISAL.PLACEHOLDER"
      :value="value"
      @input="onInput"
    ></textarea>
    <refer-others
      :currentCount="currentCount"
      @showPanel="showPanel"
    ></refer-others>
    <ref-panel
      :top="-40"
      ref="refPanel"
      v-if="showRefPanel"
      :showRIghtSelection="false"
      :picker1Value="jobtitle"
      :placeholder1="placeholder1"
      @pickValue1="pickValue1"
      :fetchData="fetchData"
      @hide="hidePanel"
    ></ref-panel>
    <button-group
      :isEnabled="isEnabled"
      :style="iPhoneXButtonPrefixStyle"
      class="button-group"
      @onComfirm="onComfirm"
      @onCancel="onCancel"
    ></button-group>
    <wxc-popup
      :show="isPickerShow"
      @wxcPopupOverlayClicked="hidePicker"
      pos="bottom"
      :height="height / 2"
    >
      <job-title-picker-overlay
        :onValueChange="onJobtitleChange"
        :overlayStyle="{ top: (height / 2) + 'px'}"
        :height="height / 2"
        :showCustomized="false"
      ></job-title-picker-overlay>
    </wxc-popup>
  </div>
</template>

<script>
import AppHeader from 'components/AppHeader'
import ReferOthers from 'components/ReferOthers'
import RefPanel from 'components/RefPanel'
import ButtonGroup from 'components/common/ButtonGroup'
import { SELF_APPRAISAL, REF } from 'strings'
import localStorage from 'localStorage'
import config, { STORAGE_KEY } from 'config'
import { getPageHeight, setNavigatorTitle, goBack, iPhoneXButtonPrefixStyle } from 'util'
import service from 'service'
import JobTitlePickerOverlay from 'components/JobTitlePickerOverlay.vue'
import { WxcPopup } from 'weex-ui'
import bridge from 'bridge'

let originalData
let shouldSaveData = false
let hasShownRef = false

export default {
  data () {
    return {
      SELF_APPRAISAL,
      currentCount: 0,
      value: '',
      showRefPanel: false,
      jobtitles: [],
      jobtitle: '',
      iPhoneXButtonPrefixStyle,
      height: getPageHeight(),
      isPickerShow: false,
      refValue: {
        career: '',
        industry: '',
        jobTitle: ''
      },
      placeholder1: REF.VISION
    }
  },
  computed: {
    isEnabled () {
      return !!this.value
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = p
        this.value = p
        this.currentCount = p.length
      })
      localStorage.getAllJobs().then(p => {
        this.jobtitles = p
      })
      localStorage.getVision().then(p => {
        if (p && p.industry && p.career && p.jobTitle) {
          this.refValue = {
            industry: p.industry,
            career: p.career,
            jobTitle: p.jobTitle
          }
        }
        p.jobTitle && (this.jobtitle = p.jobTitle)
      })
    })
    setNavigatorTitle(SELF_APPRAISAL.TITLE)
  },
  methods: {
    onInput (e) {
      let { value } = e
      this.currentCount = value.length
      this.value = value
      shouldSaveData = true
    },
    onComfirm () {
      shouldSaveData = false
      this.saveData()
      goBack()
    },
    onCancel () {
      shouldSaveData = false
      this.saveData('')
      goBack()
    },
    viewdisappear () {
      bridge.statistic({
        attributes: {
          reference: +hasShownRef
        }
      })
      if (!shouldSaveData) {
        return
      }
      this.saveData()
    },
    hidePanel () {
      this.showRefPanel = false
    },
    showPanel () {
      if (!this.showRefPanel) {
        this.showRefPanel = true
        hasShownRef = true
        bridge.statistic({
          event: 'SupercvTipsShow',
          attributes: {
            source: 'self'
          }
        })
      } else {
        this.$refs.refPanel.hide()
        bridge.statistic({
          event: 'SuercvSelfTipsSelected',
          attributes: {
            job: this.refValue.jobTitle || 'none'
          }
        })
      }
    },
    onJobtitleChange (e) {
      this.jobtitle = e.jobTitle
      this.refValue = e
      this.hidePicker()
    },
    hidePicker () {
      this.isPickerShow = false
    },
    showPicker () {
      this.isPickerShow = true
    },
    pickValue1 () {
      this.$refs.textarea.blur()
      this.showPicker()
    },
    fetchData (offset, step) {
      let job = this.refValue.jobTitle || ''
      let industry = this.refValue.career || ''
      return service.fetchSelfAppraisal({
        data: {
          zt_id: config.themeId,
          skip: offset,
          limit: step,
          jobtype: this.role,
          industry, // 简历标题树第一层
          career: this.refValue.industry || '', // 简历标题树第二层
          job // 简历标题树第三层
        }
      })
    },
    saveData (data = this.value) {
      if (!this.value) {
        return
      }
      localStorage.setDataByKey(STORAGE_KEY.SELF_APPRAISAL, data, false)
    }
  },
  components: {
    AppHeader, ReferOthers, ButtonGroup,
    RefPanel, JobTitlePickerOverlay, WxcPopup
  }
}
</script>

<style scoped>
.container {
  background-color: #F4F4F4;
}
.textarea {
  background-color: #FFFFFF; border-radius: 2px; height: 349px;
  font-size: 30px; color: #222226; placeholder-color: #B2B2B2;
  padding-top: 28px; padding-right: 30px; padding-left: 30px;
  margin-top: 20px;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
