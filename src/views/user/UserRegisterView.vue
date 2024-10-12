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
          { required: true, message: '昵称不能为空' },
          { minLength: 4, message: '昵称长度不能低于4位' },
          { maxLength: 15, message: '昵称长度不能高于15位' },
        ]"
        field="userName"
        label="昵称"
      >
        <a-tooltip content="任意" position="top">
          <a-input v-model="form.userName" placeholder="请输入昵称" />
        </a-tooltip>
      </a-form-item>
      <a-form-item
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号长度不能低于4位' },
          { maxLength: 15, message: '账号长度不能高于15位' },
        ]"
        field="userAccount"
        label="账号"
      >
        <a-tooltip content="大写字母、小写字母、数字" position="top">
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
        <a-tooltip content="大写字母、小写字母、数字" position="top">
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-tooltip>
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
        <a-tooltip content="大写字母、小写字母、数字" position="top">
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请确认密码"
          />
        </a-tooltip>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: '邮箱不能为空' }]"
        field="email"
        label="邮箱"
      >
        <a-tooltip content="大写字母、小写字母、数字" position="top">
          <a-input v-model="form.email" placeholder="请输入邮箱" />
        </a-tooltip>
        <a-button
          @click="getCaptcha(form.email, 'REGISTER')"
          style="background-color: rgb(255, 255, 255); border-radius: 6px"
        >
          <a-tooltip content="获取验证码" position="right">
            <a-countdown
              :value="Date.now() + 60 * 1000"
              format="ss"
              :now="Date.now()"
              :start="start"
              @finish="handleFinish"
            >
            </a-countdown>
          </a-tooltip>
        </a-button>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: '验证码不能为空' }]"
        field="captcha"
        label="验证码"
      >
        <a-tooltip content="大写字母、小写字母、数字" position="top">
          <a-input v-model="form.captcha" placeholder="请输入验证码" />
        </a-tooltip>
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
import { useRoute, useRouter } from "vue-router";
import { reactive, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import { RegisterRequest } from "../../../generated/models/RegisterRequest";

const router = useRouter();

const route = useRoute();

const form = reactive({
  userName: "",
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  email: "",
  captcha: "",
} as RegisterRequest);

const handleSubmit = async () => {
  if (
    form.userName.length < 4 ||
    form.userName.length > 15 ||
    form.userAccount.length < 4 ||
    form.userAccount.length > 15 ||
    form.userPassword.length < 8 ||
    form.userPassword.length > 16
  ) {
    message.error("昵称长度介于4~15位\n账号长度介于4~15位\n密码长度介于8~16位");
    return;
  }
  if (
    form.checkPassword?.length !== form.userPassword?.length ||
    form.checkPassword !== form.userPassword
  ) {
    message.error("两次输入密码不一致");
    return;
  }
  const res = await UserControllerService.userEmailRegisterUsingPost(form);
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
const start = ref(false);
const handleFinish = () => {
  start.value = false;
};
const getCaptcha = async (email: string, op: string) => {
  start.value = false;
  const res = await UserControllerService.getCaptchaUsingGet(email, op);
  if (res.code === 0) {
    message.success("发送成功，请注意查收");
  } else {
    message.error("发送失败，请稍后再试" + res.message);
  }
};
</script>
