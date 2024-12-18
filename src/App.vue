<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else-if="route.path.startsWith('/view/question')">
      <router-view />
    </template>
    <template v-else-if="route.path.startsWith('/detail/contest')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}

.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

document.title="落畔题"

const route = useRoute();
//全局初始化函数，全局单次调用的代码都可以携带这里
const doInit = () => {
  console.log("hello");
};
onMounted(() => {
  doInit();
});
</script>
