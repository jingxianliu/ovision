// The Vue build version to load with the `import` command

import Vue from 'vue'
import App from './App.vue'


//element样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//自定义主题
import '../theme/index.css'
import './assets/css/theme/01/index.css'
import './assets/css/theme/02/index.css'
import './assets/css/theme/00/index.css'

//自定义公用样式
import './assets/css/common.css'

//路由
import Router from 'vue-router'
import router from './router'

//重写push方法
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

//过滤器
import * as filters from './utils/filters'
//API
import * as API_IOT from './utils/api-iot'

import * as API_SOTA from './utils/api-sota'
import * as API_CLOUD from './utils/api-cloud'

import { get, post ,put ,deletes,upload} from './utils/axios'

import axios from 'axios'
//vuex
import store from './store'
//国际化
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

//自定义弹窗
import MessageBox from './components/MessageBox/index'
Vue.use(MessageBox);

//剪切板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import GL_Components from './components/components'
Vue.use(GL_Components)

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)

// highlight.js代码高亮插件
import Highlight from './components/highlight/index' // from 路径是highlight.js的路径，纯属自定义
Vue.use(Highlight)


//jsoneditor
import jsoneditor from 'jsoneditor'

Vue.prototype.$jsoneditor = jsoneditor


//echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//代码编辑器
//import { codemirror } from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'

//Vue.use(codemirror)

const i18n = new VueI18n({
    locale: 'zh', // 将要切换的语言，可以通过url拼的参数获取，用户行为select选择获取，本地manifest配置获取等，根据场景动态获取
    messages: {
      'zh': require('./assets/locales/zh') ,  
      'en': require('./assets/locales/en') 
    }
})



Vue.config.productionTip = false

//配置公共请求地址
Vue.prototype.$API_IOT = API_IOT
Vue.prototype.$API_CLOUD = API_CLOUD
Vue.prototype.$API_SOTA = API_SOTA


Vue.prototype.$axios = axios




Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$put = put
Vue.prototype.$delete = deletes

// 导出的是对象，可以直接通过 key 和 value 来获得过滤器的名和过滤器的方法
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})



router.beforeEach((to, from, next) => {
  if(to.path === "/home" ){
    let loginName =  store.state.loginName
      if( loginName){       
        next();
      }else{
        router.push("/")
      }  
   
  }else{
    
    store.commit('deletePending') // 取消请求
    next();
  }
  
  
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
 
