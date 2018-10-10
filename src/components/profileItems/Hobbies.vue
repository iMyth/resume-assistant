<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="item.children && !!item.children.length"
    @addClick="$emit('addClick', item)"
  >
    <div v-if="item.children && item.children.length" class="exps" slot="span">
      <normal-item
        v-for="subItem in item.children"
        :key="subItem.id"
        v-bind="adaptor(subItem)"
        :isHidden="!subItem.status"
        @onEdit="onEdit(subItem)"
        @showOrHide="showOrHideItem(subItem)"
        @ondelete="removeItem(subItem)"
      ></normal-item>
      <add-experience @addClick="$emit('addClick', item)" :name="name"></add-experience>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import NormalItem from 'components/moduleItems/SingleItem'
import AddExperience from 'components/common/AddExperience'
import localStorage from 'localStorage'
import { FULL_LIST } from 'strings'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        leftText: p.name,
        rightText: ''
      })
    },
    name: {
      type: String,
      default: () => FULL_LIST.HOBBIES
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
        {}, item, { name: 'hobbies' }
      ))
    },
    removeItem (item) {
      this.$emit('removeItem', Object.assign(
        {}, item, { name: 'hobbies' }
      ))
    }
  },
  components: {
    SpanContainer, NormalItem, AddExperience
  }
}
</script>
