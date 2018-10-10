<template>
  <div @click="$emit('addClick', { view: 'basic', info: 'basic' })" class="basic-info">
    <div class="img-container">
      <image v-if="!basicInfo.url" :src="addIcon" class="add-img" />
      <text v-if="!basicInfo.url" class="add-text">{{labels.PHOTO}}</text>
      <image
        class="header-img"
        v-if="basicInfo.url"
        :src="basicInfo.url || defaultHeadIcon"
        resize="contain"
      />
    </div>
    <div class="info">
      <text class="black-font name">{{basicInfo.name || defaultText}}</text>
      <div class="line">
        <text class="light-gray-font small-text gender">{{labels.GENDER}} {{basicInfo.gender || defaultText}}</text><text class="light-gray-font small-text city">{{labels.LOCATION}} {{basicInfo.city || defaultText}}</text>
      </div>
      <text class="light-gray-font small-text">{{labels.MAIL}} {{basicInfo.mail || defaultText}}</text>
      <text class="light-gray-font small-text">{{labels.PHONE}} {{basicInfo.phone || defaultText}}</text>
    </div>
    <div class="right-arrow">
      <image class="icon-right" :src="icon" />
    </div>
  </div>
</template>

<script>
import { PROFILE } from 'icons'
// import navigator from '@/abstract/navigator.js'
import bridge from 'bridge'
import { BASIC_INFO } from 'strings'

// const Navigator = weex.requireModule('navigator')

export default {
  // buggie
  // mixins: [ 'navigator' ],
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    },
    defaultHeadIcon: {
      type: String,
      default: () => PROFILE.HEAD
    },
    icon: {
      type: String,
      default: () => PROFILE.RIGHT_ARROW
    },
    defaultText: {
      type: String,
      default: () => BASIC_INFO.DEFAULT
    },
    labels: {
      type: Object,
      default: () => BASIC_INFO.labels
    },
    addIcon: {
      type: String,
      default: () => PROFILE.ADD_PHOTO
    }
  },
  computed: {
    filePath () {
      let { localPath } = this.basicInfo
      if (localPath) {
        return `file://${localPath}`
      }
      return this.basicInfo.url
    }
  },
  methods: {
    downloadImage (url) {
      bridge.downloadImage({ url }).then(p => {
        if (!p.is_success) {
          return
        }
        this.$emit('imgDownloaded', p.path)
      })
    },
    refreshUrlPath (url) {
      return bridge.refreshUrl({ url })
    }
  },
  watch: {
    'basicInfo' (v) {
      if (!v || !v.url) {
        return
      }
      this.refreshUrlPath(v.url).then(p => {
        if (!p.is_success) {
          this.downloadImage(this.basicInfo.url)
          return
        }
        this.downloadImage(p.url)
      }).catch(() => {
        this.downloadImage(this.basicInfo.url)
      })
    }
  }
}
</script>

<style scoped>
.basic-info {
  margin-bottom: -1px; height: 234px; width: 710px; background-color: #fff;
  flex-direction: row; border-radius: 12px;
}
.header-img {
  height: 190px; width: 132px;
}
.add-img {
  width: 52px; height: 52px; margin-top: 50px;
}
.add-text {
  margin-top: 30px; font-size: 22px; color: #A7A7A7;
  text-align: center; height: 32px; line-height: 32px;
}
.img-container {
  height: 190px; width: 132px; margin-top: 20px; margin-right: 28px;
  margin-left: 20px; align-items: center; background-color: #F4F4F4;
}
.info {
  flex: 1; margin-top: 40px;
}
.line {
  flex-direction: row;
}
.small-text {
  font-size: 24px; margin-bottom: 8px; height: 26px; line-height: 26px;
}
.name {
  margin-bottom: 16px; lines: 1; text-overflow: ellipsis;
}
.gender {
  margin-right: 44px;
}
.right-arrow {
  width: 42px; justify-content: center; align-items: center; margin-right: 20px;
}
.icon-right {
  height: 42px; width: 42px;
}
.black-font {
  color: #222226;
}
.light-gray-font {
  color: #696969; lines: 1; text-overflow: ellipsis;
}
.city {
  width: 300px;
}
</style>
