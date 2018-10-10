<template>
  <div class="ref-others">
    <div v-if="showTips" class="button" @click="$emit('showPanel')">
      <div class="hovert-status">
        <image class="tips-icon" :src="tipsIcon"/>
        <text class="text">{{text}}</text>
      </div>
    </div>
    <text class="text count">{{currentCount}}/{{total}}</text>
  </div>
</template>

<script>
import { CAREER_BACKGROUND } from 'strings'
import { PROFILE } from 'icons'

export default {
  props: {
    text: {
      type: String,
      default: () => CAREER_BACKGROUND.REF_OTHERS
    },
    total: {
      type: Number,
      default: () => 1000
    },
    currentCount: {
      type: Number,
      default: () => 0
    },
    tipsIcon: {
      type: String,
      default: () => PROFILE.TIPS2
    },
    showTips: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style scoped>
.ref-others {
  height: 100px; background-color: #FFFFFF; flex-direction: row;
  justify-content: flex-start; align-items: center;
  padding-left: 30px; padding-right: 30px;
  border-top-style: solid; border-top-color: #DBDBDB; border-top-width: 1px;
}
.tips-icon {
  height: 52px; width: 52px; margin-right: 12px;
}
.text {
  font-size: 30px; color: #FFFFFF;
}
.count {
  position: absolute; right: 30px; color: #888888; height: 40px; line-height: 40px;
  top: 30px;
}
.button {
  width: 380px; height: 64px; background-color: #74C786; border-radius: 32px;
}
.hovert-status {
  opacity: 1; align-items: center; justify-content: center;
  flex-direction: row; flex: 1; height: 64px;
}
.hovert-status:active {
  opacity: 0.35;
}
</style>
