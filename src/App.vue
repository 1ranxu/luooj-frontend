<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AccessEnum from "@/access/AccessEnum";
//全局初始化函数，全局单次调用的代码都可以携带这里
const doInit = () => {
  console.log("hello");
};
onMounted(() => {
  doInit();
});
const router = useRouter();
const store = useStore();
router.beforeEach((to, from, next) => {
  if (to.meta.access === AccessEnum.ADMIN) {
    if (store.state.user.loginUser.userRole !== AccessEnum.ADMIN) {
      next("/noAuth");
      return;
    }
  }
  next();
});
</script>
