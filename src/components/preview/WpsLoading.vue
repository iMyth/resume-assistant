<template>
  <div :hack-show="needShow">
    <div
      class="loading"
      :style="getStyle"
      v-if="showLoading"
    >
      <div class="loading-box" :aria-hidden="true">
        <image
          ref="img"
          :src="icon"
          class="loading-image"
          resize="contain"
          quality="original" />
        <text v-if="loadingText" class="loading-text">{{loadingText}}</text>
      </div>
    </div>
  </div>
</template>

<script>
import { PREVIEW } from 'icons'
import { getPageHeight } from 'util'

const animation = weex.requireModule('animation')

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    interval: {
      type: [ Number, String ],
      default: 0
    },
    icon: {
      type: String,
      default: () => PREVIEW.LOADING
    },
    styls: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showLoading: false,
      tid: 0
    }
  },
  computed: {
    showText () {
      return this.loadingText
    },
    topPosition () {
      return (getPageHeight() - 200) / 2
    },
    needShow () {
      this.setShow()
      return this.show
    },
    getStyle () {
      return Object.assign({ top: this.topPosition +'px'}, this.styls)
    }
  },
  created () {
    this.$nextTick(() => {
      this._animate()
    })
  },
  methods: {
    setShow () {
      const { interval, show, showLoading } = this
      const stInterval = parseInt(interval)
      clearTimeout(this.tid)
      if (show) {
        if (showLoading) {
          return
        }
        if (stInterval === 0) {
          this.showLoading = true
        } else {
          this.tid = setTimeout(() => {
            this.showLoading = true
          }, stInterval)
        }
      } else {
        this.showLoading = false
      }
    },
    // do not support infinite
    _animate () {
      const el = this.$refs.img
      if (!el) {
        return
      }
      animation.transition(el, {
        styles: {
          transform: 'rotate(360deg)'
        },
        duration: 800,
        timingFunction: 'linear',
        delay: 0
      }, () => {
        this._restore().then(() => {
          this._animate()
        })
      })
    },
    _restore () {
      return new Promise((resolve, reject) => {
        const el = this.$refs.img
        if (!el) {
          return
        }
        animation.transition(el, {
          styles: {
            transform: 'rotate(0deg)'
          },
          duration: 0.001,
          timingFunction: 'linear',
          delay: 0
        }, () => {
          resolve()
        })
      })
    }
  },
  watch: {
    showLoading (v) {
      if (v) {
        this._animate()
      }
    }
  }
}
</script>

<style scoped>
/* .container {
  position: fixed; top: 0; right: 0; bottom: 0; left: 0;
} */
.loading {
  position: fixed; left: 287px; top: 500px; z-index: 9999;
}

.loading-box {
  align-items: center; justify-content: flex-start; border-radius: 20px;
  width: 224px; height: 184px; background-color: rgba(0, 0, 0, 0.8);
}

.loading-image {
  height: 60px; width: 60px; margin-top: 32px; margin-bottom: 26px;
}

.loading-text {
  color: #ffffff; font-size: 32px; line-height: 30px; height: 30px;
  margin-top: 8px; text-overflow: ellipsis; width: 140px; text-align: center;
}
</style>
