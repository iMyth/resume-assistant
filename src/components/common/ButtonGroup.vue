<template>
  <div :style="styls" class="button-group">
    <div @click="$emit('onCancel')" :style="cancelStyls" class="cancel-button">
      <div class="press-status">
        <text :style="cancelTextStyls">{{cancel}}</text>
      </div>
    </div>
    <div @click="onComfirmClick" :style="comfirmStyle" class="comfirm-button">
      <div class="press-status">
        <text :style="comfirmTextStyls">{{confirm}}</text>
      </div>
    </div>
  </div>
</template>

<script>
import strings from 'strings'

export default {
  props: {
    confirm: {
      type: String,
      default: () => strings.SAVE
    },
    cancel: {
      type: String,
      default: () => strings.DEL
    },
    comfirmTextStyls: {
      type: Object,
      default: () => ({
        fontSize: '30px',
        color: '#fff'
      })
    },
    comfirmStyls: {
      type: Object,
      default: () => ({
        backgroundColor: '#74C786',
        borderRadius: '8px'
      })
    },
    cancelTextStyls: {
      type: Object,
      default: () => ({
        fontSize: '30px',
        color: '#222226'
      })
    },
    cancelStyls: {
      type: Object,
      default: () => ({
        backgroundColor: '#FAFAFA',
        borderRadius: '8px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#DBDBDB'
      })
    },
    styls: {
      type: Object,
      default: () => ({})
    },
    isEnabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    comfirmStyle () {
      return Object.assign({
        opacity: this.isEnabled ? 1 : 0.35
      }, this.comfirmStyls)
    }
  },
  methods: {
    onComfirmClick () {
      if (!this.isEnabled) {
        return
      }
      this.$emit('onComfirm')
    }
  }
}
</script>

<style scoped>
.button-group {
  width: 750px; height: 128px; background: #FFFFFF; box-shadow: inset 0 1px 0 #DBDBDB;
  align-items: center; justify-content: space-between; flex-direction: row;
  padding-left: 30px; padding-right: 30px;
}
.comfirm-button, .cancel-button {
  height: 88px; width: 330px; justify-content: center; align-items: center;
}
.press-status {
  flex: 1; align-items: center; justify-content: center; flex-direction: row;
  height: 86px; width: 328px; opacity: 1;
}
.press-status:active {
  opacity: 0.35;
}
</style>
