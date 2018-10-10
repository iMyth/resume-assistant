<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="item.children && !!item.children.length"
    :categoryId="item.id"
    @addClick="$emit('addClick', item)"
    :couldRename="true"
    @rename="rename"
  >
    <div v-if="item.children && item.children.length" class="exps" slot="span">
      <project-item
        v-for="subItem in item.children"
        :key="subItem.id"
        v-bind="adaptor(subItem)"
        :isHidden="!subItem.status"
        @onEdit="onEdit(subItem)"
        @showOrHide="showOrHideItem(subItem)"
        @ondelete="removeItem(subItem)"
      ></project-item>
      <add-experience @addClick="$emit('addClick', item)" :name="name"></add-experience>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import ProjectItem from 'components/moduleItems/ProjectItem'
import AddExperience from 'components/common/AddExperience'
import localStorage from 'localStorage'
import { FULL_LIST } from 'strings'
import { periodToString } from 'util'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        name: [ p.name, p.role ].filter(p => p).join('_'),
        period: periodToString(p.period),
        desc: p.desc
      })
    },
    name: {
      type: String,
      default: () => FULL_LIST.CUSTOMIZED_MODULE
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
        {}, item, { name: 'customized' }
      ))
    },
    removeItem (item) {
      this.$emit('removeItem', Object.assign(
        {}, item, { name: 'customized' }
      ))
    },
    rename () {
      this.$emit('rename', this.item.id)
    }
  },
  components: {
    SpanContainer, ProjectItem, AddExperience
  }
}
</script>
