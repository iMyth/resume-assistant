<template>
  <div
    @viewdisappear="viewdisappear"
    class="container"
  >
    <picker
      :styls="{ marginTop: '20px' }"
      :titleStyls="titleStyls"
      :inputStyle="inputStyle"
      :title="QUALIFICATIONS.NAME"
      :isInput="true"
      :maxLength="25"
      :value="qualifications.name"
       @onInput="onInput"
    ></picker>
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
import ButtonGroup from 'components/common/ButtonGroup'
import { QUALIFICATIONS } from 'strings'
import localStorage from 'localStorage'
import * as picker from '@/api/picker.js'
import { STORAGE_KEY } from 'config'
import { setNavigatorTitle, goBack, deepCopy, iPhoneXButtonPrefixStyle } from 'util'

let originalData
let shouldSaveData = false

export default {
  data () {
    return {
      QUALIFICATIONS,
      titleStyls: {
        width: '180px'
      },
      inputStyle: {
        width: '540px',
        marginRight: '-30px',
        marginTop: '0',
        marginBottom: '0'
      },
      qualifications: {
        id: -1,
        name: '',
        date: '',
        status: 1
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.qualifications.name
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.qualifications, p))
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(QUALIFICATIONS.TITLE)
  },
  methods: {
    onInput (v) {
      this.qualifications.name = v
      shouldSaveData = true
    },
    pickerDate () {
      picker.pickDate().then(value => {
        this.qualifications.date = value
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
    viewdisappear () {
      if (!shouldSaveData) {
        return
      }
      this.saveData()
    },
    saveData (data = this.qualifications) {
      if (!this.qualifications.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.QUALIFICATIONS, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.QUALIFICATIONS, this.qualifications)
    }
  },
  components: { AppHeader, Picker, ButtonGroup }
}
</script>

<style scoped>
.container {
  background-color: #F4F4F4;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
