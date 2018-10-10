<template>
  <span-container
    v-bind="item"
    :key="item.id"
    :hasContent="item.children && !!item.children.length"
    :showTips="showTips"
    :descTxt="descTxt"
    @addClick="$emit('addClick', item)"
  >
    <div v-if="item.children && item.children.length" class="exps" slot="span">
      <career-item
        v-for="subItem in item.children"
        :key="subItem.id"
        v-bind="adaptor(subItem)"
        :isHidden="!subItem.status"
        @onEdit="onEdit(subItem)"
        @showOrHide="showOrHideItem(subItem)"
        @ondelete="removeItem(subItem)"
      ></career-item>
      <add-experience @addClick="$emit('addClick', item)" :name="name"></add-experience>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import CareerItem from 'components/moduleItems/CareerItem'
import AddExperience from 'components/common/AddExperience'
import { FULL_LIST, CAREER_BACKGROUND } from 'strings'
import localStorage from 'localStorage'
import { periodToString } from 'util'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        id: p.id,
        name: p.name || CAREER_BACKGROUND.COMPANY_NAME,
        desc: periodToString(p.period) || CAREER_BACKGROUND.SERVICE_PERIOD,
        jobTitle: p.position || CAREER_BACKGROUND.POSITION,
        specification: p.specification || CAREER_BACKGROUND.JOB_SPECIFICATION
      })
    },
    name: {
      type: String,
      default: () => FULL_LIST.CAREER_BACKGROUND
    },
    showTips: {
      type: Boolean,
      default: () => true
    },
    descTxt: {
      type: String,
      default: () => CAREER_BACKGROUND.DESC
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
        {}, item, { name: 'careerBackground' }
      ))
    },
    removeItem (item) {
      this.$emit('removeItem', Object.assign(
        {}, item, { name: 'careerBackground' }
      ))
    }
  },
  components: {
    SpanContainer, CareerItem, AddExperience
  }
}
</script>
