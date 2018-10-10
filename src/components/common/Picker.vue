<template>
  <div :style="styls" class="picker">
    <text
      :style="titleStyls"
      class="title"
    >{{title}}</text>
    <text
      v-if="!isInput && value"
      @click="$emit('pickeValue')"
      class="value"
    >{{value}}</text>
    <text
      v-if="!isInput && !value"
      :style="titleStyls"
      @click="$emit('pickeValue')"
      class="value placeholder"
    >{{placeholder}}</text>
    <image
      v-if="!isInput && (!value || !optional)"
      @click="$emit('pickeValue')"
      class="icon"
      :src="iconClass"
    />
    <image
      v-if="!isInput && (value && optional)"
      @click="$emit('clearValue')"
      class="icon"
      :src="iconDel"
    />
    <input-with-limit
      :maxLength="maxLength"
      :styls="inputStyle"
      v-if="isInput"
      :placeholder="placeholder"
      :value="value"
      @onInput="onInput"
    ></input-with-limit>
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import InputWithLimit from 'components/common/InputWithLimit'

export default {
  props: {
    title: {
      type: String,
      default: () => 'default title'
    },
    value: {
      type: String,
      default: () => ''
    },
    iconClass: {
      type: String,
      default: () => PROFILE.FOLD_2
    },
    iconDel: {
      type: String,
      default: () => PROFILE.CLOSE
    },
    styls: {
      type: Object,
      default: () => ({})
    },
    titleStyls: {
      type: Object,
      default: () => ({})
    },
    isInput: {
      type: Boolean,
      default: () => false
    },
    inputStyle: {
      type: Object,
      default: () => ({
        width: '570px',
        marginRight: '-30px',
        marginTop: '0',
        marginBottom: '0'
      })
    },
    maxLength: {
      type: Number,
      default: () => 50
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    optional: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    onInput (v) {
      this.$emit('onInput', v)
    }
  },
  components: { InputWithLimit }
}
</script>

<style scoped>
.picker {
  width: 750px; height: 100px; flex-direction: row;
  border-bottom-style: solid; border-bottom-width: 1px;
  border-bottom-color: #dbdbdb; background-color: #fff;
  align-items: center; justify-content: flex-start;
  padding-left: 30px; padding-right: 30px;
}
.title {
  height: 100px; width: 240px; line-height: 100px; white-space: nowrap;
  justify-content: flex-start; color: #222226; font-size: 30px;
  border-right-style: solid; border-right-width: 1px; border-right-color: #dbdbdb;
}
.value {
  flex: 1; height: 100px; color: #696969; font-size: 30px; line-height: 100px;
  padding-left: 36px;
}
.value:active {
  background-color: rgba(116, 199, 134, 0.15);
}
.placeholder {
  color: #B2B2B2;
}
.icon {
  width: 42px; height: 42px;
}
</style>
