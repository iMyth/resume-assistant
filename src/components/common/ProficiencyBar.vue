<template>
  <div class="proficiency-bar">
    <div :style="lineStyle" class="line"></div>
    <div
      @click="transformTo(index, true)"
      :style="getMilestoneStyle(index)"
      class="milestone-container"
      v-for="(item, index) in level"
      :key="index"
    >
      <div class="milestone"></div>
      <!-- buggie, manually set color -->
      <text
        :style="currentIndex === index ? selectedStyle : { color: '#888888' }"
        class="text"
      >{{item}}</text>
    </div>
    <div
      :style="spinnerStyle"
      @panmove="onTouchMove"
      @panend="onTouchEnd"
      ref="spinner"
      class="spinner"
    >
      <div class="touch-area"></div>
    </div>
  </div>
</template>

<script>
import { PROFICIENCY_LEVEL } from 'strings'
import { getNearestNumberOfArray } from 'util'

const animation = weex.requireModule('animation')
// const { env } = weex.config

const offsetLeft = 50
const pointWidth = 80
const lineWidth = 650
const spinnerWidth = 44

const getOffsetLeft = e => {
  let radius = spinnerWidth / 2
  // buggie
  // let offset = e.pageX / env.scale - radius
  let offset = e.pageX - radius
  let minOffset = offsetLeft - radius
  if (offset < minOffset) {
    return minOffset
  }
  let maxOffset = lineWidth + offsetLeft - radius
  if (offset > maxOffset) {
    return maxOffset
  }
  return offset
}

export default {
  props: {
    level: {
      type: Array,
      default: () => PROFICIENCY_LEVEL
    },
    selectedStyle: {
      type: Object,
      default: () => ({
        color: '#74C786'
      })
    },
    defaultValue: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      currentIndex: 0,
      spinnerStyle: {},
      milestones: []
    }
  },
  computed: {
    levelLength () {
      return this.level.length
    },
    lineStyle () {
      return {
        left: '50px',
        width: `${lineWidth}px`
      }
    }
  },
  created () {
    this.spinnerStyle = {
      // left: `${this.getSpinnerLeft()}px`
      transform: `translateX(${this.getSpinnerLeft()}px)`
    }
    for (let i = 0, l = this.levelLength; i < l; i++) {
      this.milestones.push(this.getMilestoneLeft(i))
    }
    this.$nextTick(() => {
      this.transformTo(this.defaultValue)
    })
  },
  methods: {
    getMilestoneStyle (index) {
      return {
        // left: `${this.getMilestoneLeft(index)}px`
        transform: `translateX(${this.getMilestoneLeft(index)}px)`
      }
    },
    getMilestoneLeft (index) {
      return offsetLeft + index * (lineWidth / (this.levelLength - 1)) - pointWidth / 2
    },
    getSpinnerLeft () {
      return offsetLeft + this.currentIndex * (lineWidth / (this.levelLength - 1)) - spinnerWidth / 2
    },
    gotoNearestPoint (offset) {
      this.transformTo(getNearestNumberOfArray(this.milestones, offset), true)
    },
    transformTo (index, fireEvent) {
      this.currentIndex = index
      animation.transition(this.$refs.spinner, {
        styles: {
          // left: `${this.getSpinnerLeft()}px`
          transform: `translateX(${this.getSpinnerLeft()}px)`
        },
        timingFunction: 'ease',
        duration: 200
      }, () => {
        if (!fireEvent) {
          return
        }
        this.$emit('onValueChange', index)
      })
    },
    onTouchMove (e) {
      animation.transition(this.$refs.spinner, {
        styles: {
          transform: `translateX(${getOffsetLeft(e.changedTouches[0])}px)`
          // left: `${getOffsetLeft(e.changedTouches[0])}px`
        },
        timingFunction: 'ease',
        duration: 0
      }, () => {
      })
    },
    onTouchEnd (e) {
      this.gotoNearestPoint(getOffsetLeft(e.changedTouches[0]))
    }
  },
  watch: {
    defaultValue (v) {
      this.transformTo(v)
    }
  }
}
</script>

<style scoped>
.proficiency-bar {
  width: 750px; height: 186px; background-color: #FFFFFF;
}
.line {
  position: absolute; top: 68px; height: 4px;
  background-color: #dedede;
}
.milestone-container {
  position: absolute; top: 58px; width: 80px; justify-content: flex-start; align-items: center;
}
/** height&width should be related to pointWidth **/
.milestone {
  height: 24px; width: 24px; background-color: #ededed;
  border-radius: 12px;
}
/** height&width should be related to spinnerWidth **/
.spinner {
  position: absolute; height: 44px; width: 44px; border-radius: 22px;
  background-color: #F6F6F6; border-style: solid; border-width: 1px;
  border-color: #898989; top: 48px; /** left: 38px; **/
  background-image: linear-gradient(to bottom, #FFFFFF, #EEEEEE);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}
.touch-area {
  position: absolute; top: -22px; left: -22px;
  height: 88px; width: 88px;
}
.text {
  font-size: 28px; color: #888888; margin-top: 28px;
}
</style>
