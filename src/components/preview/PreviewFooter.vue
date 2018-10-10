<template>
  <div class="preview-footer">
    <!-- <button-bar
      v-if="!finished"
      :name="applyTxt"
      :styls="{ position: 'absolute', backgroundColor: '#FFFFFF' }"
      @buttonClick="$emit('clickComfirm')"
    ></button-bar> -->
    <!-- <div @click="$emit('changeTpl')" v-if="finished" class="change-tpl clickable">
      <image class="icon" :src="changeTpl" />
      <text class="change-txt">{{changeTplTxt}}</text>
    </div> -->
    <div @click="$emit('export')" class="export clickable">
      <image class="icon" :src="exportIcon" />
      <text class="export-txt">{{exportTxt}}</text>
    </div>
  </div>
</template>

<script>
import ButtonBar from 'components/common/ButtonBar'
import { PREVIEW } from 'icons'
import strings from 'strings'

export default {
  props: {
    finished: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      confirm: PREVIEW.COMFIRM,
      cancel: PREVIEW.CANCEL,
      changeTpl: PREVIEW.CHANGE_TPL,
      exportIcon: PREVIEW.EXPORT,
      changeTplTxt: strings.CHANGE_TPL,
      exportTxt: strings.EXPORT,
      applyTxt: strings.APPLY_TPL
    }
  },
  components: { ButtonBar }
}
</script>

<style scoped>
.preview-footer {
  position: absolute; width: 750px; height: 88px; background-color: #FFFFFF;
  left: 0; bottom: 0; padding-left: 21px; padding-right: 27px;
  flex-direction: row; justify-content: space-around; align-items: center;
  border-top-color: #F4F4F4; border-top-style: solid;
  border-top-width: 2px;
}
.icon {
  width: 52px; height: 52px;
}
/* .icon:active {
  opacity: .35;
} */
/** buggie, clickable:active **/
.clickable {
  opacity: 1;
}
.clickable:active {
  opacity: .35;
}
.change-tpl, .export {
  /* position: absolute; top: 36px; */
  flex-direction: row; align-items: center; justify-content: center;
}
.change-tpl {
  left: 94px;
}
/* .export {
  right: 124px;
} */
.change-txt {
  font-size: 32px; color: #696969; margin-left: 10px;
}
/** color: #A7A7A7; **/
.export-txt {
  font-size: 32px; color: #696969; margin-left: 10px;
}
.button {
  height: 88px; width: 690px; justify-content: center; align-items: center;
  background-color: #74C786; border-radius: 8px; margin-left: 30px;
}
.text {
  flex: 1; justify-content: center; align-items: center; width: 690px;
  height: 88px; line-height: 88px; text-align: center;
  color: #fff; font-size: 32px;
}
</style>
