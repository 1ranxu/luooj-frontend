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
              <h3 class="title">落畔题</h3>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="80px">
        <!--<div v-if="store.state.user?.loginUser.userName === '未登录'">
          <a-link href="/user/login">登录</a-link>
        </div>
        <div v-else>{{ store.state.user?.loginUser.userName }}</div>-->
        <a-dropdown trigger="hover">
          <!--头像-->
          <a-avatar shape="circle" class="userAvatar">
            <template
              v-if="loginUser && loginUser.userRole != AccessEnum.NOT_LOGIN"
            >
              <template v-if="loginUser.userAvatar">
                <img
                  alt="avatar"
                  :src="loginUser.userAvatar"
                  style="border-radius: 50%"
                />
              </template>
              <!--默认头像-->
              <template v-else>
                <a-avatar>
                  <IconUser />
                </a-avatar>
              </template>
            </template>
            <template v-else>
              <a-avatar>未登录</a-avatar>
            </template>
          </a-avatar>
          <!--下拉框-->
          <template #content>
            <!--登录后-->
            <template
              v-if="loginUser && loginUser.userRole != AccessEnum.NOT_LOGIN"
            >
              <a-doption>
                <template #icon>
                  <icon-user />
                </template>
                <template #default>
                  <a-anchor-link href="/mine">个人信息</a-anchor-link>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <icon-poweroff />
                </template>
                <template #default>
                  <a-anchor-link @click="logout">退出登录</a-anchor-link>
                </template>
              </a-doption>
            </template>
            <!--登录前-->
            <template v-else>
              <a-doption>
                <template #icon>
                  <icon-import />
                </template>
                <template #default>
                  <a-anchor-link href="/user/login">登录</a-anchor-link>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <icon-user />
                </template>
                <template #default>
                  <a-anchor-link href="/user/register">注册</a-anchor-link>
                </template>
              </a-doption>
            </template>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import routes from "@/router/routes";
import checkAccess from "@/access/CheckAccess";
import AccessEnum from "@/access/AccessEnum";
import message from "@arco-design/web-vue/es/message";
import { LoginUserVO } from "../../generated/models/LoginUserVO";
import { UserControllerService } from "../../generated/services/UserControllerService";

const store = useStore();
const loginUser = ref<LoginUserVO>();
watchEffect(() => {
  loginUser.value = store.state.user?.loginUser;
});
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
const logout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    location.reload();
    message.success("退出成功");
  } else {
    message.error("退出失败，", res.message);
  }
};
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

.userAvatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
