<template>
  <div
    @viewdisappear="viewdisappear"
    class="skill"
  >
    <input-with-limit
      :styls="styls"
      :placeholder="SKILL.PLACEHOLDER"
      @onInput="onInput"
      :value="skill.name"
      :maxLength="25"
    ></input-with-limit>
    <proficiency-bar
      :defaultValue="skill.level"
      @onValueChange="onValueChange"
    ></proficiency-bar>
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
import ProficiencyBar from 'components/common/ProficiencyBar'
import InputWithLimit from 'components/common/InputWithLimit'
import ButtonGroup from 'components/common/ButtonGroup'
import localStorage from 'localStorage'
import { STORAGE_KEY } from 'config'
import { SKILL } from 'strings'
import { setNavigatorTitle, goBack, deepCopy, iPhoneXButtonPrefixStyle } from 'util'

let originalData
let shouldSaveData = false

export default {
  data () {
    return {
      SKILL,
      styls: {
        backgroundColor: '#FFFFFF'
      },
      skill: {
        id: -1,
        name: '',
        level: 0,
        status: 1
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.skill.name
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.skill, p))
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(SKILL.TITLE)
  },
  methods: {
    onInput (v) {
      this.skill.name = v
      shouldSaveData = true
    },
    onValueChange (v) {
      this.skill.level = v
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
    saveData (data = this.skill) {
      if (!this.skill.name) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.SKILL, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.SKILL, this.skill)
    }
  },
  components: { AppHeader, ProficiencyBar, InputWithLimit, ButtonGroup }
}
</script>

<style scoped>
.skill {
  background-color: #F4F4F4;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
/* .input {
  background-color: #FFFFFF;
} */
</style>
