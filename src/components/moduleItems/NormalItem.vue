<template>
  <slide-to-edit
    :deletable="deletable"
    :isHidden="isHidden"
    @showOrHide="$emit('showOrHide')"
    @ondelete="$emit('ondelete')"
  >
    <div
      @click="$emit('onEdit')"
      slot="container"
      class="experience"
    >
      <div class="left">
        <text class="text medium">{{leftText}}</text>
        <text class="text light-gray">{{getLeftText}}</text>
      </div>
      <text class="right">{{rightText}}</text>
    </div>
  </slide-to-edit>
</template>

<script>
import SlideToEdit from 'components/SlideToEdit.vue'

export default {
  props: {
    deletable: {
      type: Boolean,
      default: () => true
    },
    isHidden: {
      type: Boolean,
      default: () => false
    },
    leftText: {
      type: String,
      default: () => ''
    },
    leftText2: {
      type: String,
      default: () => ''
    },
    rightText: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    getLeftText () {
      if (!this.leftText2) {
        return ''
      }
      if (!this.leftText) {
        return this.leftText2
      }
      return `-${this.leftText2}`
    }
  },
  components: { SlideToEdit }
}
</script>

<style scoped>
.experience {
  flex-direction: row;
  height: 104px; width: 710px; justify-content: space-between; align-items: center;
  padding-left: 20px; padding-right: 20px;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.left {
  flex-direction: row; flex-wrap: nowrap;
  width: 340px; color: #222226; text-overflow: ellipsis; overflow: hidden;
}
.right {
  width: 320px; color: #696969; text-align: right; font-size: 28px;
}
.light-gray {
  color: #888888;
}
.text {
  lines: 1; text-overflow: ellipsis; overflow: hidden; font-size: 28px;
}
.medium {
  font-family: PingFangSC-Medium; font-size: 28px;
}
</style>
