<template>
  <over-layer :show="show">
    <div ref="root" slot="dialog" class="dialog">
      <div class="content">
        <text class="info">{{info}}</text>
        <div @click="clickComfirm" class="edit-button">
          <text class="edit-text">{{comfirmLabel}}</text>
        </div>
      </div>
      <image @click="clickCancel" class="cancel" :src="closeIcon" />
    </div>
  </over-layer>
</template>

<script>
import { PREVIEW } from 'icons'
import strings from 'strings'
import OverLayer from 'components/common/OverLayer.vue'

// const animation = weex.requireModule('animation')

export default {
  props: {
    closeIcon: {
      type: String,
      default: () => PREVIEW.CLOSE_PROMPT
    },
    info: {
      type: String,
      default: () => strings.ADD_CV_INFO
    },
    comfirmLabel: {
      type: String,
      default: () => strings.EDIT_CV
    },
    show: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    clickCancel (e) {
      // this._animate(false, 'clickCancel')
      this.$emit('clickCancel')
    },
    clickComfirm () {
      this.$emit('clickComfirm')
      // this._animate(false, 'clickComfirm')
    }
  },
  // watch: {
  //   show (v) {
  //     this.$nextTick(() => {
  //       if (v) {
  //         animation.transition(this.$refs.root, {
  //           styles: {
  //             transform: 'scale(1)'
  //           },
  //           duration: 200,
  //           timingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.875)',
  //           delay: 0
  //         }, () => {})
  //       } else {
  //         animation.transition(this.$refs.root, {
  //           styles: {
  //             transform: 'scale(.5)'
  //           },
  //           duration: 200,
  //           timingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.875)',
  //           delay: 0
  //         }, () => {})
  //       }
  //     })
  //   }
  // },
  components: { OverLayer }
}
</script>

<style scoped>
.dialog {
  width: 580px; height: 464px; align-items: center; justify-content: center;
  /* transform: scale(.5); */
}
.cancel {
  width: 80px; height: 80px; margin-top: 40px;
}
.content {
  width: 580px; height: 344px; background-color: #FFFFFF; border-radius: 20px;
  justify-content: flex-start; align-items: center;
}
.info {
  width: 408px; margin-top: 60px; text-align: center;
  font-size: 34px; color: #222226; letter-spacing: 0; line-height: 52px;
  lines: 2;
}
.edit-button {
  width: 500px; height: 80px; background-color: #74C786; border-radius: 100px;
  margin-top: 60px; justify-content: center; align-items: center;
}
.edit-text {
  font-size: 32px; color: #FFFFFF; letter-spacing: -0.39px; text-align: center;
  width: 500px; height: 80px; justify-content: center; align-items: center;
  line-height: 80px;
}
.edit-text:active {
  opacity: .35;
}
</style>
