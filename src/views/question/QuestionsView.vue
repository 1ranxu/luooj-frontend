<template>
  <div id="questionsView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="title" label="题目名称" tooltip="请输入题目名称">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入题目名称"
          style="min-width: 220px"
        />
      </a-form-item>
      <a-form-item field="difficulty" label="题目难度" tooltip="请选择题目难度">
        <a-select :style="{width:'220px'}" v-model="searchParams.difficulty" allow-clear placeholder="请选择难度">
          <a-option :value="0">简单</a-option>
          <a-option :value="1">中等</a-option>
          <a-option :value="2">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="题目标签" tooltip="请输入题目标签">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签"
          style="min-width: 220px"
        />
      </a-form-item>
<!--      <a-form-item>
        <a-button type="outline" shape="round" status="normal" @click="doSearch"
          >搜索
        </a-button>
      </a-form-item>-->
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total,
        showJumper: true,
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @pageSizeChange="onPageSizeChange"
    >
      <template #isAccepted="{ record }">
        <a-tooltip v-if="record.isAccepted == 0" content="已解答">
          <icon-check-circle
            :style="{ fontSize: '32px', color: 'green' }"
            :stroke-width="2"
          />
        </a-tooltip>
      </template>

      <template #title="{ record }">
        <a-button type="text" @click="toDoQuestion(record)"
          >{{ record.title }}
        </a-button>
      </template>

      <template #difficulty="{ record }">
        <a-space wrap>
          <a-typography-text type="success" v-if="record.difficulty == 0">
            简单
          </a-typography-text>
          <a-typography-text type="warning" v-if="record.difficulty == 1">
            中等
          </a-typography-text>
          <a-typography-text type="danger" v-if="record.difficulty == 2">
            困难
          </a-typography-text>
        </a-space>
      </template>

      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum != 0
              ? (record.acceptedNum / record.submitNum).toFixed(2) * 100
              : "0"
          }%(${record.acceptedNum}/${record.submitNum})`
        }}
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { Question } from "../../../generated/models/Question";

document.title = "题库";

const router = useRouter();

// 搜索参数
const searchParams = ref({
  title: "",
  difficulty: undefined,
  tags: [],
  pageSize: 10,
  current: 1,
});

// 题目总数
const total = ref(0);

// 题目数据
const dataList = ref([]);

/**
 * 获取题目数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
    ...searchParams.value,
  });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听loadData函数所使用的变量的变化，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "状态",
    slotName: "isAccepted",
    align: "center",
  },
  {
    title: "题目",
    slotName: "title",
    align: "center",
  },
  {
    title: "难度",
    slotName: "difficulty",
    align: "center",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
  },
];
/**
 * 跳转到做题页面
 * @param question
 */
const toDoQuestion = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 页面切换
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 页面大小切换
 * @param size
 */
const onPageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};

/**
 * 搜索函数
 */
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  // loadData();
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>