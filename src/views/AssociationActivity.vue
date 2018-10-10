<template>
  <div @viewdisappear="viewdisappear" class="container">
    <scroller :style="scrollerStyle" class="scroller">
      <picker
        ref="title"
        :titleStyls="associationStyle"
        :inputStyle="inputStyle"
        :styls="{ marginTop: '20px' }"
        :title="ASSOCIATION_ACTIVITY.ASSOCIATION"
        :isInput="true"
        :value="association.name"
        @onInput="onNameChange"
        :maxLength="30"
        :optional="true"
        :placeholder="optionalText"
      ></picker>
      <picker
        :titleStyls="titleStyls"
        :inputStyle="inputStyle"
        :title="ASSOCIATION_ACTIVITY.POSITION"
        :isInput="true"
        :value="association.position"
        @onInput="onPositionChange"
        :maxLength="30"
      ></picker>
      <period-picker
        :titleStyls="titleStyls"
        :title="ASSOCIATION_ACTIVITY.PERIOD"
        :defaultStart="association.period.start"
        :defaultEnd="association.period.end"
        @value1Change="onStartChange"
        @value2Change="onEndChange"
      ></period-picker>
      <row-title
        :title="ASSOCIATION_ACTIVITY.DESC"
      ></row-title>
      <textarea
        name="job-content"
        ref="textarea"
        cols="30"
        rows="10"
        class="textarea"
        maxlength="1000"
        :placeholder="ASSOCIATION_ACTIVITY.PLACEHOLDER"
        @input="onInput"
        :value="association.desc"
        @focus="onFocus"
      ></textarea>
      <refer-others
        :currentCount="currentCount"
        @showPanel="showPanel"
      ></refer-others>
      <not-show
        @change="onchange"
        :checked="!association.status"
      ></not-show>
      <ref-panel
        ref="refPanel"
        v-if="showRefPanel"
        :fetchData="fetchData"
        :titleText="ASSOCIATION_ACTIVITY.TIPS"
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
import { WxcPopup } from 'weex-ui'
import ButtonGroup from 'components/common/ButtonGroup'
import strings, { ASSOCIATION_ACTIVITY } from 'strings'
import { setNavigatorTitle, goBack, isIPhoneX, deepCopy, iPhoneXButtonPrefixStyle } from 'util'
import config, { STORAGE_KEY } from 'config'
import localStorage from 'localStorage'
import service from 'service'
import bridge from 'bridge'

const dom = weex.requireModule('dom')

// NOTE: 这里的公共方法可以放到mixins里面，但是目前由于weex自身的问题
// 必须引入weex-router之后才能使用 store 与 mixins 后期优化
let originalData
let shouldSaveData = false
let hasShownRef = false

export default {
  data () {
    return {
      ASSOCIATION_ACTIVITY,
      optionalText: strings.OPTIONAL,
      titleStyls: {
        width: '270px'
      },
      associationStyle: {
        width: '270px',
        fontSize: '30px'
      },
      inputStyle: {
        width: '450px',
        marginRight: '-30px',
        marginTop: '0',
        marginBottom: '0'
      },
      scrollerStyle: {
        bottom: isIPhoneX() ? '196px' : '128px'
      },
      iPhoneXButtonPrefixStyle,
      currentCount: 0,
      association: {
        id: -1,
        name: '',
        position: '',
        period: { start: '', end: '' },
        desc: '',
        status: 1
      },
      showRefPanel: false
    }
  },
  computed: {
    isEnabled () {
      return !!this.association.position
    }
  },
  created () {
    this.$nextTick(() => {
      localStorage.getParameters().then(p => {
        originalData = deepCopy(Object.assign(this.association, p))
        this.currentCount = originalData.desc.length
        localStorage.removeParameters()
      })
    })
    setNavigatorTitle(ASSOCIATION_ACTIVITY.TITLE)
  },
  methods: {
    onchange (e) {
      this.association.status = e.value ? 0 : 1
      shouldSaveData = true
    },
    onInput (e) {
      let { value } = e
      this.currentCount = value.length
      this.association.desc = value
      shouldSaveData = true
    },
    onFocus () {
      if (!this.showRefPanel) {
        dom.scrollToElement(this.$refs.title, { offset: 110 })
      }
      this.showRefPanel = true
    },
    onNameChange (v) {
      this.association.name = v
      shouldSaveData = true
    },
    onPositionChange (v) {
      this.association.position = v
      shouldSaveData = true
    },
    onStartChange (v) {
      this.association.period.start = v
      shouldSaveData = true
    },
    onEndChange (v) {
      this.association.period.end = v
      shouldSaveData = true
    },
    onComfirm () {
      shouldSaveData = false
      this.saveData()
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
    saveData (data = this.association) {
      if (!this.isEnabled) {
        this.deleteRecord()
        return
      }
      localStorage.addOrEditData(STORAGE_KEY.ASSOCIATION_ACTIVITY, data)
    },
    deleteRecord () {
      localStorage.deleteItemByKey(STORAGE_KEY.ASSOCIATION_ACTIVITY, this.association)
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
            source: 'school'
          }
        })
      } else {
        dom.scrollToElement(this.$refs.title, { offset: -20 })
        this.$refs.refPanel.hide()
        bridge.statistic({
          event: 'SupercvSchoolTipsSelected'
        })
      }
    },
    fetchData (offset, step) {
      return service.fetchAssociation({
        data: {
          zt_id: config.themeId,
          skip: offset,
          limit: step
        }
      })
    }
  },
  components: {
    AppHeader, RowTitle, Picker,
    PeriodPicker, NotShow, ReferOthers,
    ButtonGroup, RefPanel, WxcPopup
  }
}
</script>

<style scoped>
.container {
  background-color: #F4F4F4;
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
