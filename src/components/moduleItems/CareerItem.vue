<template>
  <slide-to-edit
    height="156px"
    :isHidden="isHidden"
    :deletable="deletable"
    @showOrHide="$emit('showOrHide')"
    @ondelete="$emit('ondelete')"
  >
    <div
      slot="container"
      class="experience"
      @click="$emit('onEdit')"
    >
      <text class="name">{{name}}</text>
      <text class="desc">{{desc}}</text>
      <text class="pos">{{jobTitle}}</text>
      <text class="job">{{specification}}</text>
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
      default: () => 'skill'
    },
    desc: {
      type: String,
      default: () => 'period'
    },
    jobTitle: {
      type: String,
      default: () => 'job title'
    },
    specification: {
      type: String,
      default: () => '全职'
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
    }
  },
  methods: { },
  components: { SlideToEdit }
}
</script>

<style scoped>
.experience {
  flex-direction: row; flex-wrap: wrap;
  height: 156px; width: 710px; justify-content: space-between; align-items: space-between;
  padding-left: 20px; padding-right: 20px;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  padding-top: 32px; padding-bottom: 32px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.name, .pos {
  width: 340px; text-align: left; font-size: 28px; color: #222226; height: 40px; line-height: 40px;
  lines: 1; text-overflow: ellipsis; overflow: hidden;
}
.desc, .job {
  width: 320px; text-align: right; font-size: 28px; height: 40px; line-height: 40px;
  lines: 1; text-overflow: ellipsis; overflow: hidden;
}
.name, .desc {
  margin-bottom: 16px; lines: 1;
}
.name {
  font-family: PingFangSC-Medium; font-size: 28px;
}
.desc {
  color: #888888;
}
.job, .pos {
  color: #696969;
}
</style>
