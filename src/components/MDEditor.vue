<template>
  <Editor
    :value="props.value"
    :plugins="plugins"
    :mode="mode"
    @change="props.hanndleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

/**
 * 定义组件属性的类型
 */
interface Props {
  value: string;
  hanndleChange: (v: string) => void;
  mode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  hanndleChange: (v: string) => console.log(v),
  mode: () => "split",
});
const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
</script>

<style scoped></style>
