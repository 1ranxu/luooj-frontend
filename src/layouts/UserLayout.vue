<template>
  <div id="userlayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/oj-logo.png" class="logo" />
          <div class="title">落 OJ</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">3
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/1ranxu" target="_blank"
          >LUOYINGDEHUIHEN出品
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#userlayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png");
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
