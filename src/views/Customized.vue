<template>
  <div
    @viewdisappear="viewdisappear"
    class="container"
  >
    <picker
      :styls="{ marginTop: '20px' }"
      :titleStyls="titleStyls"
      :title="CUSTOMIZED.NAME"
      :isInput="true"
      :value="customized.name"
       @onInput="onInputName"
      :maxLength="30"
      :optional="true"
      :placeholder="optionalText"
    ></picker>
    <picker
      :titleStyls="titleStyls"
      :title="CUSTOMIZED.ROLE"
      :isInput="true"
      :value="customized.role"
       @onInput="onInputRole"
      :maxLength="30"
      :optional="true"
      :placeholder="optionalText"
    ></picker>
    <period-picker
      :titleStyls="titleStyls"
      :title="CUSTOMIZED.PERIOD"
      :defaultStart="customized.period.start"
      :defaultEnd="customized.period.end"
      @value1Change="onStartChange"
      @value2Change="onEndChange"
    ></period-picker>
    <row-title :title="CUSTOMIZED.DESC"></row-title>
    <textarea
      name="job-content"
      ref="textarea"
      cols="30"
      rows="10"
      class="textarea"
      maxlength="1000"
      :placeholder="CUSTOMIZED.PLACEHOLDER"
      @input="onInput"
      :value="customized.desc"
    ></textarea>
    <refer-others
      :currentCount="currentCount"
      :showTips="false"
    ></refer-others>
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
import ReferOthers from 'components/ReferOthers'
import ButtonGroup from 'components/common/ButtonGroup'
import localStorage from 'localStorage'
import strings, { CUSTOMIZED } from 'strings'
import { STORAGE_KEY } from 'config'
import { setNavigatorTitle, goBack, deepCopy, iPhoneXButtonPrefixStyle } from 'util'

let originalData
let shouldSaveData = false

export default {
  data () {
    return {
      CUSTOMIZED,
      optionalText: strings.OPTIONAL,
      titleStyls: {
        width: '150px'
      },
      currentCount: 0,
      customized: {
        id: -1,
        categoryId: 0,
        name: '',
        role: '',
        period: { start: '', end: '' },
        desc: '',
        status: 1
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.customized.name ||
        !!this.customized.role ||
        !!this.customized.period.start ||
        !!this.customized.period.end ||
        !!this.customized.desc
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.customized, p))
        this.currentCount = originalData.desc.length
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(CUSTOMIZED.TITLE)
  },
  methods: {
    onInput (e) {
      let { value } = e
      this.currentCount = value.length
      this.customized.desc = value
      shouldSaveData = true
    },
    onInputName (v) {
      this.customized.name = v
      shouldSaveData = true
    },
    onInputRole (v) {
      this.customized.role = v
      shouldSaveData = true
    },
    onStartChange (v) {
      this.customized.period.start = v
      shouldSaveData = true
    },
    onEndChange (v) {
      this.customized.period.end = v
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
    saveData (data = this.customized) {
      if (!this.isEnabled) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.CUSTOMIZED, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.CUSTOMIZED, this.customized)
    }
  },
  components: {
    AppHeader,
    RowTitle,
    Picker,
    PeriodPicker,
    ButtonGroup,
    ReferOthers
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
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
