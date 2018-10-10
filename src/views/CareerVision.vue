<template>
  <div
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
    class="career-vision"
  >
    <picker
      :styls="{ marginTop: '20px' }"
      :title="CAREER.CAREER_OBJECTIVE"
      :value="career.objective"
      @pickeValue="pickJobtitle()"
      @clearValue="clearByKey('objective')"
    ></picker>
    <picker
      :title="CAREER.JOB_TYPE"
      :value="career.type"
      @pickeValue="pickJobType"
      @clearValue="clearByKey('type')"
    ></picker>
    <picker
      @pickeValue="pickCity()"
      :value="career.city"
      :title="CAREER.WORK_CITY"
      :placeholder="optionalText"
      :optional="true"
      @clearValue="clearByKey('city')"
    ></picker>
    <picker
      :title="CAREER.SALARY_REQUIREMENTS"
      @pickeValue="pickSalary()"
      :value="career.salary"
      :placeholder="optionalText"
      :optional="true"
      @clearValue="clearByKey('salary')"
    ></picker>
    <button-group
      :isEnabled="isEnabled"
      :style="iPhoneXButtonPrefixStyle"
      class="button-group"
      @onComfirm="saveCareerVision"
      @onCancel="deleteRecord"
    ></button-group>
    <!-- <button-bar
      :isEnabled="isEnabled"
      :style="iPhoneXButtonPrefixStyle"
      @buttonClick="saveCareerVision"
      :name="buttonText"
    ></button-bar> -->
  </div>
</template>

<script>
import AppHeader from 'components/AppHeader.vue'
import Picker from 'components/common/Picker.vue'
// import ButtonBar from 'components/common/ButtonBar.vue'
import ButtonGroup from 'components/common/ButtonGroup'
import strings, { CAREER, JOB_TYPE, SALARY_REQUIREMENTS } from 'strings'
import localStorage from 'localStorage'
import config, { STORAGE_KEY, VIEWS } from 'config'
import { setNavigatorTitle, goBack, iPhoneXButtonPrefixStyle } from 'util'

import * as picker from '@/api/picker.js'
const Navigator = weex.requireModule('navigator')
let shouldSaveData = false

export default {
  data () {
    return {
      CAREER,
      buttonText: strings.SAVE,
      optionalText: strings.OPTIONAL,
      career: {
        objective: '',
        type: '',
        city: '',
        salary: '',
        industry: ''
      },
      iPhoneXButtonPrefixStyle
    }
  },
  computed: {
    isEnabled () {
      return !!this.career.objective
    }
  },
  created () {
    localStorage.getDataByKey(STORAGE_KEY.CAREER_OBJECTIVE).then(p => {
      Object.assign(this.career, p)
    })
    this.initVision()
    localStorage.removeParameters()
    setNavigatorTitle(CAREER.TITLE)
  },
  methods: {
    initVision () {
      localStorage.getVision().then(p => {
        if (!p) {
          return
        }
        this.career.objective = p.jobTitle
        this.career.industry = p.career
      })
      localStorage.getVisionType().then(p => {
        if (!p) {
          return
        }
        this.career.type = p
        localStorage.removeVisionType()
      })
    },
    clearByKey (key) {
      this.career[key] = ''
    },
    viewappear () {
      this.initVision()
      let key = STORAGE_KEY.CITY
      localStorage.getDataByKey(key).then(p => {
        if (!p || !p.item || !p.item.cityName) {
          return
        }
        this.career.city = p.item.cityName
        localStorage.removeDataByKey(key)
      })
    },
    viewdisappear () {
      if (!shouldSaveData) {
        return
      }
      this.saveData()
    },
    pickJobType () {
      picker.pick({
        index: 0,
        items: JOB_TYPE,
        title: CAREER.JOB_TYPE
      }).then(value => {
        this.career.type = JOB_TYPE[value]
        shouldSaveData = true
      })
    },
    pickSalary () {
      picker.pick({
        index: 0,
        items: SALARY_REQUIREMENTS,
        title: CAREER.SALARY_REQUIREMENTS
      }).then(value => {
        this.career.salary = SALARY_REQUIREMENTS[value]
        shouldSaveData = true
      })
    },
    pickCity () {
      this.$push('choosecity')
    },
    citySelect (e) {
      this.career.city = e.item.cityName
      shouldSaveData = true
    },
    saveCareerVision () {
      shouldSaveData = false
      this.saveData()
      goBack()
    },
    pickJobtitle () {
      this.$push('choosetitle')
    },
    $push (view) {
      if (WXEnvironment.platform === 'Web') {
        this.$router.push(`${view}?careerVison=true`)
      } else {
        Navigator.push({
          url: `${config.baseUrl}${VIEWS[view]}?careerVison=true`,
          animated: 'true'
        }, e => console.log(e))
      }
    },
    saveData () {
      if (!this.career.objective) {
        return
      }
      localStorage.setDataByKey(STORAGE_KEY.CAREER_OBJECTIVE, this.career, false)
    },
    deleteRecord () {
      localStorage.delVision()
      localStorage.setDataByKey(STORAGE_KEY.CAREER_OBJECTIVE, {
        objective: '',
        type: '',
        city: '',
        salary: '',
        industry: ''
      }, false, true).then(() => {
        goBack()
      })
    }
  },
  components: { AppHeader, Picker, ButtonGroup }
}
</script>

<style scoped>
.career-vision {
  background-color: #F4F4F4; flex: 1;
}
.button-group {
  position: absolute; bottom: 0; left: 0;
}
</style>
