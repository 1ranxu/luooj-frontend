<template>
  <div id="globalHeader">
    <a-row class="grid-demo" align="center" :wrap="false">
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <a-link :hoverable="false" href="/">
                <img class="logo" src="../assets/oj-logo.png" />
              </a-link>
              <div class="title">落 OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="100px">
        <div v-if="store.state.user?.loginUser.userName === '未登录'">
          <a-link href="/user/login">登录</a-link>
        </div>
        <div v-else>{{ store.state.user?.loginUser.userName }}</div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import routes from "@/router/routes";
import checkAccess from "@/access/CheckAccess";
import AccessEnum from "@/access/AccessEnum";

const store = useStore();

const router = useRouter();

// 需要展示的路由
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    return checkAccess(store.state.user.loginUser, item.meta?.access as string);
  });
});
//默认主页
const selectedKeys = ref(["/"]);
// 操作改变url
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
// url改变页面
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

/*setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "luoying",
    userRole: AccessEnum.ADMIN,
  });
}, 3000);*/
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
  border-radius: 50%;
}
</style>
