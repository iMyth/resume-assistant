<template>
  <div class="edit">
    <scroller class="scroller" :style="scrollerStyles" bubble="true">
      <div
        v-if="hasBought"
        class="resume-kit"
        @click="showPurchases"
      >
        <text class="bought-text">{{boughtText + expiryDate}}</text>
        <image class="green-arrow" :src="greenArrow" />
      </div>
      <basic-info
        :basicInfo="basicInfo"
        @imgDownloaded="imgDownloaded"
        @addClick="gotoModuleView"
        @basicInfoChange="$emit('editProfile')"
      ></basic-info>
      <!-- Auto generate all items and subitems could be very complicated, create components manually instead. -->
      <!-- <span-container
        v-for="item in listItem"
        v-bind="item"
        :key="item.id"
      >
        <div v-if="item.children && item.children.length" class="exps" slot="span">
          <experience
            v-for="subItem in item.children"
            :key="subItem.id"
            :deletable="!item.hasContent"
          ></experience>
          <add-experience v-if="!item.hasContent" :name="item.title"></add-experience>
        </div>
      </span-container> -->
      <career-objective
        :item="getModuleById(ITEM.CAREER_OBJECTIVE)"
        @addClick="gotoModuleView"
      ></career-objective>
      <education-background
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.EDUCATION_BACKGROUND)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refEducation"
      ></education-background>
      <!-- buggie, v-if="ITEM.CAREER_BACKGROUND in availableItems" won't effect immediately -->
      <career-background
        v-if="~getAvailableItems.indexOf(ITEM.CAREER_BACKGROUND)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.CAREER_BACKGROUND)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refCareerbackground"
      ></career-background>
      <association-activity
        v-if="~getAvailableItems.indexOf(ITEM.ASSOCIATION_ACTIVITY)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.ASSOCIATION_ACTIVITY)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refAssociation"
      ></association-activity>
      <projectExperience
        v-if="~getAvailableItems.indexOf(ITEM.PROJECT_EXPERIENCE)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.PROJECT_EXPERIENCE)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refExperience"
      ></projectExperience>
      <qualifications
        v-if="~getAvailableItems.indexOf(ITEM.QUALIFICATIONS)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.QUALIFICATIONS)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refQualifications"
      ></qualifications>
      <skill
        v-if="~getAvailableItems.indexOf(ITEM.SKILL)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.SKILL)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refSkills"
      ></skill>
      <hobbies
        v-if="~getAvailableItems.indexOf(ITEM.HOBBIES)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.HOBBIES)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        ref="refHobbies"
      ></hobbies>
      <self-appraisal
        v-if="~getAvailableItems.indexOf(ITEM.SELF_APPRAISAL)"
        @addClick="gotoModuleView"
        :item="getModuleById(ITEM.SELF_APPRAISAL)"
        ref="refSelfAppraisal"
      ></self-appraisal>
      <customized
        v-if="customizedCategory.length > 0 && customized.length > 0"
        v-for="item in customizedCategory"
        :key="item.id"
        @addClick="gotoModuleView"
        :item="getCustomizedModuleById(item.id)"
        @showOrHideItem="showOrHideProfileItem"
        @removeItem="removeProfileItem"
        @rename="showDialog(true)"
      ></customized>
      <more-info
        @addModule="addModuleAndScroll"
        @addCustomized="showDialog"
        :items="remainItems"
        :hasAddedCustomized="customizedCategory && customizedCategory.length > 0 && customized.length > 0"
      ></more-info>
    </scroller>
    <!-- <percentage
      @close="hideCompleteness"
      v-if="false"
      :pregress="percentage"
    ></percentage> -->
    <!-- <div
      v-if="!hasShowGuide"
      class="guide-container"
      @click="hideGuide()"
    >
      <div
        class="top"
        :style="{ height: overlayBottom + 'px' }"
      >
        <image class="arrow-guide" :src="guideUrl"/>
        <text class="text-guide">{{guideText}}</text>
      </div>
      <div class="right"></div>
      <div
        @click="$push('careerbackground')"
        class="center"
        :style="{ top: overlayBottom + 'px' }"
      ></div>
      <div
        class="bottom"
        :style="{ top: (overlayBottom + 100) + 'px' }"
      ></div>
      <div class="left"></div>
    </div> -->
    <!-- <customized-input-dialog
      :show="addCustomizedVisible"
      :title="addText"
      @confirmClicked="addCustomized"
      @cancelClicked="hideDialog"
    ></customized-input-dialog> -->
  </div>
</template>

<script>
import BasicInfo from 'components/basic/BasicInfo'
import MoreInfo from 'components/more/MoreInfo'
import Percentage from 'components/Percentage'
import CareerObjective from 'components/profileItems/CareerObjective'
import EducationBackground from 'components/profileItems/EducationBackground'
import CareerBackground from 'components/profileItems/CareerBackground'
import AssociationActivity from 'components/profileItems/AssociationActivity'
import ProjectExperience from 'components/profileItems/ProjectExperience'
import Qualifications from 'components/profileItems/Qualifications'
import Skill from 'components/profileItems/Skill'
import Hobbies from 'components/profileItems/Hobbies'
import SelfAppraisal from 'components/profileItems/SelfAppraisal'
import Customized from 'components/profileItems/Customized'
import localStorage from 'localStorage'
import strings, { CUSTOMIZED } from 'strings'
import bridge from 'bridge'

import { getPageHeight, tryCheckLogin, continuesChecking, showPurchases, checkHasBought, formatDate } from 'util'
import { PROFILE } from 'icons'
// import { mapState, mapActions, mapGetters } from 'vuex'
import config, { PROFILE_ITEM_LIST, ITEM, CUSTOMIZED_VIEW, STORAGE_KEY, VIEWS } from 'config'
// vuex hack
import { state, actions, getters } from '@/store/hack.js'

// Vue.mixin hack ???
// const modal = weex.requireModule('modal')
// const Navigator = weex.requireModule('navigator')
const Navigator = weex.requireModule('navigator')

export default {
  data () {
    return {
      ...state,
      ITEM,
      // addText: CUSTOMIZED.ADD,
      scrollerStyles: {
        height: `${getPageHeight() - 84}px`
      },
      iconUrl: PROFILE.FOLD,
      guideUrl: PROFILE.ARROW_GUIDE,
      greenArrow: PROFILE.RIGHT_GREEN,
      guideText: strings.GUIDE,
      boughtText: strings.RESUME_KIT,
      showPercentage: true,
      addCustomizedVisible: false,
      hasShowGuide: true,
      overlayBottom: 614,
      calculatedModuleArray: [],
      hasBought: false,
      expiryDate: 'NA-X-X',
      isRename: false
    }
  },
  computed: {
    // ...mapState('profile', [
    //   'basicInfo', 'career', 'education', 'careerBackground',
    //   'association', 'experience', 'qualifications', 'skills',
    //   'hobbies', 'selfAppraisal', 'customizedCategory', 'customized',
    //   'availableItems'
    // ]),
    // ...mapGetters('profile', [ 'percentage' ]),
    ...getters,
    listItem () {
      return PROFILE_ITEM_LIST.filter(p => ~this.getAvailableItems.indexOf(p.id)).map(p => ({
        id: p.id,
        title: p.title,
        view: p.view,
        children: this[p.mapState],
        hasContent: p.hasContent,
        info: p.info
      }))
    },
    remainItems () {
      return PROFILE_ITEM_LIST.filter(p => !~this.getAvailableItems.indexOf(p.id))
    },
    customizedArray () {
      return this.customizedCategory.map(p => ({
        id: p.id,
        title: p.name,
        view: CUSTOMIZED_VIEW,
        children: this.customized.filter(q => q.categoryId === p.id),
        info: 'other'
      }))
    },
    getAvailableItems () {
      return this.availableItems.concat(this.calculatedModuleArray).reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
    }
  },
  created () {
    this.retrieveJobTitles().then(p => {
      localStorage.setAllCareers(p)
    })
    this.$nextTick(() => {
      this.refresh()
    })
  },
  methods: {
    ...actions,
    $push (view) {
      if (WXEnvironment.platform === 'Web') {
        this.$router.push(view || this._view)
      } else {
        Navigator.push({
          url: config.baseUrl + VIEWS[view],
          animated: 'true'
        }, e => console.log(e))
      }
    },
    refresh (forceReload) {
      this.getInitialState()
      setTimeout(() => {
        this.genShouldShowModule()
        this.checkHasBought()
      }, 100)
    },
    // ...mapActions('profile', [ 'addModule', 'addCustomizedModule', 'retrieveJobTitles' ]),
    getModuleById (id) {
      return this.listItem.find(p => p.id === id)
    },
    getCustomizedModuleById (id) {
      return this.customizedArray.find(p => p.id === id)
    },
    genShouldShowModule () {
      let promiseList = []
      let finalArray = []
      for (let key in ITEM) {
        promiseList.push(localStorage.getDataByKey(STORAGE_KEY[key]).then(p => {
          if (p && !Array.isArray(p) || (Array.isArray(p) && p.length > 0)) {
            finalArray.push(ITEM[key])
          }
        }))
      }
      return Promise.all(promiseList).then(() => {
        this.calculatedModuleArray = finalArray
        return new Promise((resolve, reject) => {
          resolve(finalArray)
        })
      })
    },
    addModuleAndScroll (param) {
      tryCheckLogin().then(() => {
        this.gotoModuleView(param)
      }).catch(() => {
        continuesChecking(this.onLoginStatusChage)
      })
    },
    gotoModuleView (item) {
      let { view } = item
      if (!view) {
        return
      }
      tryCheckLogin().then(() => {
        this.$emit('editProfile')
        this.$push(item.view)
        this.statistic(item)
      }).catch(() => {
        continuesChecking(this.onLoginStatusChage)
      })
    },
    statistic (item) {
      bridge.statistic({
        event: 'SupercvEdited',
        attributes: {
          module: item.info
        }
      })
      bridge.statistic({
        attributes: {
          event: 'supercv_edited',
          module: item.info
        }
      })
    },
    hideCompleteness () {
      this.showPercentage = false
    },
    addCustomized (v) {
      this.addCustomizedModule({ name: v }).then(() => {
        if (this.isRename) {
          return
        }
        this.gotoModuleView({
          view: CUSTOMIZED_VIEW,
          info: 'other'
        })
      })
      // if (this.customizedCategory.length === 0) {
      //   this.addCustomizedModule({ name: v }).then(() => {
      //     this.gotoModuleView({
      //       view: CUSTOMIZED_VIEW
      //     })
      //   })
      // } else {
      //   this.renameCustomizedTitle(0, v)
      // }
      // this.hideDialog()
    },
    showDialog (isRename) {
      // this.addCustomizedVisible = true
      this.isRename = isRename
      tryCheckLogin().then(() => {
        this.$emit('changeDialogTitle', isRename ? CUSTOMIZED.EDIT : CUSTOMIZED.ADD)
        this.$emit('showCustomizedDialog', 'customizedInputDialog')
      }).catch(() => {
        continuesChecking(this.onLoginStatusChage)
      })
    },
    hideDialog () {
      // this.addCustomizedVisible = false
      this.$emit('hideCustomizedDialog', 'customizedInputDialog')
    },
    showOrHideProfileItem (item) {
      this.$emit('editProfile')
      this.showOrHideItem(item)
    },
    removeProfileItem (item) {
      this.$emit('editProfile')
      this.removeItem(item).then(() => {
         return this.getInitialState()
      }).then(p => {
        if (item.name === 'customized') {
          this.removeCustomized()
        }
        // if (this.percentage < 100) {
        //   this.showPercentage = true
        // }
      })
    },
    removeCustomized () {
      if (this.customized.length === 0) {
        this.customizedCategory = []
        localStorage.setDataByKey(STORAGE_KEY.CUSTOMIZED_CATEGORY, [])
      }
    },
    imgDownloaded (v) {
      // buggie, do not modify state directly
      this.$emit('editProfile')
      if (!v) {
        return
      }
      this.basicInfo.localPath = v
      localStorage.setDataByKey(STORAGE_KEY.BASIC_INFO, this.basicInfo, false, true)
    },
    hideGuide () {
      this.hasShowGuide = true
    },
    onLoginStatusChage () {
      this.$emit('onLoginStatusChage')
    },
    renameCustomizedTitle (id, name) {
      // let item = this.customizedCategory.find(p => p.id === id)
      // item.name = ''
      this.editCustomizedModuleName({ id, name })
    },
    checkHasBought () {
      checkHasBought().then(p => {
        this.hasBought = p.bought
        this.expiryDate = formatDate(new Date(p.expire_time * 1000))
      })
    },
    showPurchases () {
      showPurchases()
    }
  },
  components: {
    BasicInfo, MoreInfo, Percentage, CareerObjective,
    EducationBackground, CareerBackground, AssociationActivity,
    ProjectExperience, Qualifications, Skill, Hobbies,
    SelfAppraisal, Customized
  }
}
</script>

<style scoped>
.edit {
  flex: 1; flex-direction: row; align-items: flex-start;
  justify-content: center; width: 750px;
}
.scroller {
  flex: 1; align-items: center; padding-top: 22px; padding-bottom: 20px;
}
.guide-container {
  position: absolute; top: 0; right: 0; bottom: 0; left: 0;
}
.top {
  position: absolute; top: 0; left: 20px; height: 614px; right: 20px; background-color: rgba(0, 0, 0, 0.50);
}
.right {
  position: absolute; top: 0; right: 0; bottom: 0; width: 20px; background-color: rgba(0, 0, 0, 0.50);
}
.bottom {
  position: absolute; top: 714px; left: 20px; right: 20px; bottom: 0; background-color: rgba(0, 0, 0, 0.50);
}
.left {
  position: absolute; top: 0; left: 0; bottom: 0; width: 20px; background-color: rgba(0, 0, 0, 0.50);
}
.arrow-guide {
  position: absolute; width: 70px; height: 100px; left: 202px; bottom: 40px;
}
.text-guide {
  position: absolute; left: 290px; bottom: 100px;
  font-size: 32px; color: #FFFFFF;
}
.center {
  top: 614px; left: 20px; right: 20px; height: 100px;
}
.bought-text {
  font-size: 28px; color: #74C786; text-align: center;
}
.resume-kit {
  height: 40px; line-height: 40px; align-items: center; margin-bottom: 30px;
  margin-top: 8px; flex-direction: row; justify-content: center;
}
.green-arrow {
  width: 28px; height: 28px; margin-left: 4px;
}
</style>
