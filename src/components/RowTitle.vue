<template>
  <div class="row-title">
    <text class="row-title-text">{{title}}</text>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => 'default'
    }
  }
}
</script>

<style scoped>
.row-title {
  height: 80px; width: 750px; background-color: #F4F4F4; justify-content: center;
  padding-left: 30px;
}
.row-title-text {
  color: #696969; font-size: 28px; margin-top: 8px;
}
</style>
