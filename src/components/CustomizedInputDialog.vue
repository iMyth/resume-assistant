<template>
  <over-layer :show="show">
    <div slot="dialog" class="dialog-box">
      <div class="dialog-content">
        <text class="content-title">{{title}}</text>
        <input-with-limit
          :styls="styls"
          :inputStyls="inputStyls"
          :maxLength="20"
          :placeholder="placeholder"
          @onInput="onInput"
        ></input-with-limit>
      </div>
      <div class="dialog-footer">
        <div class="footer-btn cancel"
          @click="cancelClicked">
          <text class="btn-text cancel-text">{{cancelText}}</text>
        </div>
        <div
          class="footer-btn confirm"
          @click="confirmClicked"
          :style="value ? {} : disableBtnStyle"
        >
          <text class="btn-text">{{confirmText}}</text>
        </div>
      </div>
    </div>
  </over-layer>
</template>

<script>
import OverLayer from 'components/common/OverLayer'
import InputWithLimit from 'components/common/InputWithLimit'
import strings, { CAREER } from 'strings'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: () => CAREER.CUSTOMIZED_JOB_TITLE
    },
    cancelText: {
      type: String,
      default: () => strings.CANCEL
    },
    confirmText: {
      type: String,
      default: () => strings.OK
    },
    disableBtnStyle: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgba(116, 199, 134, 0.35)'
      })
    },
    placeholder: {
      type:String
    }
  },
  data () {
    return {
      pageHeight: 1334,
      styls: {
        width: '496px',
        height: '72px',
        background: '#FFFFFF',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#DBDBDB',
        borderRadius: '8px',
        marginTop: '0',
        marginBottom: '0'
      },
      inputStyls: {
        height: '68px',
        lineHeight: '68px',
        fontSize: '28px',
        color: '#222226',
        borderRadius: '8px'
      },
      value: ''
    }
  },
  created () {
    const { env: { deviceHeight, deviceWidth } } = weex.config
    this.pageHeight = deviceHeight / deviceWidth * 750
  },
  methods: {
    cancelClicked () {
      this.$emit('cancelClicked')
    },
    confirmClicked (e) {
      if (!this.value) {
        return
      }
      this.$emit('confirmClicked', this.value)
    },
    onInput (v) {
      this.value = v
    }
  },
  components: { OverLayer, InputWithLimit }
}
</script>

<style scoped>
.dialog-box {
  background-color: #FFFFFF; border-radius: 12px; width: 560px; height: 356px;
}

.dialog-content {
  padding-top: 36px; padding-bottom: 46px;
  padding-left: 32px; padding-right: 32px;
}

.content-title {
  color: #222226; font-size: 36px; text-align: center; margin-bottom: 48px;
}

.dialog-footer {
  flex-direction: row; align-items: center; justify-content: space-between;
  padding-left: 32px; padding-right: 32px;
}

.footer-btn {
  flex-direction: row; align-items: center; justify-content: center;
  width: 232px; height: 72px; border-radius: 8px;
}

.cancel {
  background-color: #FAFAFA;
  border-style: solid; border-width: 1px; border-color: #DBDBDB;
}
.btn-text {
  font-size: 30px; color: #FFFFFF;
}
.cancel-text {
  color: #222226;
}
.confirm {
  background-color: #74C786;
}
</style>
