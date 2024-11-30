import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "@/plugins/axios";
import "@/access";
import "bytemd/dist/index.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { use } from "echarts/core";
import Echarts from "vue-echarts"
import * as echarts from "echarts"
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);
const app = createApp(App)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(store)
  .use(router)
app.component('v-chart',Echarts)
app.config.globalProperties.$echarts = echarts
app.mount("#app");
