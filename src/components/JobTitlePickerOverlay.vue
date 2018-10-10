<template>
  <div class="container">
    <list
      class="list"
      :style="listStyle"
    >
      <cell
        @click="showDialog"
        class="cell add-cell"
        v-if="showCustomized">
        <image class="icon" :src="addClass" />
        <text class="cell-text cell-text-gray">{{tips}}</text>
      </cell>
      <cell
        @click="showPicker(item.id)"
        class="cell" v-for="item in jobList"
        :key="item.id"
        :style="item.id === currentId ? activeClass : {}"
      >
        <text class="cell-text">{{item.name}}</text>
        <image class="icon" :src="iconClass" />
      </cell>
    </list>
    <wxc-popup
        :show="isPickerShow"
        @wxcPopupOverlayClicked="hidePicker"
        pos="right"
        :width="width"
        :height="height"
        :overlayStyle="overlayStyle"
      >
      <job-title-picker
        :category="category"
        :jobTitles="jobTitles"
        :isVision="isVision"
        :width="width"
        @pickValue="pickerHandler"
        :showCustomized="showCustomized"
      ></job-title-picker>
    </wxc-popup>
    <customized-input-dialog
      @cancelClicked="hideDialog()"
      @confirmClicked="setJobTitle"
      :show="isShowDialog"
      :placeholder="placeholder"
    ></customized-input-dialog>
  </div>
</template>

<script>
import WxcPopup from 'components/wxc/WxcPopup.vue'
import JobTitlePicker from 'components/JobTitlePicker.vue'
import CustomizedInputDialog from 'components/CustomizedInputDialog'
import { queryUrlStr, queryHashStr, goBack } from 'util'
import strings, { CAREER } from 'strings'
import { PROFILE } from 'icons'
import localStorage from 'localStorage'

const genData = p => {
  let target = []
  let id = 1
  if (!p) {
    return []
  }
  for (let key in p) {
    target.push({
      id: id++,
      name: Array.isArray(p) ? p[key] : key,
      children: typeof p[key] === 'object' ? genData(p[key]) : ''
    })
  }
  return target
}

export default {
  props: {
    activeClass: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgba(116, 199, 134, 0.15)'
      })
    },
    onValueChange: {
      type: Function
    },
    width: {
      type: Number,
      default: () => 590
    },
    height: {
      type: Number
    },
    overlayStyle: {
      type: Object,
      default: () => ({})
    },
    showCustomized: {
      type: Boolean,
      default: () => true
    },
    iconClass: {
      type: String,
      default: () => PROFILE.RIGHT_ARROW
    },
    tips: {
      type: String,
      default: () => CAREER.CUSTOMIZED_TIPS
    },
    addClass: {
      type: String,
      default: () => PROFILE.ADD_EXP
    },
    placeholder: {
      type: String,
      default: () => strings.JOB_PLACEHOLDER
    }
  },
  data () {
    return {
      jobList: [],
      currentId: 0,
      isPickerShow: false,
      isVision: false,
      isShowDialog: false
    }
  },
  computed: {
    jobTitles () {
      let target = this.jobList.find(p => p.id === this.currentId) || {}
      return target.children || []
    },
    category () {
      let target = this.jobList.find(p => p.id === this.currentId) || {}
      return target.name || ''
    },
    pickerHandler () {
      if (this.onValueChange) {
        return this.onValueChange
      }
      return this.defaultHandler
    },
    listStyle () {
      return {
        paddingTop: this.showCustomized ? '0' : '20px'
      }
    }
  },
  created () {
    localStorage.getAllCareersTree().then(p => {
      this.jobList = genData(p)
    })
    this.isVision = !!queryUrlStr('careerVison') || !!queryHashStr('careerVison')
  },
  methods: {
    showDialog () {
      this.isShowDialog = true
    },
    hideDialog () {
      this.isShowDialog = false
    },
    hidePicker () {
      this.isPickerShow = false
    },
    showPicker (id) {
      this.currentId = id
      this.isPickerShow = true
    },
    defaultHandler (e) {
      let { industry, career, jobTitle } = e
      if (this.isVision) {
        localStorage.setVision({
          industry,
          career,
          jobTitle
        })
      }
      localStorage.setParameters(e.jobTitle).then(() => {
        goBack()
      })
    },
    setJobTitle (item) {
      this.pickerHandler({
        industry: '',
        career: '',
        jobTitle: item
      })
    }
  },
  components: { WxcPopup, JobTitlePicker, CustomizedInputDialog }
}
</script>

<style scoped>
.list {
  padding-top: 20px; 
}
.cell {
  height: 120px; background-color: #FFFFFF; padding-left: 30px;
  border-bottom-color: #DBDBDB; padding-right: 30px;
  border-bottom-width: 1px; border-bottom-style: solid;
  flex-direction: row; justify-content: space-between;
  align-items: center;
}
.cell:active {
  background-color: rgba(116, 199, 134, 0.15);
}
.cell-text {
  color: #222226; font-size: 30px;
}
.container {
  flex: 1; /** position: absolute; width: 750px; left: 0; top: 0; right: 0; bottom: 0; **/
}
.icon {
  width: 42px; height: 42px;
}
.cell-text-gray {
  color: #696969; font-size: 28px; margin-left: 20px;
}
.add-cell {
  justify-content: flex-start;
}
</style>
