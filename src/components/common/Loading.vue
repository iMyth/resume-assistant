<template>
  <div class="loading"></div>
</template>

<script>
export default {
  props: {
    styls: {
      type: Object,
      default: () => ({
        height: '184px',
        width: '224px'
      })
    }
  },
  data () {
    return { }
  }
}
</script>

<style scoped>
.loading {
  background-color: rgba(16, 16, 16, 0.96); border-radius: 20px;
}
</style>
