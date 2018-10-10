<template>
  <div class="app-header" v-if="show">
    <div class="left" @click="leftButtonClicked" aria-label="返回" :accessible="true">
       <image :src="leftButton" class="left-button" />
    </div>
    <text class="middle-title" :style="{ color: textColor }">{{title}}</text>
    <div class="right" @click="rightButtonClicked">
      <image class="right-button"
        :src="rightButton"
        :aria-hidden="true" />
    </div>
  </div>
</template>

<script>
import strings from 'strings'
// import { APP_HEADER } from 'icons'

export default {
  props: {
    leftButton: {
      type: String,
      default: 'https://gw.alicdn.com/tfs/TB1x18VpwMPMeJjy1XdXXasrXXa-21-36.png'
    },
    textColor: {
      type: String,
      default: '#696969'
    },
    rightButton: {
      type: String,
      default: () => ''// APP_HEADER.RIGHT_ICON
    },
    title: {
      type: String,
      default: () => strings.SUPER_CV
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    leftButtonReturn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    leftButtonClicked (e) {
      this.$emit('leftButtonClicked', e)
      if (this.leftButtonReturn) {
        this.$router.back()
      }
    },
    rightButtonClicked (e) {
      this.$emit('rightButtonClicked', e)
    }
  }
}
</script>

<style scoped>
  .right-button {
    background-image: url('../assets/images/ic_add_1.png');
  }
  .app-header {
    width: 750px;
    height: 90px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(250, 250, 250, 0.90);
    box-shadow: 0 1px 0 #DBDBDB;
  }

  .left {
    width: 180px;
    padding-left: 32px;
  }

  .middle-title {
    font-size: 36px;
    color: #ffffff;
  }

  .right {
    width: 180px;
    padding-right: 32px;
    align-items: flex-end;
  }

  .left-button {
    width: 21px;
    height: 36px;
  }

  .right-button {
    width: 32px;
    height: 32px;
  }

  .icon-text {
    font-size: 28px;
    color: #fff;
  }
</style>
