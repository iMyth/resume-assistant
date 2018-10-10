<template>
  <div class="button-bar" :style="styls">
    <div @click="$emit('buttonClick')" :style="buttonStyls" class="button">
      <text class="text" :style="textStyls">{{name}}</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: () => 'default text'
    },
    textStyls: {
      type: Object,
      default: () => ({
        color: '#fff',
        fontSize: '30px'
      })
    },
    buttonStyls: {
      type: Object,
      default: () => ({
        backgroundColor: '#74C786',
        borderRadius: '8px'
      })
    },
    styls: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.button-bar {
  position: absolute; bottom: 0; left: 0;
  width: 750px; height: 128px; background: #FFFFFF; box-shadow: inset 0 1px 0 #DBDBDB;
  justify-content: center; align-items: center;
}
.button {
  height: 88px; width: 690px; justify-content: center; align-items: center;
}
/* .button:active {
  opacity: .35;
} */
.text {
  flex: 1; justify-content: center; align-items: center; width: 690px;
  height: 88px; line-height: 88px; text-align: center; opacity: 1;
}
.text:active {
  opacity: .35;
}
</style>
