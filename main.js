import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// main.js
import uView from "uview-ui";
Vue.use(uView);
//封装公共方法
import com from './utils/common.js'
Vue.prototype.com = com
//api
import api from './api.js'
Vue.prototype.api = api

import store from './store'
Vue.prototype.$store = store

//权限
import permision from "./js_sdk/wa-permission/permission.js"
Vue.prototype.permision = permision

App.mpType = 'app'

const app = new Vue({
    ...App,store
})
app.$mount()
