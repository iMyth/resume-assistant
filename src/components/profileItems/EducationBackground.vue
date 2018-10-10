<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="item.children && !!item.children.length"
    @addClick="$emit('addClick', item)"
  >
    <div v-if="item.children && item.children.length" class="exps" slot="span">
      <normal-item
        @onEdit="onEdit(subItem)"
        v-for="subItem in item.children"
        :key="subItem.id"
        v-bind="adaptor(subItem)"
        :isHidden="!subItem.status"
        @showOrHide="showOrHideItem(subItem)"
        @ondelete="removeItem(subItem)"
      ></normal-item>
      <add-experience @addClick="$emit('addClick', item)" :name="name"></add-experience>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import NormalItem from 'components/moduleItems/NormalItem'
import AddExperience from 'components/common/AddExperience'
import { FULL_LIST } from 'strings'
import localStorage from 'localStorage'
import { periodToString } from 'util'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({ leftText: p.name, rightText: periodToString(p.period) })
    },
    name: {
      type: String,
      default: () => FULL_LIST.EDUCATION_BACKGROUND
    }
  },
  methods: {
    onEdit (item) {
      localStorage.setParameters(item).then(() => {
        this.$emit('addClick', this.item)
      })
    },
    showOrHideItem (item) {
      this.$emit('showOrHideItem', Object.assign(
        {}, item, { name: 'education' }
      ))
    },
    removeItem (item) {
      this.$emit('removeItem', Object.assign(
        {}, item, { name: 'education' }
      ))
    }
  },
  components: {
    SpanContainer, NormalItem, AddExperience
  }
}
</script>
