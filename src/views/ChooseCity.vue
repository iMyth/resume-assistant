<template>
  <wxc-city
    ref="wxcCity"
    :normalList="normalList"
    :hotListConfig="hotListConfig"
    @wxcCityItemSelected="citySelect"
    @wxcCityOnInput="onInput"
    @wxcCityCanceled="goBack"
  ></wxc-city>
</template>

<script>
import strings from 'strings'
import WxcCity from 'components/wxc/WxcCity.vue'
import * as Util from 'weex-ui/packages/wxc-city/util'
import { setNavigatorTitle, goBack, deepCopy } from 'util'
import sourceData from '@/data/cities.js'
import localStorage from 'localStorage'
import { STORAGE_KEY } from 'config'

export default {
  props: {
    title: {
      type: String,
      default: () => strings.CHOOSE_CITY
    }
  },
  data () {
    return {
      location: '',
      sourceData
    }
  },
  computed: {
    // City Data
    normalList () {
      return Util.getCities(this.sourceData.cities)
    },
    hotListConfig () {
      return {
        type: 'list',
        title: strings.HOT,
        list: Util.getCities(this.sourceData.hotCity)
      }
    }
  },
  created () {
    this.defaultSourceData = deepCopy(sourceData)
    setNavigatorTitle(strings.CHOOSE_CITY)
  },
  methods: {
    citySelect (e) {
      // TODO:...
      localStorage.setDataByKey(STORAGE_KEY.CITY, e, true).then(() => {
        goBack()
      })
    },
    goBack () {
      goBack()
    },
    onInput (e) {
      const { cities } = this.defaultSourceData
      const { value } = e
      if (value !== '' && cities && cities.length > 0) {
        const queryData = Util.query(cities, String(value).toLowerCase().trim())
        this.sourceData = {
          cities: queryData,
          hotCity: []
        }
        this.onlyShowList = true
      } else {
        this.sourceData = this.defaultSourceData
        this.onlyShowList = false
      }
    }
  },
  components: { WxcCity }
}
</script>
