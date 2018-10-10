import { getParameters, removeParameters } from 'localStorage'

export default {
  data () {
    return {
      initialState: {}
    }
  },
  methods: {
    created () {
      this.initialState = getParameters()
    },
    beforeDestroy () {
      removeParameters()
    }
  }
}
