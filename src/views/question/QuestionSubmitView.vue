<template>
  <div id="questionSubmitView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="language">
        <a-select
          v-model="searchParams.language"
          style="width: 300px;border-radius: 10px"
          placeholder="选择语言"
          allow-clear
        >
          <a-option v-for="language in languages" :key="language"
          >{{ language }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="outline" shape="round" status="normal" @click="loadData"
          >刷新
        </a-button>
      </a-form-item>
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
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @pageSizeChange="onPageSizeChange"
    >
      <template #message="{ record }">
        <a-tag
          v-if="record.judgeInfo.message === JudgeInfoMessageEnum.ACCEPTED"
          color="blue"
          bordered
        >
          {{ record.judgeInfo.message }}
        </a-tag>
        <a-tag
          v-else-if="record.judgeInfo.message === JudgeInfoMessageEnum.WAITING"
          color="green"
          bordered
        >
          {{ record.judgeInfo.message }}
        </a-tag>
        <a-tag v-else color="red" bordered>
          {{ record.judgeInfo.message }}
        </a-tag>
      </template>
      <template #memory="{ record }">
        {{ record.judgeInfo.memory ? record.judgeInfo.memory : 0 }} K
      </template>

      <template #time="{ record }">
        {{ record.judgeInfo.time ? record.judgeInfo.time : 0 }} ms
      </template>

      <template #status="{ record }">
        <!-- 0-待判题、1-判题中、2-已判题、3-失败 -->
        <a-tag v-if="record.status === 0" color="gray">待判题</a-tag>
        <a-tag v-if="record.status === 1" color="arcoblue">判题中</a-tag>
        <a-tag v-if="record.status === 2" color="green">已判题</a-tag>
        <a-tag v-if="record.status === 3" color="red">失败</a-tag>
      </template>

      <template #questionTitle="{ record }">
        <a-button type="text" @click="toDoQuestion(record.questionVO)"
          >{{ record.questionVO.title }}
        </a-button>
      </template>

      <template #userName="{ record }">
        {{ record.userVO?.userName ? record.userVO?.userName : "无名者" }}
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import JudgeInfoMessageEnum from "@/enums/JudgeInfoMessageEnum";
import { QuestionSubmitQueryRequest } from "../../../generated/models/QuestionSubmitQueryRequest";
import { QuestionSubmitControllerService } from "../../../generated/services/QuestionSubmitControllerService";
import { Question } from "../../../generated/models/Question";
import { QuestionControllerService } from "../../../generated";

document.title="状态"

const router = useRouter();

// 搜索参数
const searchParams = ref<QuestionSubmitQueryRequest>({
  language: "",
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

// 提交记录总数
const total = ref(0);

// 提交记录
const dataList = ref([]);

// 支持语言
const languages = ref<string[]>();

/**
 * 获取提交记录
 */
const loadData = async () => {
  const res =
    await QuestionSubmitControllerService.listQuestionSubmitByPageUsingPost({
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
  getLanguage();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "编程语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "判题信息",
    children: [
      {
        title: "判题结果",
        slotName: "message",
        align: "center",
        width: 100,
      },
      {
        title: "内存消耗",
        slotName: "memory",
        align: "center",
        width: 100,
      },
      {
        title: "时间消耗",
        slotName: "time",
        align: "center",
        width: 100,
      },
    ],
  },
  {
    title: "提交状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "题目",
    slotName: "questionTitle",
    align: "center",
  },
  {
    title: "提交者",
    slotName: "userName",
    align: "center",
  },
  {
    title: "提交时间",
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

/**
 * 从后端获取支持语言
 */
const getLanguage = async () => {
  // 从后端获取支持语言
  const res = await QuestionControllerService.getCodeLanguageUsingGet();
  if (res.code === 0) {
    languages.value = res.data;
  }
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
