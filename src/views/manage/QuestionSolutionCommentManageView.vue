<template>
  <div id="QuestionSolutionCommentManageView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="id">
        <a-input
          v-model="searchParams.id"
          placeholder="搜索记录id"
          style="min-width: 220px; border-radius: 10px"
        />
      </a-form-item>
      <a-form-item field="userId">
        <a-input
          v-model="searchParams.userId"
          placeholder="搜索用户id"
          style="min-width: 220px; border-radius: 10px"
        />
      </a-form-item>
      <a-form-item field="solutionId">
        <a-input
          v-model="searchParams.solutionId"
          placeholder="搜索题解id"
          style="min-width: 220px; border-radius: 10px"
        />
      </a-form-item>
      <a-form-item field="parentId">
        <a-input
          v-model="searchParams.parentId"
          placeholder="搜索父评论id"
          style="min-width: 220px; border-radius: 10px"
        />
      </a-form-item>
      <a-form-item field="respondUserId">
        <a-input
          v-model="searchParams.respondUserId"
          placeholder="搜索被评论人id"
          style="min-width: 220px; border-radius: 10px"
        />
      </a-form-item>
      <a-form-item field="content">
        <a-input-search
          v-model="searchParams.content"
          placeholder="搜索评论内容"
          style="min-width: 220px; border-radius: 10px"
        />
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
  QuestionSolutionComment,
  QuestionSolutionCommentControllerService,
} from "../../../generated";

document.title = "题解评论管理";

const router = useRouter();
const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  id: undefined,
  userId: undefined,
  solutionId: undefined,
  parentId: undefined,
  respondUserId: undefined,
  content: "",
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionSolutionCommentControllerService.listQuestionSolutionCommentByPageUsingPost(
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
    title: "用户id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "题解id",
    dataIndex: "solutionId",
    align: "center",
  },
  {
    title: "父评论id",
    dataIndex: "parentId",
    align: "center",
  },
  {
    title: "被评论人id",
    dataIndex: "respondUserId",
    align: "center",
  },
  {
    title: "内容",
    dataIndex: "content",
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
    title: "创建时间",
    slotName: "createTime",
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
 * @param questionSolutionComment
 */
const doDelete = async (questionSolutionComment: QuestionSolutionComment) => {
  const res =
    await QuestionSolutionCommentControllerService.deleteQuestionSolutionCommentUsingPost(
      {
        id: questionSolutionComment.id,
      }
    );
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};
</script>

<style scoped>
#QuestionSolutionCommentManageView {
  padding: 5px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
  border-radius: 10px;
}
</style>