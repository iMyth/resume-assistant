<template>
  <div
    @viewdisappear="viewdisappear"
    class="education-background"
  >
    <picker
       :titleStyls="titleStyls"
       :styls="{ marginTop: '20px' }"
       :title="EDUCATION_BACKGROUND.SCHOOL_NAME"
       :isInput="true"
       :value="education.name"
       @onInput="onInput"
    ></picker>
    <picker
      :titleStyls="titleStyls"
      :title="EDUCATION_BACKGROUND.MAJOR"
      :isInput="true"
      :value="education.major"
      @onInput="onInputMajor"
      :placeholder="optionalText"
    ></picker>
    <picker
      :titleStyls="titleStyls"
      :title="EDUCATION_BACKGROUND.DEGREE"
      :value="education.degree"
      @pickeValue="pickerDegree"
      @clearValue="clearByKey('degree')"
    ></picker>
    <period-picker
      :titleStyls="titleStyls"
      :title="EDUCATION_BACKGROUND.PERIOD"
      :defaultStart="education.period.start"
      :defaultEnd="education.period.end"
      @value1Change="onStartChange"
      @value2Change="onEndChange"
    ></period-picker>
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
import ButtonGroup from 'components/common/ButtonGroup'
import strings, { EDUCATION_BACKGROUND, DEGREE } from 'strings'
import { setNavigatorTitle, goBack, deepCopy, iPhoneXButtonPrefixStyle } from 'util'
import { STORAGE_KEY } from 'config'
import localStorage from 'localStorage'
import * as picker from '@/api/picker.js'

let originalData
let shouldSaveData = false

export default {
  data () {
    return {
      EDUCATION_BACKGROUND,
      optionalText: strings.OPTIONAL,
      titleStyls: {
        width: '150px'
      },
      education: {
        id: -1,
        name: '',
        major: '',
        degree: '',
        period: { start: '', end: '' },
        status: 1
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.education.name
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.education, p))
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(EDUCATION_BACKGROUND.TITLE)
  },
  methods: {
    clearByKey (key) {
      this.education[key] = ''
    },
    onInput (v) {
      this.education.name = v
      shouldSaveData = true
    },
    onInputMajor (v) {
      this.education.major = v
      shouldSaveData = true
    },
    onStartChange (v) {
      this.education.period.start = v
      shouldSaveData = true
    },
    onEndChange (v) {
      this.education.period.end = v
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
      if (!shouldSaveData) {
        return
      }
      this.saveData()
    },
    pickerDegree () {
      picker.pick({
        index: 4,
        items: DEGREE,
        title: EDUCATION_BACKGROUND.DEGREE
      }).then(value => {
        this.education.degree = DEGREE[value]
        shouldSaveData = true
      })
    },
    saveData (data = this.education) {
      if (!this.education.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.EDUCATION_BACKGROUND, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.EDUCATION_BACKGROUND, this.education)
    }
  },
  components: { AppHeader, Picker, PeriodPicker, ButtonGroup }
}
</script>

<style scoped>
.education-background {
  background-color: #F4F4F4;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
