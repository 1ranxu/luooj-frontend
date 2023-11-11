<template>
  <Viewer :value="props.value" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

/**
 * 定义组件属性的类型
 */
interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});
const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
</script>

<style scoped></style>
