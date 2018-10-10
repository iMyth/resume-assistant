<template>
  <div
    class="container"
    @viewdisappear="viewdisappear"
  >
    <input-with-limit
      :styls="{ marginTop: '20px', backgroundColor: '#FFFFFF' }"
      :placeholder="HOBBIES.PLACEHOLDER"
      :value="hobbies.name"
       @onInput="onInput"
       :maxLength="25"
    ></input-with-limit>
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
import InputWithLimit from 'components/common/InputWithLimit'
import ButtonGroup from 'components/common/ButtonGroup'
import localStorage from 'localStorage'
import { HOBBIES } from 'strings'
import { STORAGE_KEY } from 'config'
import { setNavigatorTitle, goBack, deepCopy, iPhoneXButtonPrefixStyle } from 'util'

let originalData
let shouldSaveData = false

export default {
  data () {
    return {
      HOBBIES,
      hobbies: {
        id: -1,
        name: '',
        status: 1
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.hobbies.name
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.hobbies, p))
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(HOBBIES.TITLE)
  },
  methods: {
    onInput (v) {
      this.hobbies.name = v
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
    saveData (data = this.hobbies) {
      if (!this.hobbies.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.HOBBIES, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.HOBBIES, this.hobbies)
    }
  },
  components: { AppHeader, InputWithLimit, ButtonGroup }
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
