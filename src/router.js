// import Vue from 'vue'
import Router from 'vue-router'
import Resume from './views/Resume'
// import Guide from './views/Guide.vue'
// import ResumeType from './views/ResumeType'
import CareerVision from './views/CareerVision'
import BasicInfo from './views/BasicInfo'
import Skill from './views/Skill'
import ChooseJobTitle from './views/ChooseJobTitle'
import EducationBackground from './views/EducationBackground'
import CareerBackground from './views/CareerBackground'
import AssociationActivity from './views/AssociationActivity'
import ProjectExperience from './views/ProjectExperience'
import SelfAppraisal from './views/SelfAppraisal'
import Qualifications from './views/Qualifications'
import Hobbies from './views/Hobbies'
import Customized from './views/Customized'
import ChooseCity from './views/ChooseCity'

Vue.use(Router)

export default new Router({
  // mode: 'abstract',
  routes: [
    { path: '/index', component: Resume },
    { path: '/', redirect: '/index' },
    // { path: '/guide', component: Guide },
    { path: '/career', component: CareerVision },
    { path: '/basic', component: BasicInfo },
    { path: '/skill', component: Skill },
    { path: '/choosetitle', component: ChooseJobTitle },
    { path: '/education', component: EducationBackground },
    { path: '/careerbackground', component: CareerBackground },
    { path: '/association', component: AssociationActivity },
    { path: '/experience', component: ProjectExperience },
    { path: '/self', component: SelfAppraisal },
    { path: '/qualifications', component: Qualifications },
    { path: '/hobbies', component: Hobbies },
    { path: '/customized', component: Customized },
    { path: '/choosecity', component: ChooseCity }
  ]
})
