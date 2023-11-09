<template>
  <div id="userLogin">
    <h2>用户登录</h2>
    <a-form
      :model="form"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="userAccount" tooltip="请输入账号" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-link href="/user/register"> 注册</a-link>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();

const route = useRoute();

const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const handleSubmit = async () => {
  // console.log(form);
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    message.success("登录成功");
    // console.log(route.query.redirect);
    await store.dispatch("user/getLoginUser");
    // 重定向到用户之前访问的页面
    await router.push({
      path: `${route.query.redirect ?? "/"}`,
      //不会占用浏览器历史记录的堆栈，不能在通过后退箭头返回登录页面
      replace: true,
    });
  } else {
    message.error("登录失败，" + res.message);
  }
};
</script>
