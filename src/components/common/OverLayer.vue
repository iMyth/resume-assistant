<template>
  <div class="edit-prompt"
    ref="editPrompt"
    v-if="show"
    :hack="shouldShow"
    :style="overlayStyle">
    <slot name="dialog"></slot>
  </div>
</template>

<script>
const animation = weex.requireModule('animation')

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: () => 300
    },
    overlayStyle: {
      type: Object,
      default: () => ({
        opacity: 0,
        backgroundColor: 'rgba(0, 0, 0, .6)'
      })
    }
  },
  computed: {
    // hack
    shouldShow () {
      const { show } = this
      setTimeout(() => {
        this._animate(show)
      }, 50)
      return show
    }
  },
  methods: {
    _animate (bool, event, duration = this.duration) {
      const el = this.$refs.editPrompt
      if (el) {
        animation.transition(el, {
          styles: {
            opacity: bool ? 1 : 0
          },
          duration,
          timingFunction: bool ? 'ease-in' : 'ease-out',
          delay: 0
        }, () => {
          event && this.$emit(event, {})
        })
      }
    }
  }
}
</script>

<style scoped>
.edit-prompt {
  width: 750px; position: fixed; top: 0; right: 0; bottom: 0; left: 0;
  justify-content: center; align-items: center;
}
</style>
