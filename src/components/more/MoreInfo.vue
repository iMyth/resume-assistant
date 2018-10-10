<template>
  <div v-if="infoSpans.length > 0" class="more-info">
    <text class="title">{{title}}</text>
    <div class="span-container-body">
      <more-span
        @addModule="$emit('addModule', item)"
        @addCustomized="$emit('addCustomized')"
        v-for="item in infoSpans"
        v-bind="item"
        :key="item.title"
      ></more-span>
    </div>
  </div>
</template>

<script>
import MoreSpan from './MoreSpan.vue'
import { FULL_LIST } from 'strings'

export default {
  props: {
    title: {
      type: String,
      default: () => '更多模块'
    },
    iconUrl: {
      type: String,
      default: () => ''
    },
    items: {
      type: Array
    },
    hasAddedCustomized: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return { }
  },
  computed: {
    infoSpans () {
      let defaultArray = this.hasAddedCustomized ? [] : [{
        id: 0,
        title: FULL_LIST.CUSTOMIZED_MODULE
      }]
      return this.items.concat(defaultArray)
    }
  },
  components: { MoreSpan }
}
</script>

<style scoped>
.more-info {
  width: 710px; margin-top: 20px; margin-bottom: 20px; background-color: #fff; border-radius: 12px;
  padding-top: 26px; padding-right: 20px; padding-bottom: 40px; padding-left: 20px;
}
.title {
  font-size: 24px; color: #888888; letter-spacing: -0.29px; margin-bottom: 24px;
}
.span-container-body {
  flex-direction: row; flex-wrap: wrap; justify-content: flex-start; margin-right: -20px;
}
</style>
