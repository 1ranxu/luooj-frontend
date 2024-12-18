<template>
  <div id="contestlayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-row class="grid-demo" align="center" :wrap="false">
          <a-col flex="auto">
            <a-space>
              <a-link :hoverable="false" href="/">
                <img class="logo" src="../assets/oj-logo.png" />
              </a-link>
            </a-space>
          </a-col>
          <a-col flex="100px">
            <a-dropdown trigger="hover">
              <!--头像-->
              <a-avatar shape="circle" class="userAvatar">
                <template
                  v-if="loginUser && loginUser.userRole != AccessEnum.NOT_LOGIN"
                >
                  <template v-if="loginUser.userAvatar">
                    <img alt="avatar" :src="loginUser.userAvatar" />
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
                      <a-anchor-link href="/_userInfo">个人信息</a-anchor-link>
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
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import message from "@arco-design/web-vue/es/message";
import { useStore } from "vuex";
import { ref, watch, watchEffect } from "vue";
import AccessEnum from "@/access/AccessEnum";
import { useRoute, useRouter } from "vue-router";
import { LoginUserVO } from "../../generated/models/LoginUserVO";
import { UserControllerService } from "../../generated/services/UserControllerService";

const store = useStore();
const router = useRouter();
const route = useRoute();

const loginUser = ref<LoginUserVO>();
watchEffect(() => {
  loginUser.value = store.state.user?.loginUser;
});

const logout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    location.reload();
    message.success("退出成功");
  } else {
    message.error("退出失败，", res.message);
  }
};

const questionId = ref();
watch(
  () => route.params,
  () => {
    questionId.value = route.params.id;
  }
);
</script>

<style>
#contestlayout {
  background: rgb(229, 230, 235);
}

#contestlayout .header {
  background: white;
  border-bottom: 1px solid #cdcdcd;
}

#contestlayout .logo {
  height: 32px;
  border-radius: 50%;
  margin-left: 16px;
}

#contestlayout .content {
  padding: 6px;
}

#contestlayout .userAvatar {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
}
</style>