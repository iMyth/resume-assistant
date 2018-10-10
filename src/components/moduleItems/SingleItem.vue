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
      <text class="left">{{leftText}}</text>
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
  lines: 1; white-space: nowrap; font-size: 28px;
  width: 650px; color: #222226; text-overflow: ellipsis; overflow: hidden;
}
</style>