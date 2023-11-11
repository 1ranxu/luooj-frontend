<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="题目标题">
        <a-input v-model="form.title" placeholder="请输入题目标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>

      <a-form-item field="answer" tooltip="请输入答案" label="题目答案">
        <MDEditor :value="form.answer" :hanndle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item field="content" tooltip="请输入内容" label="题目内容">
        <MDEditor :value="form.content" :hanndle-change="onContentChange" />
      </a-form-item>

      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item label="判题用例" :content-flex="false" :merge-props="false">
        <a-form-item
          v-for="(judgeCase, index) of form.judgeCaseList"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 480px">
            <a-form-item
              :field="`form.judgeCaseList[${index}].input`"
              :label="`输入用例${index}`"
              :key="index"
            >
              <a-input v-model="judgeCase.input" placeholder="输入用例" />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCaseList[${index}].output`"
              :label="`输出用例-${index}`"
              :key="index"
            >
              <a-input v-model="judgeCase.output" placeholder="输出用例" />
            </a-form-item>

            <a-button @click="handleDelete(index)" status="danger"
              >删除</a-button
            >
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px"></div>
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="handleSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MDEditor from "@/components/MDEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";

const form = ref({
  answer: "",
  content: "",
  judgeCaseList: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  tags: [],
  title: "",
} as QuestionAddRequest);
const handleSubmit = async () => {
  console.log(form.value);
  const res = await QuestionControllerService.addQuestionUsingPost(form.value);
  if (res.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败，" + res.message);
  }
};
/**
 * 新增判题用例
 */
const handleAdd = () => {
  if (form.value.judgeCaseList) {
    form.value.judgeCaseList.push({
      input: "",
      output: "",
    });
  }
};
/**
 * 删除判题用例
 * @param index
 */
const handleDelete = (index: number) => {
  if (form.value.judgeCaseList) {
    form.value.judgeCaseList.splice(index, 1);
  }
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
const onContentChange = (value: string) => {
  form.value.content = value;
};
</script>

<style scoped>
#addQuestionView {
}
</style>
