<template>
  <job-title-picker-overlay
    :overlayStyle="{ top: '120px'}"
  ></job-title-picker-overlay>
</template>

<script>
import JobTitlePickerOverlay from 'components/JobTitlePickerOverlay.vue'
import strings from 'strings'
import { setNavigatorTitle } from 'util'

export default {
  props: {
    title: {
      type: String,
      default: () => strings.CHOOSE_JOBTITLE
    }
  },
  created () {
    setNavigatorTitle(strings.CHOOSE_JOBTITLE)
  },
  components: { JobTitlePickerOverlay }
}
</script>
