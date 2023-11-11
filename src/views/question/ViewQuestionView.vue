<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目详情">
            <a-card v-if="question" :title="question.title">
              <a-space direction="vertical" size="large" fill>
                <a-descriptions
                  title="判题条件"
                  :column="{ xs: 1, md: 2, lg: 3 }"
                >
                  <a-descriptions-item label="时间限制">
                    {{ question.judgeConfig.timeLimit }}
                  </a-descriptions-item>
                  <a-descriptions-item label="内存限制">
                    {{ question.judgeConfig.timeLimit }}
                  </a-descriptions-item>
                  <a-descriptions-item label="堆栈限制">
                    {{ question.judgeConfig.timeLimit }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-space>
              <MDViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
          <a-tab-pane key="answers" title="题解"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="language" label="编程语言">
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="请选择语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language as string"
          :hanndle-change="onCodeChange"
        />
        <a-divider size="0" />
        <a-button
          type="primary"
          status="success"
          style="min-width: 200px"
          @click="doSubmit"
        >
          提交
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MDViewer from "@/components/MDViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
  questionId: -1,
});

/**
 * 提交代码
 * @constructor
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败，" + res.message);
  }
};
const onCodeChange = (value: string) => {
  form.value.code = value;
};
</script>

<style scoped>
#viewQuestionView {
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
