<template>
  <div
    :style="containerStyle"
    class="basic-info"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller class="scroller">
      <image-picker
        ref="imgPicker"
        :imgUrl="filePath"
        @showEditPhoto="showEditPhotoPopup"
        @changeValue="onUrlChange"
      ></image-picker>
      <basic-form
        ref="form"
        @pickCity="pickCity()"
        @updateUrl="onUrlChange"
        @basicInfoChange="basicInfoChange"
      ></basic-form>
    </scroller>
    <button-bar
      :isEnabled="isEnabled"
      :style="iPhoneXButtonPrefixStyle"
      @buttonClick="onclick"
      :name="saveLabel"
    ></button-bar>
    <wxc-popup
      :show="showEditPhoto"
      @wxcPopupOverlayClicked="hideEditPhoto"
      pos="bottom"
      :height="editPanelHeight"
      popupColor="transparent"
      ref="popup"
    >
      <edit-photo
        @clickEdit="showPicker"
        @clickDel="delPhoto"
        @cancel="hideEditPhoto"
      ></edit-photo>
    </wxc-popup>
  </div>
</template>

<script>
// buggie, should always set page height on iOS???
import AppHeader from 'components/AppHeader'
import ImagePicker from 'components/basic/ImagePicker'
import syncInitialState from '@/abstract/syncInitialState.js'
import BasicForm from 'components/basic/BasicForm'
import ButtonBar from 'components/common/ButtonBar'
import { getPageHeight, setNavigatorTitle, goBack, iPhoneXButtonPrefixStyle, isIPhoneX } from 'util'
import strings, { BASIC_INFO } from 'strings'
import localStorage from 'localStorage'
import config, { STORAGE_KEY, VIEWS } from 'config'
import { WxcPopup } from 'weex-ui'
import EditPhoto from 'components/basic/EditPhoto'

const Navigator = weex.requireModule('navigator')
let shouldSaveData = false

export default {
  mixins: [ syncInitialState ],
  data () {
    return {
      saveLabel: strings.SAVE,
      containerStyle: {
        height: `${getPageHeight()}px`
      },
      iPhoneXButtonPrefixStyle,
      imgUrl: '',
      localPath: '',
      showEditPhoto: false
    }
  },
  computed: {
    isEnabled () {
      return true
    },
    filePath () {
      if (this.localPath) {
        return `file://${this.localPath}`
      }
      return this.imgUrl
    },
    editPanelHeight () {
      return isIPhoneX() ? 452 : 384
    }
  },
  created () {
    setNavigatorTitle(BASIC_INFO.TITLE)
  },
  methods: {
    viewappear () {
      let key = STORAGE_KEY.CITY
      localStorage.getDataByKey(key).then(p => {
        if (!p || !p.item || !p.item.cityName) {
          return
        }
        this.$refs.form.basicInfo.city = p.item.cityName
        localStorage.removeDataByKey(key)
      })
    },
    viewdisappear () {
      if (!shouldSaveData) {
        return
      }
      this.saveData()
    },
    hideEditPhoto () {
      this.$refs.popup.hide()
      setTimeout(() => {
        this.showEditPhoto = false
      }, 300)
    },
    showEditPhotoPopup () {
      this.showEditPhoto = true
    },
    delPhoto () {
      this.imgUrl = ''
      this.localPath = ''
      this.saveData()
      this.hideEditPhoto()
    },
    showPicker () {
      this.hideEditPhoto()
      this.$refs.imgPicker.pickImage(true)
    },
    pickCity () {
      this.$push('choosecity')
    },
    onclick () {
      localStorage.setDataByKey(
        STORAGE_KEY.BASIC_INFO,
        Object.assign(
          {},
          this.$refs.form.basicInfo,
          {
            url: this.imgUrl,
            localPath: this.localPath
          }
        ),
        false,
        true
      )
      goBack()
    },
    onUrlChange (v) {
      this.localPath = ''
      this.imgUrl = v.url
      this.localPath = v.path
      if (v.doNotUpload || !v.url) {
        return
      }
      this.saveData()
    },
    $push (view) {
      if (WXEnvironment.platform === 'Web') {
        this.$router.push(view)
      } else {
        Navigator.push({
          url: config.baseUrl + VIEWS[view],
          animated: 'true'
        }, e => console.log(e))
      }
    },
    basicInfoChange () {
      this.$emit('basicInfoChange')
      shouldSaveData = true
    },
    saveData () {
      shouldSaveData = false
      localStorage.setDataByKey(
        STORAGE_KEY.BASIC_INFO,
        Object.assign(
          {},
          this.$refs.form.basicInfo,
          {
            url: this.imgUrl,
            localPath: this.localPath
          }
        ),
        false
      )
    }
  },
  components: { AppHeader, ImagePicker, BasicForm, ButtonBar, WxcPopup, EditPhoto }
}
</script>

<style scoped>
.basic-info {
  justify-content: flex-start; background-color: #F4F4F4;
}
.scroller {
  position: absolute; top: 0; bottom: 128px; left: 0; right: 0;
}
</style>
