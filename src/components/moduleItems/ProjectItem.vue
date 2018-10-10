<template>
  <slide-to-edit
    :height="height"
    :isHidden="isHidden"
    :deletable="deletable"
    @showOrHide="$emit('showOrHide')"
    @ondelete="$emit('ondelete')"
  >
    <div
      slot="container"
      class="experience"
      @click="$emit('onEdit')"
      :style="spanStyle"
    >
      <div class="name">
        <text class="text medium">{{name}}</text>
        <text class="text light-gray">{{getRole}}</text>
      </div>
      <text class="text period">{{period}}</text>
      <text v-if="!!desc" class="text desc">{{desc}}</text>
    </div>
  </slide-to-edit>
</template>

<script>
import SlideToEdit from 'components/SlideToEdit'

export default {
  props: {
    isHidden: {
      type: Boolean,
      default: () => false
    },
    deletable: {
      type: Boolean,
      default: () => true
    },
    name: {
      type: String,
      default: () => ''
    },
    role: {
      type: String,
      default: () => ''
    },
    period: {
      type: String,
      default: () => ''
    },
    desc: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    skillLevel () {
      if (this.level < 1) {
        return 1
      }
      if (this.level > 4) {
        return 4
      }
      return this.level
    },
    height () {
      return this.desc ? '176px' : '100px'
    },
    spanStyle () {
      return { height: this.height }
    },
    getRole () {
      if (!this.role) {
        return ''
      }
      if (!this.name) {
        return this.role
      }
      return `-${this.role}`
    }
  },
  methods: { },
  components: { SlideToEdit }
}
</script>

<style scoped>
.experience {
  flex-direction: row; flex-wrap: wrap;
  height: 176px; width: 710px; justify-content: space-between; align-items: space-between;
  padding-left: 20px; padding-right: 20px;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  padding-top: 32px; padding-bottom: 28px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.name {
  width: 340px; text-align: left; font-size: 28px; color: #222226; height: 40px; line-height: 40px;
}
.period {
  width: 320px; text-align: right; font-size: 28px; height: 40px; line-height: 40px;
}
.name, .period {
  margin-bottom: 36px; lines: 1; text-overflow: ellipsis; overflow: hidden;
}
.name {
  color: #222226; flex-direction: row; text-overflow: ellipsis; overflow: hidden;
}
.desc, .period {
  color: #696969; lines: 1; text-overflow: ellipsis; overflow: hidden;
}
.desc {
  font-size: 28px; text-overflow: ellipsis; overflow: hidden;
  white-space: nowrap; width: 670px; height: 40px; line-height: 40px;
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
