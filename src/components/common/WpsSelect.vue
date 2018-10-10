<template>
  <div :style="styls" @click="$emit('pickeValue')" class="container">
    <text class="value">{{value}}</text>
    <image class="icon" :src="iconClass" />
  </div>
</template>

<script>
import { PROFILE } from 'icons'

export default {
  props: {
    iconClass: {
      type: String,
      default: () => PROFILE.UNFOLD_2
    },
    value: {
      type: String,
      default: () => ''
    },
    styls: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.container {
  background-color: rgba(0, 0, 0, 0.10); border-radius: 4px;
  flex-direction: row; justify-content: space-between; align-items: center;
  padding-left: 20px; padding-right: 8px; height: 60px; width: 216px;
  opacity: 1;
}
.container:active {
  opacity: 0.35;
}
.value {
  font-size: 28px; color: #FFFFFF; flex: 1; lines: 1;
  text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
}
.icon {
  width: 42px; height: 42px;
}
</style>
