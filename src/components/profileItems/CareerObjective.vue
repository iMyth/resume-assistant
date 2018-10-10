<template>
  <span-container
    :key="item.id"
    :hasContent="hasContent"
    :id="item.id"
    :title="item.title"
    :view="item.view"
    :children="item.children"
    @addClick="$emit('addClick', item)"
  >
    <div
      v-if="hasContent"
      @click="$emit('addClick', item)"
      class="exps"
      slot="span"
    >
      <vision-item
        @onEdit="$emit('addClick', item)"
        :deletable="false"
        v-bind="adaptor(subItem)"
      ></vision-item>
    </div>
  </span-container>
</template>

<script>
import SpanContainer from 'components/SpanContainer'
import VisionItem from 'components/moduleItems/VisionItem'
import { CAREER } from 'strings'

export default {
  props: {
    item: {
      type: Object
    },
    adaptor: {
      type: Function,
      default: p => ({
        id: p.id,
        objective: p.objective || CAREER.CAREER_OBJECTIVE,
        industry: p.industry || CAREER.INDUSTRY_OBJECTIVE,
        salary: p.salary || CAREER.SALARY_REQUIREMENTS,
        city: p.city || CAREER.WORK_CITY
      })
    }
  },
  computed: {
    subItem () {
      return this.item.children
    },
    hasContent () {
      return !!(this.subItem.objective || this.subItem.city || this.subItem.salary || this.subItem.industry)
    }
  },
  components: { SpanContainer, VisionItem }
}
</script>
