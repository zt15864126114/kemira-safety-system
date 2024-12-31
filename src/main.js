import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
// 导入 dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 设置 dayjs 为全局变量
window.dayjs = dayjs
// 设置语言
dayjs.locale('zh-cn')

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')