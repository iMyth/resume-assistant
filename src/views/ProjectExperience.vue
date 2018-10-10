<template>
  <div
    @viewdisappear="viewdisappear"
    class="container"
  >
    <scroller :style="scrollerStyle" class="scroller">
      <picker
        ref="title"
        :styls="{ marginTop: '20px' }"
        :titleStyls="titleStyls"
        :title="PROJECT_EXPERIENCE.NAME"
        :isInput="true"
        :value="experience.name"
        @onInput="onNameChange"
        :maxLength="30"
      ></picker>
      <picker
        :titleStyls="titleStyls"
        :title="PROJECT_EXPERIENCE.CATEGORY"
        :value="experience.category"
        @pickeValue="chooseCategory"
        @clearValue="clearByKey('category')"
      ></picker>
      <picker
        :titleStyls="titleStyls"
        :title="PROJECT_EXPERIENCE.ROLE"
        :isInput="true"
        :value="experience.role"
        @onInput="onRoleChange"
        :maxLength="30"
      ></picker>
      <period-picker
        :titleStyls="titleStyls"
        :title="PROJECT_EXPERIENCE.PERIOD"
        :defaultStart="experience.period.start"
        :defaultEnd="experience.period.end"
        @value1Change="onStartChange"
        @value2Change="onEndChange"
      ></period-picker>
      <row-title :title="PROJECT_EXPERIENCE.CONTENT"></row-title>
      <textarea
        name="job-content"
        ref="textarea"
        cols="30"
        rows="10"
        class="textarea"
        maxlength="1000"
        :placeholder="PROJECT_EXPERIENCE.PLACEHOLDER"
        @input="onInput"
        :value="experience.content"
        @focus="onFocus"
      ></textarea>
      <refer-others
        :currentCount="currentCount"
        @showPanel="showPanel"
      ></refer-others>
      <not-show
        @change="onchange"
        :checked="!experience.status"
      ></not-show>
      <ref-panel
        ref="refPanel"
        v-if="showRefPanel"
        :picker1Value="category"
        :picker2Value="role"
        :placeholder1="placeholder1"
        :placeholder2="placeholder2"
        @pickValue1="pickValue1"
        @pickValue2="pickValue2"
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
import { PROJECT_EXPERIENCE, JOB_CLASS, REF } from 'strings'
import { setNavigatorTitle, goBack, isIPhoneX, deepCopy, iPhoneXButtonPrefixStyle } from 'util'
import localStorage from 'localStorage'
import config, { STORAGE_KEY } from 'config'
import * as picker from '@/api/picker.js'
import service from 'service'
import bridge from 'bridge'

const dom = weex.requireModule('dom')
const characterMapping = [
  'exc', // 执行类
  'lead', // 统筹管理类
  'design', // 设计/产品/策划类
  'opr', // 运营类
  'fin', // 财务类
  'bd', // 商务类
  'pr', // 公关类
  'mkt' // 市场类
]

let jobclass = 'none'
let originalData
let shouldSaveData = false
let hasShownRef = false
let vision = {
  industry: '',
  career: '',
  jobTitle: ''
}

export default {
  data () {
    return {
      PROJECT_EXPERIENCE,
      titleStyls: {
        width: '150px'
      },
      scrollerStyle: {
        bottom: isIPhoneX() ? '196px' : '128px'
      },
      currentCount: 0,
      experience: {
        id: -1,
        name: '',
        category: '',
        role: '',
        period: { start: '', end: '' },
        content: '',
        status: 1
      },
      showRefPanel: false,
      categories: [],
      roles: JOB_CLASS,
      category: '',
      role: '',
      iPhoneXButtonPrefixStyle,
      placeholder1: REF.CATEGORY,
      placeholder2: REF.ROLE
    }
  },
  computed: {
    isEnabled () {
      return !!this.experience.name
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.experience, p))
        this.currentCount = originalData.content.length
        localStorage.removeParameters()
      })
      localStorage.getAllCareers().then(p => {
        this.categories = p
      })
      localStorage.getVision().then(p => {
        Object.assign(vision, p)
      })
    })
    setNavigatorTitle(PROJECT_EXPERIENCE.TITLE)
  },
  methods: {
    clearByKey (key) {
      this.experience[key] = ''
    },
    onchange (e) {
      let { value } = e
      this.experience.status = value ? 0 : 1
      shouldSaveData = true
    },
    onInput (e) {
      let { value } = e
      this.currentCount = value.length
      this.experience.content = value
      shouldSaveData = true
    },
    onFocus () {
      if (!this.showRefPanel) {
        dom.scrollToElement(this.$refs.title, { offset: 110 })
      }
      this.showRefPanel = true
    },
    onNameChange (v) {
      this.experience.name = v
      shouldSaveData = true
    },
    onRoleChange (v) {
      this.experience.role = v
      shouldSaveData = true
    },
    onStartChange (v) {
      this.experience.period.start = v
      shouldSaveData = true
    },
    onEndChange (v) {
      this.experience.period.end = v
      shouldSaveData = true
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
        dom.scrollToElement(this.$refs.textarea, { offset: -80 })
        bridge.statistic({
          event: 'SupercvTipsShow',
          attributes: {
            source: 'proj'
          }
        })
      } else {
        dom.scrollToElement(this.$refs.title, { offset: -20 })
        this.$refs.refPanel.hide()
        let industry = this.category || vision.career
        bridge.statistic({
          event: 'SupercvProjTipsSelected',
          attributes: {
            industry: industry || 'none',
            character: jobclass
          }
        })
      }
    },
    chooseCategory () {
      localStorage.getAllCareers().then(opt => {
        picker.pick({
          index: 0,
          items: opt,
          title: PROJECT_EXPERIENCE.CATEGORY
        }).then(value => {
          this.experience.category = opt[value]
          shouldSaveData = true
        })
      })
    },
    pickValue1 () {
      picker.pick({
        index: 0,
        items: this.categories,
        title: ''
      }).then(value => {
        this.category = this.categories[value]
      })
    },
    pickValue2 () {
      picker.pick({
        index: 0,
        items: this.roles,
        title: ''
      }).then(value => {
        this.role = this.roles[value]
        jobclass = characterMapping[value] || 'none'
      })
    },
    fetchData (offset, step) {
      let industry = this.category || vision.career
      return service.fetchProjectExp({
        data: {
          zt_id: config.themeId,
          skip: offset,
          limit: step,
          industry,
          jobclass: this.role
        }
      })
    },
    saveData (data = this.experience) {
      if (!this.experience.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.PROJECT_EXPERIENCE, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.PROJECT_EXPERIENCE, this.experience)
    }
  },
  components: {
    AppHeader, RowTitle, Picker, PeriodPicker,
    NotShow, ReferOthers, ButtonGroup, RefPanel
  }
}
</script>

<style scoped>
.container {
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
