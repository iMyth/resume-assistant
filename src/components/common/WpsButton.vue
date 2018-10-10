<template>
  <div
    @click="$emit('wpsClick')"
    :style="styls"
    class="container"
    :class="{ disabled: !enabled }"
  >
    <text
      class="label"
      :style="textStyle"
      :class="{ disabled: !enabled }"
    >{{label}}</text>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: () => 'button'
    },
    styls: {
      type: Object,
      default: () => ({})
    },
    enabled: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    textStyle () {
      return this.enabled ? { opacity: 1 } : { opacity: 0.35 }
    }
  }
}
</script>

<style scoped>
.container {
  height: 60px; padding-left: 24px; padding-right: 24px; width: 138px;
  background-color: rgba(0, 0, 0, 0.10); border-radius: 4px;
  align-items: center; justify-content: center; opacity: 1;
}
.container:active {
  opacity: 0.35;
}
.disabled:active {
  opacity: 1;
}
.label {
  font-size: 30px; color: #FFFFFF; height: 60px; width: 138px;
  line-height: 60px; text-align: center; opacity: 1;
}
.label:active {
  opacity: 0.35;
}
</style>
