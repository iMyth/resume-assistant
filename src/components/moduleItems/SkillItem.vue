<template>
  <slide-to-edit
    :deletable="deletable"
    :isHidden="isHidden"
    @showOrHide="$emit('showOrHide')"
    @ondelete="$emit('ondelete')"
  >
    <div
      slot="container"
      class="experience"
      @click="$emit('onEdit')"
    >
      <text class="exp">{{name}}</text>
      <div class="skill">
        <div
          :style="item > level + 1 ? { backgroundColor: defaultColor } : {  backgroundColor: activateColor }"
          class="level"
          v-for="item in maxLevel"
          :key="item"
        ></div>
      </div>
    </div>
  </slide-to-edit>
</template>

<script>
import SlideToEdit from 'components/SlideToEdit.vue'

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
    level: {
      type: Number,
      default: () => 0
    },
    defaultColor: {
      type: String,
      default: () => '#EDEDED'
    },
    activateColor: {
      type: String,
      default: () => '#74C786'
    },
    maxLevel: {
      type: Number,
      default: () => 4
    }
  },
  data () {
    return { }
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
  flex-direction: row;
  height: 104px; width: 710px; justify-content: space-between; align-items: center;
  padding-left: 20px; padding-right: 20px;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.exp {
  width: 400px; lines: 1; text-overflow: ellipsis; font-size: 28px; color: #222226;
}
.skill {
  width: 204px; flex-direction: row;
  justify-content: space-between; align-items: center; lines: 1;
}
.level {
  width: 48px; height: 12px;
}
</style>
