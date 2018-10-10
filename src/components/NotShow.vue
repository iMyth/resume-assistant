<template>
  <div class="not-show">
    <image class="show-icon" :src="showIcon"/>
    <text class="hide-text">{{title}}</text>
    <switch
      class="switch"
      @change="$emit('change', $event)"
      :checked="checked"
    ></switch>
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import { CAREER_BACKGROUND } from 'strings'

export default {
  props: {
    title: {
      type: String,
      default: () => CAREER_BACKGROUND.HIDE
    },
    showIcon: {
      type: String,
      default: () => PROFILE.SHOW
    },
    checked: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
.not-show {
  height: 100px; background-color: #FFFFFF; flex-direction: row;
  justify-content: flex-start; align-items: center;
  padding-left: 30px; padding-right: 30px; margin-top: 14px;
}
.show-icon {
  height: 52px; width: 52px; margin-right: 12px;
}
.hide-text {
  font-size: 30px; color: #222226;
}
.switch {
  position: absolute; right: 30px; top: 19px;
}
</style>
