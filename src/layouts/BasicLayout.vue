<template>
  <div id="basiclayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
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
#basiclayout {
}

#basiclayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basiclayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basiclayout .footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
