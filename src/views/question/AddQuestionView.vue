<template>
  <div id="addQuestionView">
    <a-card :width="880">
      <template #title>
        <h2 v-if="route.path.startsWith('/update/question')">修改题目</h2>
        <h2 v-else>创建题目</h2>
      </template>
      <a-form :model="form" label-align="left">
        <a-form-item field="title" label="题目标题">
          <a-input v-model="form.title" placeholder="请输入题目标题" />
        </a-form-item>
        <a-form-item field="tags" label="标签">
          <a-input-tag
            v-model="form.tags"
            placeholder="请输入标签"
            allow-clear
          />
        </a-form-item>

        <a-form-item field="content" tooltip="请输入内容" label="题目内容">
          <MDEditor :value="form.content" :hanndle-change="onContentChange" />
        </a-form-item>

        <a-form-item field="answer" tooltip="请输入答案" label="题目答案">
          <MDEditor :value="form.answer" :hanndle-change="onAnswerChange" />
        </a-form-item>
        <a-form-item
          label="判题配置"
          :content-flex="false"
          :merge-props="false"
        >
          <a-space direction="vertical" style="min-width: 480px">
            <a-form-item field="judgeConfig.timeLimit" label="时间限制">
              <a-input-number
                v-model="form.judgeConfig.timeLimit"
                placeholder="请输入时间限制"
                mode="button"
                min="0"
                size="large"
              />
              ms
            </a-form-item>
            <a-form-item field="judgeConfig.timeLimit" label="内存限制">
              <a-input-number
                v-model="form.judgeConfig.memoryLimit"
                placeholder="请输入内存限制"
                mode="button"
                min="0"
                size="large"
              />
              KB
            </a-form-item>
            <a-form-item field="judgeConfig.timeLimit" label="堆栈限制">
              <a-input-number
                v-model="form.judgeConfig.stackLimit"
                placeholder="请输入堆栈限制"
                mode="button"
                min="0"
                size="large"
              />
              KB
            </a-form-item>
          </a-space>
        </a-form-item>
        <a-form-item
          label="判题用例"
          :content-flex="false"
          :merge-props="false"
        >
          <a-form-item
            v-for="(judgeCase, index) of form.judgeCaseList"
            :key="index"
            no-style
          >
            <a-space direction="vertical" style="min-width: 480px">
              <a-form-item
                :field="`form.judgeCaseList[${index}].input`"
                :label="`输入用例-${index}`"
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
                >删除
              </a-button>
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
          <a-button
            type="primary"
            style="min-width: 200px"
            @click="handleSubmit"
            >提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MDEditor from "@/components/MDEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
//如果页面url包含update，视为更新页面
const update = route.fullPath.includes("update");
//根据题目id获取题目信息
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    form.value.tags = JSON.parse((res.data?.tags as string) ?? "[]");
    form.value.judgeCaseList = JSON.parse(
      (res.data?.judgeCase as string) ?? "[]"
    );
    form.value.judgeConfig = JSON.parse(
      (res.data?.judgeConfig as string) ?? "{}"
    );
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  if (update) {
    loadData();
  }
});
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
  if (!update) {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error("创建失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
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
  max-width: 840px;
  margin: auto;
}
</style>
