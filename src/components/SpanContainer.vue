<template>
  <div ref="container" class="span-container">
    <div @click="fold" class="span-container-title">
      <text
        class="title"
        @click="tryRename"
      >{{title}}</text>
      <text v-if="descTxt && !hasContent" class="desc-text">{{descTxt}}</text>
      <image
        ref="icon"
        class="right-icon"
        :src="iconUrl"
        resize="contain"
      />
      <image
        v-if="showTips && !hasContent"
        class="tips"
        :src="tipUrl"
        resize="contain"
      />
    </div>
    <div ref="slot">
      <slot name="span"></slot>
    </div>
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import { getRect } from 'util'
import localStorage from 'localStorage'

const animation = weex.requireModule('animation')

export default {
  props: {
    title: {
      type: String,
      default: () => '自定义模块'
    },
    addIcon: {
      type: String,
      default: () => PROFILE.ADD_EXP
    },
    foldIcon: {
      type: String,
      default: () => PROFILE.FOLD
    },
    unfoldIcon: {
      type: String,
      default: () => PROFILE.UNFOLD
    },
    hasContent: {
      type: Boolean,
      default: () => false
    },
    view: {
      type: String
    },
    children: {
      type: [ Array, Object, String ]
    },
    categoryId: {
      type: Number,
      default: () => 0
    },
    tipUrl: {
      type: String,
      default: () => PROFILE.TIPS_TRIANGLE
    },
    showTips: {
      type: Boolean,
      default: () => false
    },
    descTxt: {
      type: String,
      default: () => ''
    },
    couldRename: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      isFold: false,
      isAnimationInProgress: false
    }
  },
  computed: {
    iconUrl () {
      if (Array.isArray(this.children)) {
        return this.children.length === 0 &&
        !this.hasContent ? this.addIcon : this.foldIcon
      }
      return !this.hasContent ? this.addIcon : this.foldIcon
    }
  },
  watch: {
    'children.length' (v, o) {
      // buggie, ???
      // hack, crash
      setTimeout(() => {
        this._fit(!v, 'ease', !o ? 0.00001 : 200)
      }, 100)
    }
  },
  methods: {
    tryRename (e) {
      if (this.couldRename) {
        e.stopPropagation()
        this.$emit('rename')
      }
    },
    fold (e) {
      if (e) {
        e.stopPropagation()
      }
      if (!this.hasContent) {
        if (!this.view) {
          return
        }
        localStorage.setParameters({
          categoryId: this.categoryId
        }).then(() => {
          this.$emit('addClick')
        })
        return
      }
      if (this.isAnimationInProgress) {
        return
      }
      this.isAnimationInProgress = true
      this.isFold = !this.isFold
      this.$nextTick(() => {
        this._animate()
      })
    },
    // hack
    // _beforeAnimate () {
    //   return new Promise((resolve, reject) => {
    //     getRect(this.$refs.slot).then(res => {
    //       animation.transition(this.$refs.container, {
    //         styles: {
    //           height: `${res.height + 100}px`
    //         },
    //         timingFunction: 'ease',
    //         delay: 0,
    //         duration: 10
    //       }, () => {
    //         this.isAnimationInProgress = false
    //       })
    //     })
    //   })
    // },
    // needLayout(boolean)：Whether or not the layout animation occurs when animation is executed，default value is false
    _animate () {
      animation.transition(this.$refs.icon, {
        styles: {
          transform: `rotate(${this.isFold ? -180 : 0}deg)`
        },
        timingFunction: 'ease', // 'cubic-bezier(0.4, 0, 0.2, 1.2)'
        delay: 0,
        duration: 200
      })
      // buggie
      this._fit(this.isFold, 'cubic-bezier(0.4, 0, 0.2, 1.2)', 400)
    },
    _fit (isCollapse, timingFunction, duration) {
      getRect(this.$refs.slot).then(res => {
        // hack
        let height = isCollapse ? '100px' : `${res.height + 100}px`
        if (isCollapse) {
          this._doFit({
            height: `${res.height + 100}px`,
            timingFunction: 'ease',
            duration: 0.01
          }, () => {
            this._doFit({
              height,
              timingFunction,
              duration
            })
          })
        } else {
          this._doFit({
            height,
            timingFunction,
            duration
          })
        }
      })
    },
    _doFit ({ height, timingFunction, duration }, callback) {
      animation.transition(this.$refs.container, {
        styles: {
          height
        },
        timingFunction,
        needLayout: true,
        delay: 0,
        duration: duration || 200
      }, () => {
        this.isAnimationInProgress = false
        if (typeof callback === 'function') {
          callback()
        }
      })
    }
  }
}
</script>

<style scoped>
.span-container {
  width: 710px; margin-top: 20px; background-color: #fff; border-radius: 12px;
  overflow: hidden;
  /** hack **/
  /** transform: translate3d(0, 0, 0); **/
}
.span-container-title:active {
  background-color: #f5f5f5;
}
.span-container-title {
  display: flex; flex-direction: row; justify-content: space-between;
  height: 100px; padding-top: 30px; padding-right: 20px; padding-left: 20px;
}
.right-icon {
  height: 42px; width: 42px;
}
.title {
  font-family: PingFangSC-Semibold;
  font-size: 32px; color: #222226; letter-spacing: 0;
}
.tips {
  position: absolute; top: 0; left: 0; height: 68px; width: 68px;
}
.desc-text {
  position: absolute; font-size: 28px; color: #888888; left: 180px; top: 34px;
}
</style>
