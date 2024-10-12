<template>
  <div id="questionlayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-row class="grid-demo" align="center" :wrap="false">
          <a-col flex="auto">
            <a-space>
              <a-link :hoverable="false" href="/">
                <img class="logo" src="../assets/oj-logo.png" />
              </a-link>
              <a-button style="color: black" type="text" href="/questions"
                >题库
              </a-button>
              <a-tooltip content="上一题">
                <a-button
                  size="mini"
                  type="text"
                  @click="getPrevQuestion"
                  style="
                    width: 22.4px;
                    height: 22.4px;
                    color: gray;
                    border: solid 1px #f2f2f2;
                  "
                >
                  <template #icon>
                    <icon-left />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip content="下一题">
                <a-button
                  size="mini"
                  type="text"
                  @click="getNextQuestion"
                  style="
                    width: 22.4px;
                    height: 22.4px;
                    color: gray;
                    border: solid 1px #f2f2f2;
                  "
                >
                  <template #icon>
                    <icon-right />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip content="随机一题">
                <a-button
                  @click="getRandomQuestion"
                  type="text"
                  style="width: 24px; height: 24px"
                >
                  <template #icon>
                    <svg
                      t="1703841836926"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="1480"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M500.6 599.8c19.7 24.5 41.5 47.7 67.1 67.9 56.4 44.5 122.9 67.1 203.1 69.1L744 763.5c-14.1 14.1-14.1 36.9 0 50.9 7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5l84-84c7.4-7.4 10.9-17.2 10.5-26.9 2.9-11.8-0.3-24.8-9.5-34l-84-84c-14.1-14.1-36.9-14.1-50.9 0s-14.1 36.9 0 50.9l28.4 28.4c-117.4-2.6-177.1-56.5-230-127.1-7.2 10.2-14.4 20.8-21.9 31.6-6.9 10.2-13.9 20.3-21 30.5zM382.8 339.6C323.4 292.8 252.6 270 166.5 270c-19.9 0-36 16.1-36 36s16.1 36 36 36c145.4 0 205.2 75 267.8 165.5 14.2-20.7 28.7-41.8 44.3-62.2-27.2-38.1-57.2-75.3-95.8-105.7z"
                        p-id="1481"
                        fill="#bfbfbf"
                      ></path>
                      <path
                        d="M891.5 338.4c0.4-9.7-3.1-19.5-10.5-26.9l-84-84c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l26.7 26.7c-80.2 2-146.7 24.7-203.1 69.1-51.1 40.3-87.1 92.7-121.8 143.4C380.7 615.5 322.8 700 168.5 700c-19.9 0-36 16.1-36 36s16.1 36 36 36c86.1 0 156.9-22.8 216.3-69.6 51.4-40.5 87.5-93.1 122.4-144 65.5-95.4 122.2-178.1 268.2-181.3L747 405.5c-14.1 14.1-14.1 36.9 0 50.9 7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5l84-84c9.2-9.2 12.4-22.2 9.5-34z"
                        p-id="1482"
                        fill="#bfbfbf"
                      ></path>
                    </svg>
                  </template>
                </a-button>
              </a-tooltip>
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
import { QuestionControllerService } from "../../generated/services/QuestionControllerService";

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

const getPrevQuestion = async () => {
  console.log(route.params);
  const res = await QuestionControllerService.getPrevQuestionUsingGet(
    route.params.id as any
  );
  console.log(questionId.value);
  console.log(res);
  if (res.code === 0) {
    router.push({
      path: `/view/question/${res.data}`,
    });
  }
};

const getNextQuestion = async () => {
  const res = await QuestionControllerService.getNextQuestionUsingGet(
    route.params.id as any
  );
  if (res.code === 0) {
    router.push({
      path: `/view/question/${res.data}`,
    });
  }
};

const getRandomQuestion = async () => {
  const res = await QuestionControllerService.getRandomQuestionUsingGet();
  console.log(res);
  if (res.code === 0) {
    router.push({
      path: `/view/question/${res.data}`,
    });
  }
};

router.afterEach((to, from, failure) => {
  location.reload();
});
</script>

<style>
#questionlayout {
  background: rgb(229, 230, 235);
}

#questionlayout .header {
  background: white;
  border-bottom: 1px solid #cdcdcd;
}

#questionlayout .logo {
  height: 32px;
  border-radius: 50%;
  margin-left: 16px;
}

#questionlayout .content {
  padding: 6px;
}

#questionlayout .userAvatar {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
