<template>
  <div class="tooltip">
    <image class="icon" :src="icon" />
    <div class="tip-body">
      <text class="text">{{tips}}</text>
    </div>
  </div>
</template>

<script>
import { PREVIEW } from 'icons'
import strings from 'strings'

export default {
  props: {
    tips: {
      type: String,
      default: () => strings.TIPS
    },
    icon: {
      type: String,
      default: () => PREVIEW.TIP
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: absolute; align-items: center; left: 375px; top: 74px;
}
.tip-body {
  opacity: 0.9; background-color: #FF474E; border-radius: 13px;
  width: 246px; height: 84px; justify-content: center; align-items: center;
}
.icon {
  /* width: 144px; height: 56px; */
  width: 72px; height: 28px; margin-left: -108px; opacity: 0.9;
}
.text {
  font-size: 28px; color: #FFFFFF; letter-spacing: -0.34px; text-align: center;
}
</style>
