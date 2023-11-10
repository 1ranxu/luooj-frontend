<template>
  <div class="home">
    home
    <MDEditor :value="value" :hanndle-change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MDEditor from "@/components/MDEditor.vue";

const value = ref("");
const handleChange = (v: string) => {
  value.value = v;
};
</script>
