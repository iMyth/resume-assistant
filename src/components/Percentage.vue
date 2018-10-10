<template>
  <div ref="root" :style="styls" class="percentage">
    <div :style="circleStyle" class="progress-circle">
      <text class="progress-text">{{pregress}}%</text>
    </div>
    <text class="text">{{text}}</text>
    <image @click="closeSelf" class="close" v-if="pregress >= 100" :src="closeIcon" />
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import strings from 'strings'

const animation = weex.requireModule('animation')

export default {
  props: {
    pregress: {
      type: Number,
      default: 0
    },
    closeIcon: {
      type: String,
      default: () => PROFILE.CLOSE
    },
    text: {
      type: String,
      default: () => strings.COMPLETENESS
    }
  },
  computed: {
    styls () {
      return {
        boxShadow: '0 0 32px rgba(180, 180, 180, 0.50)',
        width: this.pregress >= 100 ? '270px' : '246px'
      }
    },
    circleStyle () {
      return {
        backgroundColor: this.pregress >= 100 ? '#74C786' : '#D8AD6A'
      }
    }
  },
  methods: {
    closeSelf () {
      animation.transition(this.$refs.root, {
        styles: {
          opacity: 0,
          transform: `translateX(200px)`
        },
        duration: 200,
        timingFunction: 'ease-in',
        delay: 0
      }, () => {
        this.$emit('close')
      })
    }
  }
}
</script>

<style scoped>
.percentage {
  position: absolute; background-color: #FFFFFF; right: 0; top: 30px; flex-direction: row;
  box-shadow: 0 0 32px rgba(180, 180, 180, 0.50); justify-content: flex-start; align-items: center;
  border-top-left-radius: 44px; border-bottom-left-radius: 44px; height: 76px;
}
.progress-circle {
  height: 68px; width: 68px; border-radius: 34px; background-color: #D8AD6A;
  justify-content: center; align-items: center;
  margin-left: 4px; margin-right: 6px;
}
.progress-text {
  color: #FFFFFF; font-size: 22px; letter-spacing: -0.07px;
}
.text {
  font-size: 28px; color: #222226; letter-spacing: -0.09px; line-height: 40px;
}
.close {
  height: 40px; width: 40px; margin-left: 8px;
}
</style>
