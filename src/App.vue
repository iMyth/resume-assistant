<template>
  <div :style="styls" @androidback="back">
    <transition :name="transitionName">
      <router-view style="flex:1"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        styls: { backgroundColor: '#f4f4f4' },
        transitionName: 'slide-left'
      }
    },
    beforeRouteUpdate (to, from, next) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      next()
    },
    methods: {
      back: function () {
        this.$router.back()
      }
    }
  }
</script>

<!-- buggie, css not work on iOS -->
<!-- <style src='../src/assets/main.css' /> -->
<style scoped>
/* .silde-enter-active, .silde-leave-active {
  transition-property: opacity;
  transition-duration: .5s;
}

.silde-enter-active {
  transition-delay: .5s;
}

.silde-enter, .silde-leave-active {
  opacity: .2
} */
</style>
