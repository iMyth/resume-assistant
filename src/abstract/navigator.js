const Navigator = weex.requireModule('navigator')
const baseUrl = 'http://10.13.128.122:8081/dist/'
const map = {
  index: 'Resume.js',
  guide: 'ResumeType.js',
  career: 'CareerVision.js',
  basic: 'BasicInfo.js',
  skill: 'Skill.js',
  choosetitle: 'ChooseJobTitle.js',
  education: 'EducationBackground.js',
  careerbackground: 'CareerBackground.js',
  association: 'AssociationActivity.js',
  experience: 'ProjectExperience.js',
  self: 'SelfAppraisal.js',
  qualifications: 'Qualifications.js',
  hobbies: 'Hobbies.js',
  customized: 'Customized.js'
}

export default {
  methods: {
    $push (view) {
      if (WXEnvironment.platform === 'Web') {
        this.$router.push(view || this._view)
      } else {
        Navigator.push({
          url: baseUrl + map[view],
          animated: true
        }, e => console.error(e))
      }
    },
    $pop () {
      this.$router.back()
    },
    $gotoView () {
      var bundleUrl = this.$getConfig().bundleUrl
      var dirs = this.root.split('/')
      dirs.forEach((dir, index) => {
        if (!dir) dirs.splice(index, 1)
      })
      var root = dirs.length > 0 ? dirs[0] : ''
      var subRoot = dirs.length > 1 ? dirs.slice(1).join('/') + '/' : ''

      var nativeBase
      var isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
      var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0
      if (isAndroidAssets) {
        nativeBase = 'file://assets/'
      } else if (isiOSAssets) {
        // file:///var/mobile/Containers/Bundle/Application/{id}/WeexDemo.app/
        // file:///Users/{user}/Library/Developer/CoreSimulator/Devices/{id}/data/Containers/Bundle/Application/{id}/WeexDemo.app/
        nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1)
      } else {
        var host = 'localhost:12580'
        var matches = /\/\/([^/]+?)\//.exec(this.$getConfig().bundleUrl)
        if (matches && matches.length >= 2) {
          host = matches[1]
        }
        nativeBase = '//' + host + '/' + root + '/build/' + subRoot
      }
      var h5Base = './index.html?page=./' + root + '/build/' + subRoot
      // in Native
      var base = nativeBase
      if (typeof window === 'object') {
        // in Browser or WebView
        base = h5Base
      }

      for (var i in this.items) {
        var item = this.items[i]
        if (!item.url) {
          item.url = base + item.name + '.js'
        }
      }
      // see log in Android Logcat
      if (this.items.length) console.log('hit', this.items[0].url)
    }
  }
}
