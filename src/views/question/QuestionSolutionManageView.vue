<template>
  <div id="QuestionSolutionManageView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="id" label="id：" tooltip="请输入题解id">
        <a-input v-model="searchParams.id" placeholder="请输入要搜索的题解id" />
      </a-form-item>
      <a-form-item field="questionId" label="题目id：" tooltip="请输入题目id">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入要搜索的题目id"
        />
      </a-form-item>
      <a-form-item field="userId" label="创建人id：" tooltip="请输入创建人id">
        <a-input
          v-model="searchParams.userId"
          placeholder="请输入要搜索的创建人id"
        />
      </a-form-item>
      <a-form-item field="title" label="题解标题：" tooltip="请输入题解标题">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入要搜索的题解标题"
        />
      </a-form-item>
      <a-form-item field="content" label="题解内容：" tooltip="请输入题解内容">
        <a-input
          v-model="searchParams.content"
          placeholder="请输入要搜索的题解内容"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签" tooltip="请输入题解标签">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签"
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="outline" shape="round" status="normal" @click="doSubmit"
          >搜 索
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="outline" shape="round" status="normal" @click="loadData"
          >刷 新
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :column-resizable="true"
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
        showJumper: true,
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @pageSizeChange="onPageSizeChange"
    >
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-popconfirm
            content="确定要删除此记录吗?"
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
import moment from "moment";
import { useRouter } from "vue-router";
import {
  QuestionSolution,
  QuestionSolutionControllerService,
} from "../../../generated";

document.title = "题解管理";

const router = useRouter();
const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  id: undefined,
  questionId: undefined,
  userId: undefined,
  title: undefined,
  content: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionSolutionControllerService.listQuestionSolutionByPageUsingPost(
      {
        ...searchParams.value,
        sortField: "createTime",
        sortOrder: "descend",
      }
    );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "题目id",
    dataIndex: "questionId",
    align: "center",
  },
  {
    title: "创建人id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "题解标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "题解内容",
    dataIndex: "content",
    ellipsis: true,
    tooltip: { position: "left" },
    align: "center",
  },
  {
    title: "标签",
    dataIndex: "tags",
    ellipsis: true,
    tooltip: { position: "left" },
    align: "center",
  },
  {
    title: "点赞数",
    dataIndex: "likes",
    align: "center",
  },
  {
    title: "评论数",
    dataIndex: "comments",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "更新时间",
    slotName: "updateTime",
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
  },
];

/**
 * 分页
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 分页大小
 * @param size
 */
const onPageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};

/**
 * 删除
 * @param questionSolution
 */
const doDelete = async (questionSolution: QuestionSolution) => {
  const res =
    await QuestionSolutionControllerService.deleteQuestionSolutionUsingPost({
      id: questionSolution.id,
    });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#QuestionSolutionManageView {
  padding: 5px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
  border-radius: 10px;
}
</style>