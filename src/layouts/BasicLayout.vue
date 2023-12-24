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
        <a-link href="https://github.com/1ranxu" target="_blank">
          <icon-github />
        </a-link>
        LUOYINGDEHUIHEN出品
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
