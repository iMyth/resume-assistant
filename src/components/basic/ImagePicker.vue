<template>
  <div class="image-picker">
    <div
      class="img-container"
      @click="pickImage()"
    >
      <image v-if="!imgUrl" :src="addIcon" class="add-img" />
      <text v-if="!imgUrl" class="add-text">{{uploadPhoto}}</text>
      <image
        class="header-icon"
        v-if="imgUrl"
        :src="imgUrl || defaultHeadIcon"
        resize="contain"
      />
    </div>
    <!-- <image
      @click="pickImage"
      class="header-icon"
      resize="cover"
      :src="imgUrl || defaultHeadIcon"
    /> -->
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import bridge from 'bridge'
import { BASIC_INFO } from 'strings'

export default {
  props: {
    imgUrl: {
      type: String,
      default: () => PROFILE.HEAD
    },
    defaultHeadIcon: {
      type: String,
      default: () => PROFILE.HEAD
    },
    uploadPhoto: {
      type: String,
      default: () => BASIC_INFO.labels.PHOTO
    },
    addIcon: {
      type: String,
      default: () => PROFILE.ADD_PHOTO
    }
  },
  methods: {
    /**
     * {
     *   'code': 0,
     *   'error_msg': '',
     *   'data': { 'is_success': true ,'path': '...'} // is_success为true:保存成功，其他值都是失败;path为图片的本地路径
     * }
     */
    pickImage (force) {
      if (this.imgUrl && !force) {
        this.$emit('showEditPhoto')
        return
      }
      let path
      bridge.pickImage().then(p => {
        return new Promise((resolve, reject) => {
          if (!p || !p.path) {
            reject('not ok')
          } else {
            path = p.path
            resolve(p)
            this.$emit('changeValue', {
              path,
              doNotUpload: true
            })
          }
        })
      }).then(p => {
        return bridge.uploadFile({
          path: p.path
        })
      }).then(q => {
        this.$emit('changeValue', {
          path,
          url: q.url
        })
      }).catch(e => {
        // TODO: revert photo
      })
    }
  }
}
</script>

<style scoped>
.image-picker {
  width: 750px; height: 240px; background-color: #FFFFFF;
  justify-content: center; align-items: center; margin-bottom: 20px;
}
.header-icon {
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
  height: 190px; width: 132px; align-items: center; background-color: #F4F4F4;
}
</style>
