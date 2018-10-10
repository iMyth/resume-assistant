<template>
  <div bubble="false" ref="root" class="container-panel">
    <image class="triangle" :src="triangle" />
    <div class="title">
      <wps-select
        v-if="showLeftSelection && !titleText"
        :value="picker1Value || placeholder1"
        @pickeValue="$emit('pickValue1')"
      ></wps-select>
      <wps-select
        v-if="showRIghtSelection && !titleText"
        :value="picker2Value || placeholder2"
        @pickeValue="$emit('pickValue2')"
      ></wps-select>
      <text v-if="titleText" class="header">{{titleText}}</text>
    </div>
    <scroller class="body">
      <text v-if="title && !isLoading" class="header">{{title}}</text>
      <text
        v-if="!isLoading"
        class="value"
        :style="valueStyle"
      >{{value || defaultText}}</text>
      <div @click="refresh" v-if="isLoading" class="loading">
        <image class="icon" :src="refreshIcon" />
        <text class="reload">{{labels.refresh}}</text>
      </div>
      <div v-if="!isLoading && !hasBought" class="mask">
        <div class="mask-top"></div>
        <div class="mask-bottom">
          <wps-button
            :styls="showAllStyle"
            :label="labels.showAll"
            @wpsClick="showAll"
          ></wps-button>
        </div>
      </div>
    </scroller>
    <div class="footer">
      <wps-button
        :label="labels.copy"
        :styls="copyStyle"
        @wpsClick="copy"
        :enabled="hasBought"
      ></wps-button>
      <wps-button
        :label="labels.pre"
        :styls="{ marginRight: '16px' }"
        @wpsClick="lastPage"
        :enabled="currentPage > 0"
      ></wps-button>
      <wps-button
        :label="labels.next"
        @wpsClick="nextPage"
        :enabled="currentPage < totalPage - 1"
      ></wps-button>
    </div>
    <wps-loading
      :show="toastOpt.show"
      :loadingText="toastOpt.text"
      :styls="toastOpt.style"
    ></wps-loading>
  </div>
</template>

<script>
import WpsSelect from 'components/common/WpsSelect'
import WpsButton from 'components/common/WpsButton'
import strings, { REF } from 'strings'
import { PROFILE } from 'icons'
import { processPayment, checkHasBought } from 'util'
import WpsLoading from 'components/preview/WpsLoading'

const clipboard = weex.requireModule('clipboard')
const animation = weex.requireModule('animation')
const modal = weex.requireModule('modal')

export default {
  props: {
    titleText: {
      type: String,
      default: () => ''
    },
    showLeftSelection: {
      type: Boolean,
      default: () => true
    },
    showRIghtSelection: {
      type: Boolean,
      default: () => true
    },
    labels: {
      type: Object,
      default: () => ({
        copy: strings.COPY,
        pre: strings.PRE,
        next: strings.NEXT,
        refresh: strings.REFRESH,
        showAll: strings.SHOW_ALL
      })
    },
    copyStyle: {
      type: Object,
      default: () => ({
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '108px'
      })
    },
    showAllStyle: {
      type: Object,
      default: () => ({
        height: '64px',
        width: '200px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#FFFFFF',
        borderRadius: '4px',
        backgroundColor: 'transparent'
      })
    },
    refreshIcon: {
      type: String,
      default: () => PROFILE.REFRESH
    },
    triangle: {
      type: String,
      default: () => PROFILE.TRIANGLE
    },
    top: {
      type: Number,
      default: () => -150
    },
    fetchStep: {
      type: Number,
      default: () => 10
    },
    fetchData: {
      type: Function,
      default: () => { throw new Error('fetchData is not defined!') }
    },
    picker1Value: {
      type: String,
      default: () => ''
    },
    picker2Value: {
      type: String,
      default: () => ''
    },
    placeholder1: {
      type: String,
      default: () => REF.CHOOSE
    },
    placeholder2: {
      type: String,
      default: () => REF.CHOOSE
    },
    defaultDesc: {
      type: String,
      default: () => REF.DEFAULT
    }
  },
  data () {
    return {
      currentPage: 0,
      totalPage: 0,
      availablePage: 0,
      isLoading: false,
      listData: [],
      hasBought: false,
      toastOpt: {
        show: false,
        style: {},
        text: strings.LOADING
      }
    }
  },
  computed: {
    valueStyle () {
      if (!this.hasBought) {
        return {
          height: '220px'
        }
      } else {
        return {}
      }
    },
    currentData () {
      return this.listData[this.currentPage] || {}
    },
    title () {
      let title
      let { expName, character } = this.currentData
      if (expName) {
        title = this.currentData.expName
      }
      if (character) {
        title = `${title} | ${character}`
      }
      return title
    },
    value () {
      return this.currentData.detail
    },
    defaultText () {
      return (this.picker1Value || this.picker1Value) && !this.value ? this.defaultDesc : ''
    }
  },
  watch: {
    picker1Value (v) {
      if (v) {
        this.refresh()
      }
    },
    picker2Value (v) {
      if (v) {
        this.refresh()
      }
    }
  },
  created () {
    this.$nextTick(() => {
      animation.transition(this.$refs.root, {
        styles: {
          opacity: 1,
          transform: `translateY(${this.top}px)`
        },
        duration: 200,
        timingFunction: 'ease-in',
        delay: 0
      }, () => {})
      this.refresh()
      this.checkHasBought()
    })
  },
  methods: {
    showLoading () {
      this.toastOpt.show = true
    },
    hideLoading () {
      this.toastOpt.show = false
    },
    refresh () {
      this.reset()
      // this.isLoading = true
      this.showLoading()
      this.fetchData(0, this.fetchStep).then(p => {
        this.hideLoading()
        this.isLoading = false
        this.totalPage = p.cnt
        this.listData = p.data || []
        this.availablePage = this.fetchStep
      }).catch(() => {
        this.isLoading = true
        this.hideLoading()
      })
    },
    copy () {
      if (!this.hasBought) {
        return
      }
      clipboard.setString(this.value)
      modal.toast({
        message: strings.COPIED,
        duration: 0.8
      })
    },
    showAll () {
      if (this.hasBought) {
        return
      }
      processPayment({
        source: 'tips'
      }).then(p => {
        if (p.buytype === 0) {
          this.hasBought = true
        }
      })
    },
    reset () {
      this.currentPage = 0
      this.totalPage = 0
      this.availablePage = 0
      this.isLoading = false
      this.listData = []
    },
    nextPage () {
      if (this.currentPage >= this.totalPage - 1 || this.isLoading) {
        return
      }
      if (this.currentPage < this.availablePage - 1) {
        this.currentPage++
      } else {
        // this.isLoading = true
        this.showLoading()
        this.fetchData(this.availablePage, this.fetchStep).then(p => {
          this.hideLoading()
          let count = p.data.length
          this.listData.push(...p.data)
          this.currentPage++
          this.availablePage = this.availablePage + count
          this.isLoading = false
        }).catch(() => {
          this.isLoading = true
          this.hideLoading()
        })
      }
    },
    lastPage () {
      if (this.currentPage < 1) {
        return
      }
      this.currentPage--
    },
    hide () {
      animation.transition(this.$refs.root, {
        styles: {
          opacity: 0,
          transform: `translateY(0px)`
        },
        duration: 400,
        timingFunction: 'ease-in',
        delay: 0
      }, () => {
        this.$emit('hide')
      })
    },
    checkHasBought () {
      checkHasBought().then(p => {
        this.hasBought = p.bought
      })
    }
  },
  components: { WpsSelect, WpsButton, WpsLoading }
}
</script>

<style scoped>
.container-panel {
  width: 690px; height: 590px; border-radius: 12px;
  margin-left: 30px; margin-top: 40px; opacity: 0;
}
.title {
  height: 100px; border-bottom-style: solid; background-color: #74C786;
  border-bottom-color: rgba(255, 255, 255, 0.40);
  border-bottom-width: 1px; flex-direction: row; align-items: center;
  justify-content: space-between; padding-left: 20px; padding-right: 20px;
  border-top-left-radius: 12px; border-top-right-radius: 12px;
}
.body {
  height: 386px; padding-left: 40px; padding-right: 40px; background-color: #74C786;
}
.header {
  font-size: 30px; color: #FFFFFF; margin-top: 38px;
}
.value {
  font-size: 28px; color: #FFFFFF; padding-bottom: 100px; margin-top: 22px;
}
.footer {
  position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
  flex-direction: row; align-items: center; justify-content: flex-end;
  padding-left: 20px; padding-right: 20px; background-color: #74C786;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
}
.loading {
  height: 326px; justify-content: center; align-items: center;
}
/** buggie, linear-gradient percentage is not supported **/
.mask {
  position: absolute; height: 192px; top: 194px; left: 0; right: 0;
  width: 690px;
}
.mask-top {
  flex: 0.42;
  background-image: linear-gradient(to bottom, rgba(116,199,134,0.00), #74C786);
}
.mask-bottom {
  flex: 0.58; align-items: center;
  background-color: #74C786;
}
.icon {
  width: 80px; height: 80px;
}
.reload {
  opacity: 0.6; font-size: 30px; color: #FFFFFF; margin-top: 16px;
}
.triangle {
  height: 12px; width: 28px; margin-left: 60px;
}
</style>
