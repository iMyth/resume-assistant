<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="true"
  >
    <div @click="onEdit(item.children)" class="text-container" slot="span">
      <text lines="3" class="text">{{item.children}}</text>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import NormalItem from 'components/moduleItems/NormalItem'
import localStorage from 'localStorage'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        id: p.id,
        leftText: p.objective,
        rightText: p.type
      })
    }
  },
  methods: {
    onEdit (item) {
      localStorage.setParameters(item).then(() => {
        this.$emit('addClick', this.item)
      })
    }
  },
  components: { SpanContainer, NormalItem }
}
</script>

<style scoped>
.text {
  lines: 3;
  font-size: 28px; color: #696969;
  width: 670px;
  margin-top: 22px; margin-right: 20px;
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis; height: 136px;
}
.text-container {
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
  height: 160px; padding-bottom: 20px;
}
</style>
