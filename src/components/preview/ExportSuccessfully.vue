<template>
  <over-layer :show="show">
    <div slot="dialog" class="dialog">
      <image class="uploadedIcon" :src="uploadedIcon" />
      <text class="title">{{title}}</text>
      <text class="info">{{info}}</text>
      <image class="my-resumes" :src="myResumeIcon" />
      <div class="footer">
        <text @click="$emit('noted')" class="ok">{{okBtnTxt}}</text>
        <text @click="$emit('openFile')" class="open">{{openBtnTxt}}</text>
      </div>
    </div>
  </over-layer>
</template>

<script>
import { PREVIEW } from 'icons'
import strings from 'strings'
import OverLayer from 'components/common/OverLayer'

// const animation = weex.requireModule('animation')

export default {
  props: {
    uploadedIcon: {
      type: String,
      default: () => PREVIEW.UPLOADED
    },
    myResumeIcon: {
      type: String,
      default: () => PREVIEW.MY_RESUME
    },
    title: {
      type: String,
      default: () => strings.EXPORTED
    },
    info: {
      type: String,
      default: () => strings.VIEW_FILE
    },
    okBtnTxt: {
      type: String,
      default: () => strings.NOTED
    },
    openBtnTxt: {
      type: String,
      default: () => strings.OPEN
    },
    comfirmLabel: {
      type: String,
      default: () => strings.EDIT_CV
    },
    show: {
      type: Boolean,
      default: () => false
    }
  },
  methods: { },
  components: { OverLayer }
}
</script>

<style scoped>
.dialog {
  width: 540px; height: 484px; align-items: center; justify-content: flex-start;
  background-color: #FFFFFF; border-radius: 24px;
}
.uploadedIcon {
  height: 72px; width: 72px; margin-top: 36px;
}
.title {
  font-size: 34px; color: #030303; margin-top: 26px; margin-bottom: 20px;
}
.info {
  font-size: 28px; color: #888888; margin-bottom: 26px;
}
.my-resumes {
  width: 400px; height: 118px;
}
.ok {
  font-size: 34px; color: #222226; height: 84px; line-height: 84px;
  width: 270px; border-right-style: solid; border-right-color: #F4F4F4;
  border-right-width: 2px; text-align: center;
}
.open {
  font-size: 34px; color: #0076FF; height: 84px; line-height: 84px;
  width: 270px; text-align: center;
}
.footer {
  height: 86px; border-top-style: solid; border-top-width: 1px; border-top-color: #F4F4F4;
  flex-direction: row; align-items: center; position: absolute; bottom: 0;
}
</style>
