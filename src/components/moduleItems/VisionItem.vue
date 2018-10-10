<template>
  <div
    @click="$emit('onEdit')"
    slot="container"
    class="experience"
  >
    <text class="objective">{{objective}}</text>
    <text class="salary">{{salary}}</text>
    <text class="industry">{{industry}}</text>
    <text class="city">{{city}}</text>
  </div>
</template>

<script>

export default {
  props: {
    deletable: {
      type: Boolean,
      default: () => true
    },
    isHidden: {
      type: Boolean,
      default: () => false
    },
    objective: {
      type: String,
      default: () => ''
    },
    industry: {
      type: String,
      default: () => ''
    },
    salary: {
      type: String,
      default: () => ''
    },
    city: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style scoped>
.experience {
  flex-direction: row; flex-wrap: wrap;
  height: 152px; width: 710px; justify-content: space-between; align-items: space-between;
  padding-left: 20px; padding-right: 20px; padding-top: 32px;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  border-top-style: solid; border-top-width: 1px; border-top-color: #E9E9E9;
}
.objective {
  width: 340px; color: #222226; text-overflow: ellipsis; overflow: hidden;
  height: 40px; lines: 1; font-family: PingFangSC-Medium; font-size: 28px;
}
.salary {
  width: 320px; color: #222226; text-align: right; height: 40px; lines: 1;
  font-family: PingFangSC-Medium; font-size: 28px;
}
.industry, .city {
  width: 340px; font-size: 24px; color: #696969; text-overflow: ellipsis;
  overflow: hidden; margin-top: 12px; height: 34px; lines: 1;
}
.city {
  width: 320px; text-align: right;
}
</style>
