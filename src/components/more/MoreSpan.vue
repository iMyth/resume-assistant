<template>
  <div @click="onClick" class="more-span">
    <image
      class="add-icon"
      :src="iconUrl"
    />
    <text
      class="name"
    >{{title}}</text>
    <image
      v-if="showTips"
      class="tips"
      :src="tipUrl"
      resize="contain"
    />
  </div>
</template>

<script>
import { PROFILE } from 'icons'

export default {
  props: {
    id: {
      type: Number
    },
    title: {
      type: String,
      default: () => '自定义模块'
    },
    iconUrl: {
      type: String,
      default: () => PROFILE.ADD_BLOCK
    },
    tipUrl: {
      type: String,
      default: () => PROFILE.TIPS_TRIANGLE
    },
    showTips: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return { }
  },
  methods: {
    onClick () {
      if (this.id) {
        this.$emit('addModule')
      } else {
        this.$emit('addCustomized')
      }
    }
  }
}
</script>

<style scoped>
.more-span {
  background-color: #fff; border-style: solid; border-width: 1px; border-color: #E9E9E9; border-radius: 12px;
  height: 152px; width: 152px; margin-right: 20px; margin-bottom: 28px;
  justify-content: center; align-items: center; transition: all .2s ease;
}
.more-span:active {
  background-color: #F5F5F5;
}
.name {
  font-size: 26px; color: #222226; letter-spacing: 0;
}
.add-icon {
  height: 42px; width: 42px; margin-bottom: 8px;
}
.tips {
  position: absolute; top: 0; left: 0; height: 68px; width: 68px;
}
</style>
