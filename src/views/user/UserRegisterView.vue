<template>
  <div id="userRegister">
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
        tooltip="账号只能由英文字母大小写、数字组成"
        label="账号"
      >
        <a-input
          v-model="form.userAccount"
          placeholder="账号只能由英文字母大小写、数字组成"
        />
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
        <a-input-password
          v-model="form.userPassword"
          placeholder="密码只能由英文字母大小写、数字组成"
        />
      </a-form-item>
      <a-form-item
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '密码长度不能低于8位' },
          { maxLength: 16, message: '密码长度不能高于16位' },
        ]"
        field="checkPassword"
        label="确认密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请确认密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          long
          type="primary"
          html-type="submit"
          style="background-color: rgb(24, 25, 28); border-radius: 6px"
          >注册
        </a-button>
      </a-form-item>
      <a-form-item>
        已经注册？
        <a-link href="/user/login">登录</a-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const route = useRoute();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const handleSubmit = async () => {
  if (form.userAccount.length < 4 || form.userPassword.length < 6) {
    return;
  }
  if (
    form.checkPassword?.length !== form.userPassword?.length ||
    form.checkPassword !== form.userPassword
  ) {
    message.error("两次输入密码不一致");
    return;
  }
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    message.success("注册成功");
    console.log(route.query.redirect);
    // 重定向到登录页面
    await router.push({
      path: `/user/login`,
      //不会占用浏览器历史记录的堆栈，不能在通过后退箭头返回登录页面
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>