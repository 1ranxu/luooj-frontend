<template>
  <div id="manageQuestionView">
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        ...searchParams,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) of JSON.parse(record.tags)"
            :key="index"
            color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const router = useRouter();

const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const total = ref(0);

const dataList = ref([]);
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost({
    ...searchParams.value,
  });
  if (res.code === 0) {
    res.data.records.map(async (record: any) => {
      const judgeConfig = JSON.parse(record.judgeConfig);
      record["timeLimit"] = judgeConfig.timeLimit;
      record["memoryLimit"] = judgeConfig.memoryLimit;
      record["stackLimit"] = judgeConfig.stackLimit;
      return record;
    });
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
    title: "id",
    dataIndex: "id",
    width: 190,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 180,
  },
  /*  {
      title: "内容",
      dataIndex: "content",
    },*/
  {
    title: "标签",
    slotName: "tags",
    width: 240,
  },
  /*  {
      title: "答案",
      dataIndex: "answer",
    },*/
  {
    title: "提交数",
    dataIndex: "submitNum",
    width: 90,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    width: 90,
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    children: [
      {
        title: "时间限制",
        dataIndex: "timeLimit",
        width: 100,
      },
      {
        title: "内存限制",
        dataIndex: "memoryLimit",
        width: 100,
      },
      {
        title: "堆栈限制",
        dataIndex: "stackLimit",
        width: 100,
      },
    ],
    width: 300,
  },
  /*  {
      title: "判题用例",
      dataIndex: "judgeCase",
    },*/
  {
    title: "创建者",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 110,
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    // 更新数据
    loadData();
  } else {
    message.error("删除失败，", res.message);
  }
};
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
</script>

<style scoped>
#manageQuestionView {
}
</style>
