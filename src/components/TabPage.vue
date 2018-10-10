<template>
  <div class="tab-page"
       :style="{backgroundColor:wrapBgColor }">
    <div class="tab-title-list"
         :style="{ backgroundColor: tabStyles.bgColor, height: (tabStyles.height)+'px'}">
      <!-- <div class="title-item"
           ref="tab0"
           @click="setPage(0)"
           :style="{ width: tabStyles.width +'px', height: tabStyles.height +'px' }"
           :accessible="true"
           aria-label="预览">
        <text
          :style="currentPage === 0 ? tabSelectedStyles : { color: '#888888' }"
          class="tab-text">{{labels.preview}}</text>
      </div>
      <div class="title-item"
           ref="tab1"
           @click="setPage(1)"
           :style="{ width: tabStyles.width +'px', height: tabStyles.height +'px' }"
           :accessible="true"
           aria-label="编辑">
        <text
          :style="currentPage === 1 ? tabSelectedStyles : { color: '#888888' }"
          class="tab-text">{{labels.edit}}</text>
      </div>
      <div class="selector" ref="selector" :style="selectorStyle"></div> -->
      <div class="tab-items">
        <div class="selector-block" ref="selector"></div>
        <div
          class="title-item"
          ref="tab0"
          @click="setPage(0)"
        >
          <text
          :style="currentPage === 0 ? tabSelectedStyles : { color: '#696969' }"
          class="tab-text">{{labels.edit}}</text>
        </div>
        <div
          class="title-item"
          ref="tab1"
          @click="setPage(1)"
        >
          <text
          :style="currentPage === 1 ? tabSelectedStyles : { color: '#696969' }"
          class="tab-text">{{labels.preview}}</text>
        </div>
      </div>
    </div>
    <div class="tab-page-wrap" ref="tabPageWrap">
      <div ref="tabContainer"
           class="tab-container" :style="tabContainerStyles">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import strings from 'strings'
import { getPageHeight } from 'util'
const dom = weex.requireModule('dom')
const animation = weex.requireModule('animation')

export default {
  props: {
    tabStyles: {
      type: Object,
      default: () => ({
        bgColor: '#f9f9f9',
        titleColor: '#666666',
        activeTitleColor: '#3D3D3D',
        activeBgColor: '#FFFFFF',
        isActiveTitleBold: true,
        width: 200,
        height: 84,
        textPaddingLeft: 10,
        textPaddingRight: 10
      })
    },
    tabSelectedStyles: {
      type: Object,
      default: () => ({
        // color: '#222226'
        color: '#FFFFFF'
      })
    },
    duration: {
      type: [Number, String],
      default: 200
    },
    timingFunction: {
      type: String,
      default: 'cubic-bezier(0.4, 0, 0.2, 1.2)'
    },
    wrapBgColor: {
      type: String,
      default: '#ededed'
    }
  },
  data: () => ({
    currentPage: 1,
    translateX: 0,
    labels: {
      edit: strings.EDIT,
      preview: strings.PREVIEW
    },
    selectorStyle: {
      display: 'none'
    },
    tabContainerStyles: {
      height: `${getPageHeight() - 84}px`
    }
  }),
  created () {
    // window.setTimeout(() => {
    //   this.resetSelector()
    // }, 100)
    this.$nextTick(() => {
      this.setPage(0, false)
    })
  },
  methods: {
    resetSelector () {
      this.selectorStyle = {
        display: 'block'
      }
      this.setSelector(0)
    },
    setSelector (index) {
      const { $refs, timingFunction, duration } = this
      const { selector } = $refs
      dom.getComponentRect($refs['tab' + index], res => {
        animation.transition(selector, {
          styles: {
            transform: `translateX(${res.size.width * index}px)`
          },
          timingFunction: timingFunction,
          delay: 0,
          duration: duration
        })
      })
    },
    setPage (page, animated = true) {
      this.setSelector(page)
      const previousPage = this.currentPage
      const currentTabEl = this.$refs[`tab${page}`][0]
      const { width } = this.tabStyles
      const appearNum = parseInt(750 / width)
      const offset = page > appearNum ? -(750 - width) / 2 : -width * 2

      if (appearNum < 2) {
        (previousPage > appearNum || page > 1) && dom.scrollToElement(currentTabEl, {
          offset, animated
        })

        page <= 1 && previousPage > page && dom.scrollToElement(currentTabEl, {
          offset: -width * page,
          animated
        })
      }

      this.currentPage = page
      this._animateTransformX(page, animated)
      this.$emit('tabSelected', { page })
    },
    _animateTransformX (page, animated) {
      const { duration, timingFunction } = this
      const computedDur = animated ? duration : 0.00001
      const containerEl = this.$refs.tabContainer
      const dist = page * 750
      animation.transition(containerEl, {
        styles: {
          transform: `translateX(${-dist}px)`
        },
        duration: computedDur,
        timingFunction,
        delay: 0
      }, () => {
      })
    }
  }
}
</script>

<style scoped>
.tab-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
}

.tab-title-list {
  flex-direction: row; justify-content: center; align-items: center;
}

/* .title-item {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-bottom-style: solid;
  position: relative;
  margin-left: 93px;
  margin-right: 93px;
} */
.tab-items {
  width: 304px; height: 58px;
  border-style: solid; border-color: #696969; border-width: 2px;
  border-radius: 100px;
  flex-direction: row; align-items: center;
}

.title-item {
  flex: 1;
}

.tab-text {
  lines: 1;
  font-size: 26px; color: #696969; letter-spacing: -0.08px; text-align: center;
}

.tab-page-wrap {
  width: 750px;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-container {
  position: absolute; flex: 1; flex-direction: row;
  top: 0; bottom: 0; background-color: #ffffff;
}

.selector-block {
  position: absolute; left: -2px; top: -2px; background-color: #696969;
  border-radius: 100px; width: 152px; height: 58px;
}

/* .tab-text {
  lines: 1; color: #888; font-size: 32px;
  text-overflow: ellipsis;
} */

.desc-tag {
  position: absolute;
  top: 10px;
  right: 20px;
  border-bottom-right-radius: 14px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  background-color: #FF5E00;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-left: 6px;
  padding-right: 6px;
}

.desc-text {
  font-size: 18px;
  color: #ffffff;
}

.icon-font {
  margin-bottom: 8px;
  font-family: wxcIconFont;
}
.selector {
  position: absolute; left: 0; bottom: 0; height: 6px; width: 200px; background-color: #696969;
}
</style>
