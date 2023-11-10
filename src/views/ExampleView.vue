<template>
  <div class="home">
    <MDEditor :value="mdValue" :hanndle-change="mdChange" />
    <CodeEditor
      :value="codeValue"
      :hanndle-change="codeChange"
      style="min-height: 400px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MDEditor from "@/components/MDEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref("");
const codeValue = ref("");
const mdChange = (v: string) => {
  mdValue.value = v;
  // console.log(mdValue.value);
};
const codeChange = (v: string) => {
  codeValue.value = v;
  // console.log(mdValue.value);
};
</script>
