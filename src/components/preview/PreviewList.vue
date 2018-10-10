<template>
  <div class="preview-list">
    <scroller scroll-direction="horizontal" class="scroller">
      <div @click="setCurrentIndex(index)" class="img-container" v-for="(item, index) in listData" :key="item.id">
        <image class="img" :src="item.thumb_medium_url" resize="cover" />
        <text :style="getTextStyls(index)" class="text">{{item.name}}</text>
        <div class="right-top">
          <image :src="getRightTopIcon()" class="rt-img" />
        </div>
        <div v-if="currentIndex === index" class="selector-bg">
          <image :src="selectorIcon" class="selector" />
        </div>
      </div>
    </scroller>
    <!-- <image class="more" :src="moreIcon" /> -->
  </div>
</template>

<script>
import { PREVIEW } from 'icons'

export default {
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      selectorIcon: PREVIEW.SELECTED,
      moreIcon: PREVIEW.MORE
    }
  },
  methods: {
    getTextStyls (index) {
      if (index === this.currentIndex) {
        return {
          color: '#FF474E'
        }
      }
      return {
        color: '#A7A7A7'
      }
    },
    setCurrentIndex (index) {
      this.$emit('changeIndex', index)
    },
    getRightTopIcon () {
      return PREVIEW.FREE
    }
  }
}
</script>

<style scoped>
.preview-list {
  position: absolute; bottom: 88px; left: 0; margin-right: -24px; background-color: #fff;
  height: 202px; width: 750px;
}
.scroller {
  padding-left: 26px; padding-right: 26px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #f4f4f4;
}
.img-container {
  width: 128px; height: 166px; overflow: hidden; margin-right: 30px;
  margin-top: 16px;
}
.img {
  width: 128px; height: 128px; border-radius: 16px; background-color: rgba(34, 34, 38, 0.30);
}
.text {
  height: 34px; width: 128px; font-size: 24px; color: #A7A7A7;; letter-spacing: -0.29px;
  margin-top: 8px; text-align: center; justify-content: center;
}
.selector-bg {
  position: absolute; width: 128px; height: 128px; left: 0; top: 0; border-radius: 16px;
  justify-content: center; align-items: center; background-color: rgba(34, 34, 38, 0.30);
}
.selector {
  width: 28px; height: 22px;
}
.more {
  position: absolute; top: 0; right: 0; width: 70px; height: 202px;
}
.right-top {
  position: absolute; top: 0; right: 0; width: 84px; height: 32px;
}
.rt-img {
  width: 84px; height: 32px;
}
</style>
