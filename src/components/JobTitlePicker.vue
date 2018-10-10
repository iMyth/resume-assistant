<template>
  <div class="job-title-picker">
    <list
      class="job-titles"
      :style="listStyle"
    >
      <cell @click="setJobTitle(item.name)" class="cell" v-for="item in titles" :key="item.id">
        <text class="cell-text">{{item.name}}</text>
      </cell>
      <!-- <cell v-if="showCustomized" @click="showDialog" class="cell">
        <text class="cell-text">{{customizedJob}}</text>
      </cell> -->
    </list>
    <div
      class="list-shadow"
      :style="listStyle"
    >
      <!-- buggie, box-shadow is not supported on list -->
      <list
        class="job-categories"
        :style="listStyle"
      >
        <cell
          class="cell"
          v-for="item in categories"
          :key="item.id"
          :style="item.id === currentId ? activeClass : {}"
          @click="setCurrentId(item.id)"
        >
          <text class="cell-text">{{item.name}}</text>
        </cell>
      </list>
    </div>
    <!-- <customized-input-dialog
      @cancelClicked="hideDialog()"
      @confirmClicked="setJobTitle"
      :show="isShowDialog"
      :placeholder="placeholder"
    ></customized-input-dialog> -->
  </div>
</template>

<script>
// import CustomizedInputDialog from 'components/CustomizedInputDialog'
import strings from 'strings'

export default {
  props: {
    jobTitles: {
      type: Array,
      default: () => []
    },
    activeClass: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgba(116, 199, 134, 0.15)'
      })
    },
    customizedJob: {
      type: String,
      default: strings.CUSTOMIZED_JOB
    },
    category: {
      type: String,
      default: () => ''
    },
    width: {
      type: Number,
      default: () => 590
    },
    placeholder: {
      type: String,
      default: () => strings.JOB_PLACEHOLDER
    }
    // showCustomized: {
    //   type: Boolean,
    //   default: () => true
    // }
  },
  data () {
    return {
      currentId: 0,
      isShowDialog: false
    }
  },
  computed: {
    categories () {
      return this.jobTitles.map(p => ({
        id: p.id,
        name: p.name
      }))
    },
    titles () {
      let target = this.jobTitles.find(p => p.id === this.currentId) || {}
      return target.children || []
    },
    industry () {
      let target = this.jobTitles.find(p => p.id === this.currentId) || {}
      return target.name || ''
    },
    listStyle () {
      return {
        width: `${this.width / 2}px`
      }
    }
  },
  created () {
    this.currentId = this.jobTitles[0] ? this.jobTitles[0].id : 0
  },
  methods: {
    showDialog () {
      this.isShowDialog = true
    },
    hideDialog () {
      this.isShowDialog = false
    },
    setCurrentId (id) {
      this.currentId = id
    },
    setJobTitle (item) {
      this.$emit('pickValue', {
        industry: this.industry,
        career: this.category,
        jobTitle: item
      })
    }
  }
  // components: { CustomizedInputDialog }
}
</script>

<style scoped>
.job-title-picker {
  flex-direction: row; flex: 1;
}
.job-categories {
  position: absolute; left: 0; top: 0; bottom: 0;
}
.job-titles {
  position: absolute; right: 0; top: 0; bottom: 0; background-color: #F8F8F8;
}
.cell {
  height: 120px; padding-left: 30px;
  justify-content: center;
  border-bottom-color: #DBDBDB;
  border-bottom-width: 1px; border-bottom-style: solid;
}
.list-shadow {
  background-color: #FFFFFF; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.cell:active {
  background-color: rgba(116, 199, 134, 0.15);
}
.cell-text {
  color: #222226; font-size: 30px;
}
</style>
