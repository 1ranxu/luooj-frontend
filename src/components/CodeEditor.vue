<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 400px; height: 70vh"
  ></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

const codeEditorRef = ref();
const codeEditor = ref();

/**
 * 定义组件属性的类型
 */
interface Props {
  value: string;
  hanndleChange: (v: string) => void;
  language: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  hanndleChange: (v: string) => console.log(v),
  language: () => "java",
});

watch(
  () => props.language,
  () => {
    console.log(props.language);
    if (!codeEditorRef.value) {
      return;
    }
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    lineNumbers: "on",
    theme: "vs-dark",
  });
  codeEditor.value.onDidChangeModelContent(() => {
    props.hanndleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
