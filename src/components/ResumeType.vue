<!-- buggie, dynamically add class won't work -->
<template>
  <div :style="styls" class="resume-type">
    <!-- <app-header :title="title"></app-header> -->
    <div
      class="list-item"
      :class="{ 'is-active': currentIndex ===  index}"
      :style="currentIndex ===  index ? {
        borderColor: '#74C786',
        boxShadow: '0 0 8px #74c786',
        marginTop: index === 0 ? '150px' : '24px'
      } : {
        borderColor: '#e0e0e0',
        marginTop: index === 0 ? '150px' : '24px'
      }"
      v-for="(item, index) in list"
      :key="item.id"
      @click="setCurrentIndex(index)">
      <text class="item-text">{{item.name}}</text>
      <image class="icon" :src="item.icon"/>
    </div>
    <div class="button-ok">
      <text @click="setResumeType" class="button-text">{{okButton}}</text>
    </div>
  </div>
</template>

<script>
import AppHeader from 'components/AppHeader.vue'
import localStorage from 'localStorage'
import { RESUME_TYPES_LIST, VIEWS } from 'config'
import strings, { JOB_TYPE } from 'strings'
import { getPageHeight } from 'util'
// import navigator from '@/abstract/navigator.js'

// const category = {
//   SOCIAL: 0,
//   CAMPUS: 1,
//   INTERNSHIP: 2
// }
const mapping = [
  [ 1, 2, 3 ],
  [ 1, 2, 3, 4 ],
  [ 1, 2, 3, 4 ]
]

export default {
  // buggie, mixins not work???
  // mixins: [ 'navigator' ],
  data () {
    return {
      list: RESUME_TYPES_LIST,
      okButton: strings.OK,
      title: strings.RESUME_CATEGORY,
      // activeItem: category.INTERNSHIP,
      styls: {
        height: `${getPageHeight()}px`,
        // hack
        backgroundColor: '#f4f4f4',
        flexDirection: 'column',
        alignItems: 'center'
      },
      currentIndex: 0,
      targetView: VIEWS.INDEX
    }
  },
  methods: {
    setCurrentIndex (index) {
      this.currentIndex = index
    },
    setResumeType () {
      this.setVisonType(this.currentIndex)
      localStorage.initResumeType(mapping[this.currentIndex]).then(() => {
        this.$emit('closeGuide')
      })
    },
    setVisonType (index) {
      localStorage.getVisionType(true).then(p => {
        localStorage.setVisionType(JOB_TYPE[index], true)
      })
    }
  },
  components: { AppHeader }
}
</script>

<style scoped>
/** not work???? **/
.resume-type {
  background-color: #f4f4f4;
  flex-direction: column; align-items: center;
}
.list-item {
  width: 560px; height: 160px; padding-left: 30px;
  flex-direction: row; justify-content: space-between; align-items: center;
  background-color: #FFFFFF; box-shadow: 0 16px 30px rgba(0, 0, 0, 0.03);
  border-style: solid; border-width: 2px; border-color: #e0e0e0;
  border-radius: 12px;
}
.is-active {
  border-color: #74C786; box-shadow: 0 0 8px #74c786;
}
.item-text {
  font-size: 36px; color: #222226; letter-spacing: 0;
}
.icon {
  width: 248px; height: 160px;
}
.button-ok {
  width: 560px; height: 88px; background-color: #74C786; border-radius: 4px;
  align-items: center; justify-content: center; margin-top: 60px;
}
.button-text {
  font-size: 30px; color: #FFFFFF; letter-spacing: 0.35px;
  text-align: center; line-height: 88px; width: 560px;
}
.button-text:active {
  opacity: .35;
}
</style>
