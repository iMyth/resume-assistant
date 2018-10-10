<template>
  <div :style="styls" class="period-picker">
    <text :style="titleStyls" class="title">{{title}}</text>
    <text @click="pickDate1" :style="getDateStyle(value1)" class="date-1">{{value1 || placeholder1}}</text>
    <text class="to">{{label}}</text>
    <text @click="pickDate2" :style="getDateStyle(value2)" class="date-2">{{value2 || placeholder2}}</text>
  </div>
</template>

<script>
import strings, { EDUCATION_BACKGROUND } from 'strings'
import { pick } from '@/api/picker.js'

const currentYear = new Date().getFullYear()
const yearFrom = currentYear - 50
const yearTo = currentYear
let monthList = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] // buggie in iOS 9, Array.from(new Array(12),(val,index) => index + 1)
const getMonthList = (opt = {}) => {
  let {
    max = 12,
    min = 1
  } = opt
  return monthList.slice(min - 1, max)
}

const getDateList = (opt = {}) => {
  let {
    max = `${yearTo}.12`,
    min = `${yearFrom}.1`
  } = opt
  let maxYear = yearTo
  let maxMonth = 12
  let minYear = yearFrom
  let minMonth = 1
  if (max) {
    let yearMonth = max.split('.')
    if (yearMonth.length > 1) {
      maxYear = +yearMonth[0]
      maxMonth = +yearMonth[1]
    }
  }
  if (min) {
    let yearMonth = min.split('.')
    if (yearMonth.length > 1) {
      minYear = +yearMonth[0]
      minMonth = +yearMonth[1]
    }
  }
  let arr = []
  for (let i = minYear; i <= maxYear; i++) {
    let sub = getMonthList()
    if (i === minYear) {
      sub = getMonthList({
        min: minMonth
      })
    }
    if (i === maxYear) {
      sub = getMonthList({
        max: maxMonth
      })
    }
    arr.push({
      main: i,
      sub
    })
  }
  return arr.reverse()
}

const getIndexs = (dateStr, multipleItems) => {
  let indexs = [ 0, 0 ]
  let arr = dateStr.split('.')
  if (arr < 2) {
    return indexs
  }
  let yearIndex = multipleItems.findIndex(p => p.main === +arr[0])
  let monthIndex
  if (~yearIndex) {
    monthIndex = multipleItems[yearIndex].sub.findIndex(p => p === +arr[1])
    if (~monthIndex) {
      indexs = [ yearIndex, monthIndex ]
    }
  }
  return indexs
}

export default {
  props: {
    titleStyls: {
      type: Object,
      default: () => ({})
    },
    styls: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: () => 'default'
    },
    placeholder1: {
      type: String,
      default: () => strings.FROM
    },
    placeholder2: {
      type: String,
      default: () => strings.TO
    },
    datePlaceholderStyle: {
      type: Object,
      default: () => ({
        color: '#B2B2B2'
      })
    },
    dateStyle: {
      type: Object,
      default: () => ({
        color: '#696969'
      })
    },
    defaultStart: {
      type: String
    },
    defaultEnd: {
      type: String
    }
  },
  data () {
    return {
      label: EDUCATION_BACKGROUND.TO,
      value1: '',
      value2: ''
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.defaultStart) {
        this.value1 = this.defaultStart
      }
      if (this.defaultEnd) {
        this.value2 = this.defaultEnd
      }
    })
  },
  methods: {
    getDateStyle (value) {
      return value ? this.dateStyle : this.datePlaceholderStyle
    },
    // TODO: validate date
    pickDate1 () {
      let multipleItems = getDateList({ max: this.value2 })
      pick({
        multiple_items: multipleItems,
        title: strings.FROM,
        indexs: getIndexs(this.value1, multipleItems)
      }).then(([ year, month ]) => {
        this.value1 = `${multipleItems[year].main}.${multipleItems[year].sub[month]}`
        this.$emit('value1Change', this.value1)
      })
    },
    pickDate2 () {
      let multipleItems = [{
        main: strings.TILL_NOW,
        sub: []
      }].concat(getDateList({ min: this.value1 }))
      pick({
        multiple_items: multipleItems,
        title: strings.TO,
        indexs: getIndexs(this.value2, multipleItems)
      }).then(([ year, month ]) => {
        let value
        let monthLabel = multipleItems[year].sub[month]
        if (monthLabel) {
          value = `${multipleItems[year].main}.${monthLabel}`
        } else {
          value = multipleItems[year].main
        }
        this.value2 = value
        this.$emit('value2Change', value)
      })
    }
  },
  watch: {
    defaultStart (v) {
      this.value1 = v
    },
    defaultEnd (v) {
      this.value2 = v
    }
  }
}
</script>

<style scoped>
.period-picker {
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
.to {
  font-size: 30px; color: #222226; width: 30px;
}
.date-1, .date-2 {
  width: 180px; margin-right: 14px; margin-left: 30px; font-size: 30px;
}
.date-2 {
  margin-left: 14px;
}
</style>
