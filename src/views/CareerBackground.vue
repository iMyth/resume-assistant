<template>
  <div
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
    :style="containerStyle"
    class="career-background"
  >
    <scroller :style="scrollerStyle" class="scroller">
      <picker
        ref="title"
        :titleStyls="titleStyls"
        :styls="{ marginTop: '20px' }"
        :title="CAREER_BACKGROUND.COMPANY_NAME"
        :isInput="true"
        :value="careerBackground.name"
        @onInput="onNameChange"
      ></picker>
      <picker
        :titleStyls="titleStyls"
        :title="CAREER_BACKGROUND.POSITION"
        @pickeValue="pickJobtitle()"
        @clearValue="clearByKey('position')"
        :value="careerBackground.position"
      ></picker>
      <period-picker
        :titleStyls="titleStyls"
        :title="CAREER_BACKGROUND.SERVICE_PERIOD"
        :defaultStart="careerBackground.period.start"
        :defaultEnd="careerBackground.period.end"
        @value1Change="onStartChange"
        @value2Change="onEndChange"
      ></period-picker>
      <picker
        :titleStyls="titleStyls"
        :title="CAREER_BACKGROUND.JOB_SPECIFICATION"
        @pickeValue="pickerSpecification"
        @clearValue="clearByKey('specification')"
        :value="careerBackground.specification"
        :optional="true"
        :placeholder="optionalText"
      ></picker>
      <row-title :title="CAREER_BACKGROUND.JOB_CONTENT"></row-title>
      <textarea
        name="job-content"
        ref="textarea"
        cols="30"
        rows="10"
        class="textarea"
        maxlength="1000"
        :placeholder="CAREER_BACKGROUND.PLACEHOLDER"
        @input="onInput"
        @focus="onFocus"
        :value="careerBackground.content"
      ></textarea>
      <refer-others
        :currentCount="currentCount"
        @showPanel="showPanel"
      ></refer-others>
      <not-show
        @change="onchange"
        :checked="!careerBackground.status"
      ></not-show>
      <ref-panel
        ref="refPanel"
        v-if="showRefPanel"
        :picker1Value="category"
        :placeholder1="placeholder1"
        :picker2Value="role"
        @pickValue1="pickValue1"
        @pickValue2="pickValue2"
        :placeholder2="placeholder2"
        :fetchData="fetchData"
        @hide="hidePanel"
      ></ref-panel>
    </scroller>
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
import Picker from 'components/common/Picker'
import PeriodPicker from 'components/common/PeriodPicker'
import RowTitle from 'components/RowTitle'
import NotShow from 'components/NotShow'
import ReferOthers from 'components/ReferOthers'
import RefPanel from 'components/RefPanel'
import ButtonGroup from 'components/common/ButtonGroup'
import strings, { CAREER_BACKGROUND, JOB_CATEGORY, REF } from 'strings'
import { PROFILE } from 'icons'
import { getPageHeight, setNavigatorTitle, goBack, isIPhoneX, deepCopy, iPhoneXButtonPrefixStyle } from 'util'
import localStorage from 'localStorage'
import * as picker from '@/api/picker.js'
import config, { STORAGE_KEY, VIEWS } from 'config'
import service from 'service'
import JobTitlePickerOverlay from 'components/JobTitlePickerOverlay.vue'
import { WxcPopup } from 'weex-ui'
import bridge from 'bridge'

const Navigator = weex.requireModule('navigator')

const dom = weex.requireModule('dom')

const characterMapping = [ 'none', 'full', 'intern' ]

let originalData = {}
let shouldSaveData = false
let vision = {
  industry: '',
  career: '',
  jobTitle: ''
}
let hasShownRef = false

export default {
  data () {
    return {
      CAREER_BACKGROUND,
      optionalText: strings.OPTIONAL,
      height: getPageHeight(),
      scrollerStyle: {
        // height: `${getPageHeight()}px`
        bottom: isIPhoneX() ? '196px' : '128px'
      },
      titleStyls: {
        width: '150px'
      },
      isPickerShow: false,
      currentCount: 0,
      showIcon: PROFILE.SHOW,
      careerBackground: {
        id: -1,
        name: '',
        position: '',
        period: { start: '', end: '' },
        specification: '',
        content: '',
        status: 1
      },
      showRefPanel: false,
      categories: [],
      roles: [ CAREER_BACKGROUND.FULL_TIME, CAREER_BACKGROUND.INTERNSHIP ],
      category: '',
      refValue: {
        career: '',
        industry: '',
        jobTitle: ''
      },
      jobTitleId: 1,
      role: '',
      placeholder1: REF.CHOOSE_TITLE,
      placeholder2: REF.JOBTYPE,
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.careerBackground.name
    },
    containerStyle () {
      return {
        height: `${getPageHeight()}px`
      }
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        if (typeof p !== 'object') {
          return
        }
        originalData = deepCopy(Object.assign(this.careerBackground, p))
        this.currentCount = originalData.content.length
        localStorage.removeParameters()
      })
      localStorage.getAllJobs().then(p => {
        this.categories = p
        // this.category = this.categories[0]
      })
      localStorage.getVision().then(p => {
        Object.assign(vision, p)
      })
    })
    setNavigatorTitle(CAREER_BACKGROUND.TITLE)
  },
  methods: {
    initVision () {
      localStorage.getParameters().then(p => {
        if (!p || typeof p !== 'string') {
          return
        }
        this.careerBackground.position = p
        localStorage.removeParameters()
      })
    },
    clearByKey (key) {
      this.careerBackground[key] = ''
    },
    viewappear () {
      this.initVision()
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
    onInput (e) {
      let { value } = e
      this.currentCount = value.length
      this.careerBackground.content = value
      shouldSaveData = true
    },
    onFocus () {
      if (!this.showRefPanel) {
        dom.scrollToElement(this.$refs.title, { offset: 110 })
      }
      this.showRefPanel = true
    },
    onchange (e) {
      this.careerBackground.status = e.value ? 0 : 1
      shouldSaveData = true
    },
    onNameChange (v) {
      this.careerBackground.name = v
      shouldSaveData = true
    },
    onStartChange (v) {
      this.careerBackground.period.start = v
      shouldSaveData = true
    },
    onEndChange (v) {
      this.careerBackground.period.end = v
      shouldSaveData = true
    },
    pickerSpecification () {
      picker.pick({
        index: 0,
        items: JOB_CATEGORY,
        title: CAREER_BACKGROUND.JOB_SPECIFICATION
      }).then(value => {
        this.careerBackground.specification = JOB_CATEGORY[value]
        shouldSaveData = true
      })
    },
    onComfirm () {
      shouldSaveData = false
      this.saveData()
      goBack()
    },
    onCancel () {
      shouldSaveData = false
      this.deleteRecord()
      goBack()
    },
    hidePanel () {
      this.showRefPanel = false
    },
    showPanel () {
      if (!this.showRefPanel) {
        this.showRefPanel = true
        hasShownRef = true
        dom.scrollToElement(this.$refs.textarea, { offset: -80 })
        bridge.statistic({
          event: 'SupercvTipsShow',
          attributes: {
            source: 'work'
          }
        })
      } else {
        dom.scrollToElement(this.$refs.title, { offset: -20 })
        this.$refs.refPanel.hide()
        let job = this.category || vision.jobTitle|| 'none'
        let industry = this.refValue.career || vision.career || 'none'
        bridge.statistic({
          event: 'SupercvWorkTipsSelected',
          attributes: {
            job ,
            character: characterMapping[this.jobTitleId] || 'none',
            industry
          }
        })
      }
    },
    pickJobtitle () {
      this.$push('choosetitle')
    },
    onJobtitleChange (e) {
      this.category = e.jobTitle
      this.refValue = e
      this.hidePicker()
      shouldSaveData = false
    },
    $push (view) {
      if (WXEnvironment.platform === 'Web') {
        this.$router.push(view)
      } else {
        Navigator.push({
          url: config.baseUrl + VIEWS[view],
          animated: 'true'
        }, e => console.log(e))
      }
    },
    pickValue1 () {
      // picker.pick({ index: 0, items: this.categories }).then(value => {
      //   this.category = this.categories[value]
      // })
      this.$refs.textarea.blur()
      this.showPicker()
    },
    pickValue2 () {
      picker.pick({
        index: 0,
        items: this.roles,
        title: ''
      }).then(value => {
        this.role = this.roles[value]
        this.jobTitleId = value + 1
      })
    },
    fetchData (offset, step) {
      let job = this.category || vision.jobTitle
      let industry = this.refValue.career || vision.career
      bridge.statistic({
        event: 'SupercvWorkTipsSelected',
        attributes: {
          job: job || 'none',
          character: characterMapping[this.jobTitleId] || 'none',
          industry: industry || 'none'
        }
      })
      return service.fetchCareerExp({
        data: {
          zt_id: config.themeId,
          skip: offset,
          limit: step,
          jobtype: this.jobTitleId,
          industry, // 简历标题树第一层
          career: this.refValue.industry || vision.industry, // 简历标题树第二层
          job // 简历标题树第三层
        }
      })
    },
    hidePicker () {
      this.isPickerShow = false
    },
    showPicker () {
      this.isPickerShow = true
    },
    saveData (data = this.careerBackground) {
      if (!this.careerBackground.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.CAREER_BACKGROUND, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.CAREER_BACKGROUND, this.careerBackground)
    }
  },
  components: {
    AppHeader, Picker, PeriodPicker,
    ReferOthers, ButtonGroup, RowTitle,
    NotShow, RefPanel, WxcPopup, JobTitlePickerOverlay
  }
}
</script>

<style scoped>
.career-background {
  flex: 1; width: 750px; background-color: #F4F4F4;
}
.scroller {
  position: absolute; top: 0; bottom: 128px; left: 0; right: 0;
}
.textarea {
  background-color: #FFFFFF; border-radius: 2px; height: 349px;
  font-size: 30px; color: #222226; placeholder-color: #B2B2B2;
  padding-top: 28px; padding-right: 30px; padding-left: 30px;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
