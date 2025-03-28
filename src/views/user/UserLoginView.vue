<template>
  <div id="userLogin">
    <a-form
      :model="accountForm"
      @submit="handleAccountSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
      v-if="!isEmail"
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
          <a-input v-model="accountForm.userAccount" placeholder="请输入账号" />
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
            v-model="accountForm.userPassword"
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
      <a-form-item>
        <a-tooltip content="邮箱登录" position="bl">
          <a-button type="dashed" @click="()=>{isEmail=!isEmail}">
            <template #icon>
              <IconEmail style="height: 40px; width: 40px" />
            </template>
          </a-button>
        </a-tooltip>
      </a-form-item>
    </a-form>
    <a-form
      :model="emailForm"
      @submit="handleEmailSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
      v-if="isEmail"
    >
      <a-form-item
        :rules="[{ required: true, message: '邮箱不能为空' }]"
        field="email"
        label="邮箱"
      >
        <a-input v-model="emailForm.email" placeholder="请输入邮箱" />

        <a-button
          type="text"
          status="success"
          @click="getCaptcha(emailForm.email, 'LOGIN')"
          :disabled="
            emailForm.email == undefined || !emailRegex.test(emailForm.email) || time > 0
          "
          style="height: 32px; width: 130px"
        >
          <template v-if="time != 0"> {{ time }}</template>
          <template v-if="time == 0"> {{ tip }}</template>
        </a-button>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: '验证码不能为空' }]"
        field="captcha"
        label="验证码"
      >
        <a-tooltip content="数字" position="top">
          <a-input v-model="emailForm.captcha" placeholder="请输入验证码" />
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
      <a-form-item>
        <a-tooltip content="账号登录" position="bl">
          <a-button type="dashed" @click="()=>{isEmail=!isEmail}" style="background-color: rgb(209, 222, 227)">
            <template #icon>
              <icon-user  style="height: 40px; width: 40px;" />
            </template>
          </a-button>
        </a-tooltip>
      </a-form-item>
    </a-form>

  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import { UserAccountLoginRequest } from "../../../generated/models/UserAccountLoginRequest";

document.title="登录"

const router = useRouter();

const route = useRoute();

const store = useStore();

const accountForm = reactive({
  userAccount: "",
  userPassword: "",
} as UserAccountLoginRequest);

const emailForm = reactive({
  email: undefined,
  captcha: "",
});

const isEmail = ref(false);

const handleAccountSubmit = async () => {
  // console.log(form);
  const res = await UserControllerService.userLoginUsingPost(accountForm);
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
const handleEmailSubmit = async () => {
  // console.log(form);
  const res = await UserControllerService.userEmailLoginUsingPost(emailForm);
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

const tip = ref("获取验证码");
const time = ref(0);
const intervalId = ref();
let emailRegex = new RegExp(
  "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$"
);
const getCaptcha = async (email: string, op: string) => {
  time.value = 60; // 设置倒计时时间为60秒
  intervalId.value = setInterval(() => {
    if (time.value > 0) {
      time.value--; // 每秒减少1
    } else {
      clearInterval(intervalId.value); // 清除计时器
      time.value = 0; // 重置倒计时时间
    }
  }, 1000); // 设置定时器，每1000毫秒（1秒）执行一次
  const res = await UserControllerService.getCaptchaUsingGet(email, op);
  if (res.code == 0) {
    message.success("发送成功，请注意查收");
    console.log("hh");
  } else {
    message.error("发送失败，请稍后再试，" + res.message);
  }
};
</script>
<style>
input[type="password"]::-ms-reveal{
  display: none;
}
input[type="password"]::-ms-clear{
  display: none;
}
input[type="password"]::-o-clear{
  display: none;
}
</style>