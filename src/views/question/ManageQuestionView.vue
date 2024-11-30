<template>
  <div id="manageQuestionView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="title" label="题目名称：" tooltip="请输入题目名称">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入题目名称"
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签" tooltip="请输入题目标签">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签"
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="outline" shape="round" status="normal" @click="doSearch"
          >搜 索
        </a-button>
      </a-form-item>
    </a-form>
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
      <template #title="{ record }">
        <a-button type="text" @click="toDoQuestion(record)"
          >{{ record.title }}
        </a-button>
      </template>

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
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-button type="outline" shape="round" @click="doUpdate(record)"
            >修改
          </a-button>
          <a-popconfirm
            content="确定要删除此题目吗?"
            style="width: 180px"
            type="error"
            okText="是"
            cancelText="否"
            @cancel="
              () => {
                message.warning(`已取消`);
              }
            "
            @ok="doDelete(record)"
          >
            <a-button shape="round" type="outline" status="danger"
              >删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { Question } from "../../../generated/models/Question";

document.title="题目管理"

const router = useRouter();

// 搜索参数
const searchParams = ref({
  title: "",
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
    align: "center",
    width: 190,
  },
  {
    title: "题目",
    slotName: "title",
    align: "center",
    width: 180,
  },
  /*  {
      title: "内容",
      dataIndex: "content",
    },*/
  {
    title: "标签",
    slotName: "tags",
    align: "center",
    width: 20,
  },
  /*  {
      title: "答案",
      dataIndex: "answer",
    },*/
  {
    title: "提交数",
    dataIndex: "submitNum",
    align: "center",
    width: 90,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    align: "center",
    width: 90,
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    children: [
      {
        title: "时间限制",
        dataIndex: "timeLimit",
        align: "center",
        width: 100,
      },
      {
        title: "内存限制",
        dataIndex: "memoryLimit",
        align: "center",
        width: 100,
      },
      {
        title: "堆栈限制",
        dataIndex: "stackLimit",
        align: "center",
        width: 100,
      },
    ],
  },
  /*  {
      title: "判题用例",
      dataIndex: "judgeCase",
    },*/
  {
    title: "创建者id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
    width: 110,
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
    width: 80,
  },
];

/**
 * 修改题目函数
 * @param question
 */
const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

/**
 * 删除题目函数
 * @param question
 */
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
#manageQuestionView {
}
</style>
