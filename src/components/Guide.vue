<template>
  <div class="guide" :style="guideStyle">
    <slider
      :index="index"
      :style="guideStyle"
      class="slider"
      interval="4500"
      @change="onchange"
    >
      <div class="frame">
        <image class="img-bg" :src="bg" />
        <image class="img img-1" :src="img1" />
        <image resize="cover" class="img-bottom" :src="img4" />
        <!-- <text class="title h1">{{h1}}</text> -->
        <text class="title value value-top">{{d11}}</text>
        <text class="title value">{{d12}}</text>
        <!-- <div
          class="button"
          @click="click"
        >
          <text
            class="btn-text"
          >{{enter}}</text>
        </div> -->
      </div>
      <div class="frame frame2">
        <image class="img-bg" :src="bg" />
        <image class="img img-2" :src="img2" />
        <image resize="cover" class="img-bottom" :src="img4" />
        <!-- <text class="title title2 h2">{{h2}}</text> -->
        <text class="title value">{{d2}}</text>
        <!-- <div
          class="button button2"
          @click="click"
        >
          <text
            class="btn-text btn-text2"
          >{{enter}}</text>
        </div> -->
      </div>
      <div class="frame frame2">
        <image class="img-bg" :src="bg" />
        <image class="img img-3" :src="img3" />
        <image resize="cover" class="img-bottom" :src="img4" />
        <!-- <text class="title title2 h2">{{h3}}</text> -->
        <text class="title value value-top">{{d31}}</text>
        <text class="title value">{{d32}}</text>
        <!-- <div
          class="button button2"
          @click="click"
        >
          <text
            class="btn-text btn-text2"
          >{{enter}}</text>
        </div> -->
      </div>
      <indicator class="indicator"></indicator>
    </slider>
    <div
      class="button"
      @click="click"
    >
      <text
        class="btn-text btn-text2"
      >{{buttonTxt}}</text>
    </div>
  </div>
</template>

<script>
import strings from 'strings'
import { getPageHeight } from 'util'
import { GUIDE } from 'icons'
const Navigator = weex.requireModule('navigator')

const backgroundColorMapping = [ '#74C786', '#FFFFFF', '#FFFFFF' ]
const buttonColorMapping = [ '#FFFFFF', '#74C786', '#74C786' ]

export default {
  data () {
    return {
      d11: strings.d11,
      d12: strings.d12,
      d2: strings.d2,
      d31: strings.d31,
      d32: strings.d32,
      enter: strings.TRY_SUPER_CV,
      backgroundColor: '#74C786',
      index: 0,
      img1: GUIDE.IMG1,
      img2: GUIDE.IMG2,
      img3: GUIDE.IMG3,
      img4: GUIDE.IMG4,
      bg: GUIDE.IMG_BG
    }
  },
  computed: {
    guideStyle () {
      return {
        height: `${getPageHeight()}px`
        // backgroundColor: backgroundColorMapping[this.index]
      }
    },
    buttonTxt () {
      return this.index === 2 ? strings.TRY_SUPER_CV : strings.NEXT_PAGE
    },
    buttonStyle () {
      return {
        backgroundColor: buttonColorMapping[this.index]
      }
    },
    textStyle () {
      return {
        color: backgroundColorMapping[this.index]
      }
    }
  },
  methods: {
    onchange (event) {
      this.index = event.index
      // Navigator.setNavBarTitle({
      //   title: '',
      //   backgroundColor: buttonColorMapping[this.index]
      // }, () => { })
      // console.log('changed:', event.index)
    },
    click () {
      if (this.index !== 2) {
        this.index++
        return
      }
      this.$emit('closeGuide')
    },
  }
}
</script>

<style scoped>
.guide {
  width: 750px;
}
.slider {
  width: 750px;
}
.button {
  position: absolute; bottom: 80px; left: 60px;
  width: 630px; height: 110px; background-color: #74C786; border-radius: 10px;
  align-items: center; justify-content: center;
}
/* .button2 {
  background-color: #74C786;
} */
.btn-text {
  color: #FFFFFF; font-family: PingFangSC-Medium; font-size: 40px;
}
/* .btn-text2 {
  color: #FFFFFF;
} */
/** buggie, flexbox layout not work??? **/
.title {
  color: #FFFFFF; width: 750px; position: absolute; left: 0;
  text-align: center; font-family: PingFangSC-Medium; font-size: 64px;
  margin-bottom: 10px;
}
/* .h1 {
  top: 482px;
}
.d1 {
  top: 582px;
}
.h2, h3 {
  top: 770px;
}
.d2, d3 {
  top: 856px;
} */
.title2 {
  font-family: PingFangSC-Medium; font-size: 48px; color: #222226;
  margin-bottom: 20px;
}
.value {
  width: 750px; text-align: center; position: absolute; bottom: 310px;
  font-family: PingFangSC-Regular; font-size: 40px; color: #696969;
  letter-spacing: -0.48px; height: 56px; line-height: 56px;
}
.value-top {
  bottom: 366px;
}
.frame {
  width: 750px; flex: 1; background-color: #74C786;
  align-items: center; flex-direction: column; position: relative;
}
.frame2 {
  background-color: #FFFFFF;
}
/* .img1 {
  position: absolute; top: 176px; left: 251px;
  height: 248px; width: 248px; margin-bottom: 58px;
}
.img2 {
  position: absolute; top: 80px; left: 111px;
  width: 528px; height: 630px; margin-bottom: 60px;
}
.img3 {
  position: absolute; top: 80px; left: 132px;
  width: 486px; height: 630px; margin-bottom: 60px;
} */
.img {
  position: absolute;
}
.img-1 {
  width: 610px; height: 648px; bottom: 544px; left: 70px;
}
.img-2 {
  width: 548px; height: 692px; bottom: 446px; left: 101px;
}
.img-3 {
  width: 528px; height: 688px; bottom: 450px; left: 111px;
}
.img-bg {
  position: absolute; top: 0; left: 0; width: 750px; height: 1334px;
}
.img-bottom {
  position: absolute; bottom: 0; left: 0; width: 750px; height: 524px;
}
.indicator {
  width: 750px; height: 16px;
  item-color: #D8D8D8;
  item-selected-color: #74C786;
  item-size: 16px;
  position: absolute;
  bottom: 264px;
  justify-content: center;
}
</style>
