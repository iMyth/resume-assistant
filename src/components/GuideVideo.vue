<template>
  <div class="guide" :style="guideStyle">
    <video
      class="video"
      width="750px"
      :src="src"
      autoplay controls
      @start="onstart"
      @pause="onpause"
      @finish="onfinish"
      @fail="onfail"
    >
    </video>
    <div @click="$emit('closeGuide')" class="button">
      <div class="press-status">
        <text class="btn-text">{{enterText}}</text>
      </div>
    </div>
  </div>
</template>

<script>
import strings from 'strings'
import { getPageHeight } from 'util'
import { GUIDE } from 'icons'

export default {
  props: {
    src: {
      type: String,
      default: () => GUIDE.VIDEO
    },
    enterText: {
      type: String,
      default: () => strings.TRY_SUPER_CV
    }
  },
  data () {
    return {
      state: '----'
    }
  },
  methods: {
    onstart (event) {
      this.state = 'onstart'
    },
    onpause (event) {
      this.state = 'onpause'
    },
    onfinish (event) {
      this.state = 'onfinish'
    },
    onfail (event) {
      this.state = 'onfinish'
    }
  },
  computed: {
    guideStyle () {
      return {
        height: `${getPageHeight()}px`,
        width: '500px'
      }
    }
  }
}
</script>

<style scoped>
.guide {
  width: 750px; align-items: center; justify-content: center;
}
.button {
  position: absolute; bottom: 80px; left: 60px;
  width: 630px; height: 110px; background-color: #74C786; border-radius: 10px;
  align-items: center; justify-content: center;
}
.btn-text {
  color: #FFFFFF; font-family: PingFangSC-Medium; font-size: 40px;
}
.press-status {
  flex: 1; align-items: center; justify-content: center; flex-direction: row;
  height: 110px; width: 630px; opacity: 1;
}
.press-status:active {
  opacity: 0.35;
}
.video {
  width: 750px; flex: 1; justify-content: center; align-items: center;
}
</style>
