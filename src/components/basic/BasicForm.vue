<template>
  <!-- buggie, two way binding not work at all? -->
  <div class="form">
    <div class="row underline">
      <div class="name right-line">
        <input
          :value="basicInfo.name"
          @input="updateBasicInfo('name', $event)"
          type="text"
          :placeholder="BASIC_INFO.NAME"
          class="input name"
        />
      </div>
      <div
        @click="pickerGender()"
        class="gender-picker">
        <text
          :style="BASIC_INFO.GENDER === (basicInfo.gender || BASIC_INFO.GENDER) ? { color: '#B2B2B2' } : { color: '#222226' }"
          class="text gender-text"
        >{{basicInfo.gender || BASIC_INFO.GENDER}}</text><image
          :src="icon"
          class="icon"
        />
      </div>
    </div>
    <div class="row">
      <text class="title right-line">{{BASIC_INFO.BIRTHDAY}}</text>
      <div
        @click="pickBirthday()"
        class="picker">
        <text class="value">{{basicInfo.birthday.slice(0, -3)}}</text>
        <image :src="icon" class="icon" />
      </div>
    </div>
    <div class="row-title">
      <text class="row-title-text">{{BASIC_INFO.CONTACT}}</text>
    </div>
    <div class="row underline">
      <text class="title right-line">{{BASIC_INFO.PHONE}}</text>
      <input
        :value="basicInfo.phone"
        @input="updateBasicInfo('phone', $event)"
        type="tel"
        class="input"
        maxlength="11"
      />
    </div>
    <div class="row">
      <text class="title right-line">{{BASIC_INFO.MAIL}}</text>
      <input
        :value="basicInfo.mail"
        @input="updateBasicInfo('mail', $event)"
        type="email"
        class="input"
      />
    </div>
    <div class="row-title">
      <text class="row-title-text">{{BASIC_INFO.OTHER_INFO}}</text>
    </div>
    <div class="row underline">
      <text class="title right-line">{{BASIC_INFO.LOCATION}}</text>
      <div
        @click="$emit('pickCity')"
        class="picker">
        <text v-if="basicInfo.city" class="value">{{basicInfo.city}}</text>
        <text v-if="!basicInfo.city" class="value placeholder">{{optionalText}}</text>
        <image v-if="!basicInfo.city" :src="icon" class="icon" />
        <image
          v-if="basicInfo.city"
          @click="clearBasicInfoByKey($event, 'city')"
          :src="iconDel"
          class="icon"
        />
      </div>
    </div>
    <div class="row">
      <text class="title right-line">{{BASIC_INFO.YEARS_OF_SERVICE}}</text>
      <div
        @click="pickYearsOfService()"
        class="picker">
        <text v-if="basicInfo.yearsOfService" class="value">{{basicInfo.yearsOfService}}</text>
        <text v-if="!basicInfo.yearsOfService" class="value placeholder">{{optionalText}}</text>
        <image v-if="!basicInfo.yearsOfService" :src="icon" class="icon" />
        <image
          v-if="basicInfo.yearsOfService"
          @click="clearBasicInfoByKey($event, 'yearsOfService')"
          :src="iconDel"
          class="icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { PROFILE } from 'icons'
import * as picker from '@/api/picker.js'
import { GENDER_OPTIONS, YEARS_OF_SERVICE_OPTIONS, STORAGE_KEY } from 'config'
import strings, { BASIC_INFO } from 'strings'
import localStorage from 'localStorage'
// const modal = weex.requireModule('modal')

export default {
  data () {
    return {
      BASIC_INFO,
      optionalText: strings.OPTIONAL,
      icon: PROFILE.FOLD_2,
      iconDel: PROFILE.CLOSE,
      basicInfo: {
        name: '',
        gender: '',
        birthday: '',
        city: '',
        mail: '',
        phone: '',
        url: '',
        localPath: '',
        yearsOfService: ''
      }
    }
  },
  created () {
    localStorage.getDataByKey(STORAGE_KEY.BASIC_INFO).then(p => {
      Object.assign(this.basicInfo, p)
      if (!p || !p.url) {
        return
      }
      this.$emit('updateUrl', {
        url: p.url,
        path: p.localPath
      })
    })
  },
  methods: {
    pickerGender () {
      picker.pick({
        index: 0,
        items: GENDER_OPTIONS,
        title: BASIC_INFO.GENDER
      }).then(value => {
        this.basicInfo.gender = GENDER_OPTIONS[value]
        this.$emit('basicInfoChange')
      })
    },
    pickBirthday () {
      picker.pickDate({
        value: this.basicInfo.birthday,
        title: BASIC_INFO.BIRTHDAY
      }).then(value => {
        this.basicInfo.birthday = value
        this.$emit('basicInfoChange')
      })
    },
    pickYearsOfService () {
      picker.pick({
        index: 0,
        items: YEARS_OF_SERVICE_OPTIONS,
        title: BASIC_INFO.YEARS_OF_SERVICE
      }).then(value => {
        this.basicInfo.yearsOfService = YEARS_OF_SERVICE_OPTIONS[value]
        this.$emit('basicInfoChange')
      })
    },
    updateBasicInfo (key, e) {
      this.basicInfo[key] = e.value
      this.$emit('basicInfoChange')
    },
    clearBasicInfoByKey (e, key) {
      e.stopPropagation()
      this.basicInfo[key] = ''
      this.$emit('basicInfoChange')
    }
  }
  // watch: {
  //   basicInfo (v) {
  //     this.$emit('basicInfoChange', v)
  //   }
  // }
}
</script>

<style scoped>
.row {
  flex-direction: row; justify-content: flex-start; align-items: center; background-color: #FFFFFF;
  height: 100px;
}
.input {
  placeholder-color: #B2B2B2; height: 98px; flex: 1; /** text-indent: 30px; not work?**/
  background-color: transparent; padding-left: 30px;
}
.text, .input {
  color: #696969; font-size: 30px;
}
.gender-text {
  color: #B2B2B2;
}
.name {
  flex: 1; height: 100px; color: #222226;
}
.underline {
  border-bottom-style: solid; border-bottom-width: 1px; border-bottom-color: #DEDEDE;
}
.right-line {
  border-right-style: solid; border-right-width: 1px; border-right-color: #DEDEDE;
}
.gender-picker {
  flex-direction: row; padding-left: 30px; padding-right: 24px;
  justify-content: space-between; align-items: center; width: 190px;
  height: 100px;
}
.icon {
  height: 42px; width: 42px;
}
.picker {
  flex-direction: row; padding-left: 29px; padding-right: 24px;
  justify-content: space-between; align-items: center; flex: 1;
}
.title {
  height: 100px; width: 180px; line-height: 100px; padding-left: 30px; color: #222226;
}
.row-title {
  height: 80px; width: 750px; background-color: #F4F4F4; justify-content: center;
  padding-left: 30px;
}
.row-title-text {
  color: #696969; font-size: 28px; margin-top: 8px;
}
.placeholder {
  color: #B2B2B2;
}
</style>
