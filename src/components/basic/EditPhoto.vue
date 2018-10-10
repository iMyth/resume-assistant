<template>
  <div class="container">
    <div class="change-photo">
      <text @click="$emit('clickEdit')" class="edit">{{editTxt}}</text>
      <text @click="$emit('clickDel')" class="del">{{delTxt}}</text>
    </div>
    <text @click="$emit('cancel')" class="cancel">{{cancelTxt}}</text>
  </div>
</template>

<script>
import { BASIC_INFO } from 'strings'

export default {
  name: 'edit-photo',
  props: {
    editTxt: {
      type: String,
      default: () => BASIC_INFO.CHANGE_PHOTO
    },
    delTxt: {
      type: String,
      default: () => BASIC_INFO.DEL_PHOTO
    },
    cancelTxt: {
      type: String,
      default: () => BASIC_INFO.CANCEL
    }
  }
}
</script>

<style scoped>
.container {
  height: 384px; width: 750px; background: transparent; padding-left: 21px;
}
.edit, .del, .cancel {
  width: 708px; height: 114px;
  font-family: PingFangSC-Regular; font-size: 40px; color: #0076FF;
  letter-spacing: -0.43px; text-align: center; line-height: 114px;
  opacity: 1;
}
.edit:active, .del:active, .cancel:active {
  opacity: 0.95;
}
.change-photo {
  width: 708px;
}
.change-photo, .cancel {
  border-radius: 28px; overflow: hidden; background-color: #FAFAFA;
}
.cancel {
  margin-top: 16px;
}
.del {
  color: #FF3A30; border-top-style: solid; border-top-width: 2px; border-top-color: #ECECEC;
}
</style>

