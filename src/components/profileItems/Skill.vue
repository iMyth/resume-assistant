<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="item.children && !!item.children.length"
    @addClick="$emit('addClick', item)"
  >
    <div v-if="item.children && item.children.length" class="exps" slot="span">
      <skill-item
        v-for="subItem in item.children"
        :key="subItem.id"
        v-bind="adaptor(subItem)"
        :isHidden="!subItem.status"
        @onEdit="onEdit(subItem)"
        @showOrHide="showOrHideItem(subItem)"
        @ondelete="removeItem(subItem)"
      ></skill-item>
      <add-experience @addClick="$emit('addClick', item)" :name="name"></add-experience>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import SkillItem from 'components/moduleItems/SkillItem'
import AddExperience from 'components/common/AddExperience'
import { FULL_LIST } from 'strings'
import localStorage from 'localStorage'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        name: p.name,
        level: p.level
      })
    },
    name: {
      type: String,
      default: () => FULL_LIST.SKILL
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
        {}, item, { name: 'skills' }
      ))
    },
    removeItem (item) {
      this.$emit('removeItem', Object.assign(
        {}, item, { name: 'skills' }
      ))
    }
  },
  components: {
    SpanContainer, SkillItem, AddExperience
  }
}
</script>
