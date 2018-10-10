<template>
  <div
    class="index-view"
    :style="indexStyle"
    @viewappear="viewappear"
  >
    <!-- <app-header></app-header> -->
    <tab-page
      ref="tabPage"
      @tabSelected="onTabChange"
    >
      <profile
        class="item-container"
        ref="profile"
        :style="contentStyle"
        @showCustomizedDialog="showDialogByName"
        @hideCustomizedDialog="hideDialogByName"
        @editProfile="editProfile"
        @onLoginStatusChage="onLoginStatusChage"
        @changeDialogTitle="changeDialogTitle"
      ></profile>
      <preview
        @showDialog="showDialogByName($event)"
        ref="preview"
        class="item-container"
        :style="contentStyle"
        @toast="toast"
      ></preview>
    </tab-page>
    <tooltip v-if="showTip"></tooltip>
    <edit-prompt
      @clickComfirm="gotoEditProfile('editPrompt')"
      @clickCancel="hideDialogByName('editPrompt')"
      :show="dialog.editPrompt"
    ></edit-prompt>
    <export-successfully
      @noted="hideDialogByName('exportSuccessfully')"
      @openFile="openFile()"
      :show="dialog.exportSuccessfully"
    ></export-successfully>
    <customized-input-dialog
      :show="dialog.customizedInputDialog"
      :title="addText"
      @confirmClicked="addCustomized"
      @cancelClicked="hideDialogByName('customizedInputDialog')"
      :placeholder="placeholder"
    ></customized-input-dialog>
    <wxc-popup
      :show="isGuideShow"
      @wxcPopupOverlayClicked="hideGuide"
      pos="bottom"
      :height="guideHeight"
    >
      <resume-type @closeGuide="hideGuide"></resume-type>
    </wxc-popup>
    <wxc-popup
      :show="isGuidePageShow"
      pos="bottom"
      :height="guideHeight"
    >
      <guide @closeGuide="hideGuidePage"></guide>
    </wxc-popup>
    <wps-loading
      :show="toastOpt.show"
      :loadingText="toastOpt.text"
      :styls="toastOpt.style"
    ></wps-loading>
  </div>
</template>

<script>
import AppHeader from 'components/AppHeader.vue'
import SlideToEdit from 'components/SlideToEdit.vue'
import TabPage from 'components/TabPage.vue'
import { getPageHeight } from 'util'
import Profile from 'components/Profile.vue'
import Preview from 'components/Preview.vue'
import EditPrompt from 'components/preview/EditPrompt'
import ExportSuccessfully from 'components/preview/ExportSuccessfully'
import WpsLoading from 'components/preview/WpsLoading'
import CustomizedInputDialog from 'components/CustomizedInputDialog'
import ResumeType from 'components/ResumeType'
import Guide from 'components/Guide'
import Tooltip from 'components/Tooltip'
import { WxcPopup } from 'weex-ui'
import { CUSTOMIZED } from 'strings'
import localStorage from 'localStorage'
import bootstrap from '@/init'
import config, { VIEWS } from 'config'

const Navigator = weex.requireModule('navigator')
const pageHeight = getPageHeight()

const TAB_PAGE = {
  PROFILE: 0,
  PREVIEW: 1
}

export default {
  data () {
    return {
      addText: CUSTOMIZED.ADD,
      placeholder: CUSTOMIZED.ENTER_NAME,
      contentStyle: { },
      indexStyle: {
        height: `${pageHeight}px`,
        width: '750px'
      },
      guideHeight: pageHeight,
      dialog: {
        editPrompt: false,
        exportSuccessfully: false,
        customizedInputDialog: false
      },
      toastOpt: {
        show: false,
        style: {},
        text: ''
      },
      isGuideShow: false,
      isGuidePageShow: false,
      hasEdit: false,
      hasApplied: false,
      showTip: false
    }
  },

  methods: {
    changeDialogTitle (title) {
      this.addText = title
    },
    gotoEditProfile (name) {
      this.hideDialogByName(name)
      this.$refs.tabPage.setPage(0)
    },
    showDialogByName (name) {
      this.dialog[name] = true
    },
    hideDialogByName (name) {
      this.dialog[name] = false
    },
    addCustomized (v) {
      // buggie
      this.$refs.profile.addCustomized(v)
      this.hideDialogByName('customizedInputDialog')
    },
    toast (options) {
      Object.assign(this.toastOpt, options)
    },
    // manually refresh
    viewappear () {
      // this.$nextTick(() => {
      //   this.$refs.profile.getInitialState().then(() => {
      //     this.$refs.profile.genShouldShowModule()
      //   })
      // })
      setTimeout(() => {
        this.$refs.profile.getInitialState().then(() => {
          this.$refs.profile.genShouldShowModule()
        })
      }, 150)
    },
    openFile () {
      this.hideDialogByName('exportSuccessfully')
      // buggie, do not call method in this way
      this.$refs.preview.openFile()
    },
    onTabChange (e) {
      // if (e.page === TAB_PAGE.PROFILE) {
      //   // hack
      //   setTimeout(() => {
      //     this.checkHasShowGuide()
      //   }, 200)
      // }
      if (e.page === TAB_PAGE.PREVIEW) {
        this.$refs.profile.hideGuide()
        this.hideTip()
        if (!this.hasApplied) {
          this.hasApplied = true
          this.$refs.preview.tryApplyDoc()
          this.hasEdit = false
          return
        }
        if (!this.hasEdit) {
          return
        }
        this.$refs.preview.renderTpl()
        this.hasEdit = false
      }
    },
    hideGuide () {
      this.$refs.profile.refresh(true)
      this.isGuideShow = false
    },
    hideGuidePage () {
      this.isGuidePageShow = false
      // hack
      this.checkHasShowGuide()
    },
    editProfile () {
      this.hasEdit = true
    },
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
    checkHasShowGuide () {
      localStorage.checkHasShowGuide().then(p => {
        if (p) {
          return
        }
        this.isGuideShow = true
      })
    },
    checkHasShowGuidePage () {
      localStorage.checkHasShowGuidePage().then(p => {
        if (p) {
          return
        }
        this.isGuidePageShow = true
      })
    },
    refresh () {
      this.$nextTick(() => {
        bootstrap.fetchUserInfo().then(() => {
          this.$refs.profile.getInitialState().then(() => {
            this.$refs.profile.genShouldShowModule()
          })
        })
        this.checkHasShowGuidePage()
      })
    },
    onLoginStatusChage () {
      this.refresh()
    },
    checkHasShowTips () {
      localStorage.checkHasShowGuideOverlayer().then(p => {
        if (p) {
          return
        }
        this.showTip = true
      })
    },
    hideTip () {
      this.showTip = false
    }
  },

  created () {
    this.$nextTick(() => {
      this.checkHasShowTips()
      this.refresh()
    })
  },

  components: {
    AppHeader, SlideToEdit, TabPage, Profile, Preview, EditPrompt,
    ExportSuccessfully, CustomizedInputDialog, WpsLoading, WxcPopup,
    ResumeType, Guide, Tooltip
  }
}
</script>
<!-- buggie, not work on iOS devices -->
<!-- <style src='../../src/assets/main.css' /> -->
<style scoped>
  .index-view {
    flex: 1; background-color: #ededed;
  }
  .index-info {
    padding-top: 0;
  }
  .edit-panel {
    height: 80px; align-items: center;
  }
  .item-container {
    width: 750px;
    background-color: #ededed;
  }
</style>
