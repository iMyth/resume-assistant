<template>
  <div class="container">
    <div @click="$emit('addClick')" class="add-experience">
      <div class="press-status">
        <image class="icon" :src="addIcon" />
        <text class="text">{{name}}</text>
      </div>
    </div>
  </div>
</template>

<script>
import { PROFILE } from 'icons'

export default {
  props: {
    addIcon: {
      type: String,
      default: () => PROFILE.ADD_GREEN
    },
    name: {
      type: String,
      default: () => 'ADD'
    }
  },
  data () {
    return { }
  }
}
</script>

<style scoped>
.container {
  width: 710px; height: 168px; align-items: center; justify-content: center;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.add-experience {
  width: 650px; height: 88px;
  border-radius: 8px; border-style: solid; border-width: 1px; border-color: #DBDBDB;
  align-items: center; justify-content: center; flex-direction: row;
}
.icon {
  height: 42px; width: 42px; opacity: 1;
}
.press-status {
  flex: 1; align-items: center; justify-content: center; flex-direction: row;
  height: 86px; opacity: 1;
}
.press-status:active {
  opacity: 0.35;
}
.text {
  margin-left: 8px; font-size: 32px; color: #74C786; letter-spacing: 0; opacity: 1;
}
</style>
