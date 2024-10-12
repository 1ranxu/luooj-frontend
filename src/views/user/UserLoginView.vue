<template>
  <div id="userLogin">
    <a-form
      :model="form"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号长度不能低于4位' },
          { maxLength: 15, message: '账号长度不能高于15位' },
        ]"
        field="userAccount"
        label="账号"
      >
        <a-tooltip content="大写字母、小写字母、数字" position="right">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-tooltip>
      </a-form-item>
      <a-form-item
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '密码长度不能低于8位' },
          { maxLength: 16, message: '密码长度不能高于16位' },
        ]"
        field="userPassword"
        label="密码"
      >
        <a-tooltip content="大写字母、小写字母、数字" position="right">
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-tooltip>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          long
          style="background-color: rgb(24, 25, 28); border-radius: 6px"
          >登录
        </a-button>
      </a-form-item>
      <a-form-item>
        没有账号？
        <a-link href="/user/register"> 注册</a-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import { UserAccountLoginRequest } from "../../../generated/models/UserAccountLoginRequest";

const router = useRouter();

const route = useRoute();

const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserAccountLoginRequest);

const handleSubmit = async () => {
  // console.log(form);
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    message.success("登录成功");
    // console.log(route.query.redirect);
    await store.dispatch("user/getLoginUser");
    // 将token保存在localStorage中
    localStorage.setItem("token", res.data.token);
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
