<template>
  <div id="userlayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <a-link :hoverable="false" href="/">
            <img src="../assets/oj-logo.png" class="logo" />
          </a-link>
          <h2 class="title">落畔题</h2>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a-tooltip content="查看本站技术及源码，欢迎 star">
          <a-link
            href="https://github.com/1ranxu/luooj-backend-microservice"
            target="_blank"
          >
            <icon-github />
          </a-link>
        </a-tooltip>

        <br />
        <icon-copyright />
        {{ new Date().getFullYear() }}落樱工作室出品 |
        <a-link href="https://beian.miit.gov.cn/" target="_blank">
          渝ICP备2024021408号-2
        </a-link>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#userlayout {
  text-align: center;
  background-image: url("background.jpg");
  background-color: rgb(255, 255, 255, 0.5);
  opacity: 1;
  background-repeat: no-repeat;
  background-size: cover;
}

#userlayout .header {
  margin-top: 16px;
}

#userlayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userlayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#userlayout .logo {
  height: 64px;
  border-radius: 50%;
}
</style>
<script setup lang="ts"></script>
