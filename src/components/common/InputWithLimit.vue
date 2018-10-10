<template>
  <div :style="styls" class="input-with-limit">
    <input
      ref="input"
      :value="text"
      :style="inputStyls"
      @input="onInput"
      :maxlength="maxLength"
      type="text"
      :placeholder="placeholder"
      class="input name"/>
    <text class="tag">{{currentLength}}/{{maxLength}}</text>
  </div>
</template>

<script>
export default {
  props: {
    maxLength: {
      type: Number,
      default: () => 10
    },
    placeholder: {
      type: String,
      default: () => 'placeholder'
    },
    styls: {
      type: Object,
      default: () => ({})
    },
    inputStyls: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      text: ''
    }
  },
  computed: {
    currentLength () {
      return this.text.length
    }
  },
  created () {
    this.$nextTick(() => {
      this.text = this.value
    })
  },
  methods: {
    onInput (e) {
      this.text = e.value
      this.$emit('onInput', e.value)
    }
  },
  watch: {
    value (v) {
      this.text = v
    }
  }
}
</script>

<style scoped>
.input-with-limit {
  width: 750px; height: 100px; flex-direction: row;
  margin-top: 20px; margin-bottom: 20px; align-items: center;
}
.input {
  placeholder-color: #B2B2B2; height: 98px; color: #696969;
  flex: 1; padding-left: 36px; font-size: 30px; /**  text-indent: 30px; not work **/
}
.tag {
  font-size: 28px; color: #888888; margin-right: 30px; margin-left: 30px;
}
</style>
