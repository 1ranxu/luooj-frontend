<template>
  <div id="QuestionSolutionReportManageView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="id" label="id：" tooltip="请输入题解举报记录id">
        <a-input
          v-model="searchParams.id"
          placeholder="请输入要搜索的题解举报记录id"
        />
      </a-form-item>
      <a-form-item field="userId" label="检举人id：" tooltip="请输入检举人id">
        <a-input
          v-model="searchParams.userId"
          placeholder="请输入要搜索的检举人id"
        />
      </a-form-item>
      <a-form-item
        field="solutionId"
        label="被检举题解的id："
        tooltip="请输入被检举题解的id"
      >
        <a-input
          v-model="searchParams.solutionId"
          placeholder="请输入要搜索的被检举题解的id"
        />
      </a-form-item>
      <a-form-item
        field="reportedUserId"
        label="被检举人id："
        tooltip="请输入被检举人id"
      >
        <a-input
          v-model="searchParams.reportedUserId"
          placeholder="请输入要搜索的被检举人id"
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
            @ok="doDeleteAfterConfirm(record)"
          >
            <a-button shape="round" type="outline" status="danger"
              >确认违规并删除
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
  QuestionSolutionReport,
  QuestionSolutionReportControllerService,
} from "../../../generated";

document.title = "题解举报管理";

const router = useRouter();
const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  id: undefined,
  userId: undefined,
  solutionId: undefined,
  reportedUserId: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionSolutionReportControllerService.listQuestionSolutionReportByPageUsingPost(
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
    title: "检举人id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "被检举题解的id",
    dataIndex: "solutionId",
    align: "center",
  },
  {
    title: "被检举人id",
    dataIndex: "reportedUserId",
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
 * @param questionSolutionReport
 */
const doDelete = async (questionSolutionReport: QuestionSolutionReport) => {
  const res =
    await QuestionSolutionReportControllerService.deleteQuestionSolutionReportUsingPost(
      questionSolutionReport.id as number
    );
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};
/**
 * 确认违规并删除
 * @param questionSolutionReport
 */
const doDeleteAfterConfirm = async (
  questionSolutionReport: QuestionSolutionReport
) => {
  const res =
    await QuestionSolutionReportControllerService.deleteQuestionSolutionAfterConfirmUsingPost(
      {
        id: questionSolutionReport.id,
        solutionId: questionSolutionReport.solutionId,
      }
    );
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
#QuestionSolutionReportManageView {
  padding: 5px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
  border-radius: 10px;
}
</style>