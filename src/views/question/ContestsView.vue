<template>
  <div id="contestsView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="justify-content: center; align-content: center; margin: 25px"
    >
      <a-form-item field="title">
        <a-input-search
          v-model="searchParams.title"
          placeholder="搜索竞赛"
          style="min-width: 300px;border-radius: 10px"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="outline"
          shape="round"
          status="normal"
          @click="openAddContestModal"
          v-if="loginUser.userRole == 'admin'"
          >创建
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
      <template #status="{ record }">
        {{
          moment().isBefore(moment(record.startTime))
            ? "未开始"
            : moment().isAfter(moment(record.endTime))
            ? "已结束"
            : "进行中"
        }}
      </template>

      <template #title="{ record }">
        <a-button
          :disabled="
            moment().isBefore(moment(record.startTime)) ||
            (moment().isAfter(moment(record.startTime)) &&
              moment().isBefore(moment(record.endTime)) &&
              !record.isApply)
          "
          type="text"
          @click="goToContest(record.id)"
          >{{ record.title }}
        </a-button>
      </template>

      <template #startTime="{ record }">
        <a-space wrap>
          {{ moment(record.startTime).format("YYYY-MM-DD HH:mm:ss") }}
        </a-space>
      </template>
      <template #endTime="{ record }">
        <a-space wrap>
          {{ moment(record.endTime).format("YYYY-MM-DD HH:mm:ss") }}
        </a-space>
      </template>

      <template #duration="{ record }">
        {{ moment.duration(record.duration, "seconds").hours() }}小时
        {{ moment.duration(record.duration, "seconds").minutes() }}分钟
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            type="text"
            shape="round"
            @click="doApply(record)"
            v-if="
              !record.isApply && moment().isBefore(moment(record.startTime))
            "
            >报名
          </a-button>
          <a-button
            type="text"
            shape="round"
            @click="doApply(record)"
            v-if="record.isApply && moment().isBefore(moment(record.startTime))"
          >
            取消报名
          </a-button>
          <a-button
            type="text"
            shape="round"
            @click="openUpdateContestModal(record)"
            v-if="loginUser.userRole == 'admin'"
            >修改
          </a-button>
          <a-popconfirm
            content="确定要删除此竞赛吗?"
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
            <a-button
              shape="round"
              type="text"
              status="danger"
              v-if="loginUser.userRole == 'admin'"
              >删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <!-- 修改竞赛 -->
    <a-modal
      width="30%"
      :visible="updateContestVisible"
      placement="right"
      @ok="handleUpdateContest"
      @cancel="closeUpdateContestModal"
      unmountOnClose
    >
      <div style="text-align: center">
        <a-form
          :model="updateContest"
          label-align="right"
          title="竞赛信息"
          style="max-width: 480px; margin: 0 auto"
        >
          <a-form-item field="title" label="标题 :">
            <a-input
              v-model="updateContest.title"
              placeholder="请输入竞赛标题"
            />
          </a-form-item>
          <a-form-item field="tips" label="提示 :">
            <a-textarea
              v-model="updateContest.tips"
              placeholder="请输入竞赛提示"
            />
          </a-form-item>
          <a-form-item field="startTime" label="开始时间 :">
            <a-date-picker
              v-model="updateContest.startTime"
              style="width: 220px; margin: 0 24px 24px 0"
              show-time
              :time-picker-props="{ defaultValue: updateContest.startTime }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item field="endTime" label="结束时间 :">
            <a-date-picker
              v-model="updateContest.endTime"
              style="width: 220px; margin: 0 24px 24px 0"
              show-time
              :time-picker-props="{ defaultValue: updateContest.endTime }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item field="duration" label="持续时间 :">
            <a-textarea
              v-model="updateContest.duration"
              placeholder="请输入持续时间"
            />
          </a-form-item>
          <a-form-item field="award" label="奖励 :">
            <a-textarea
              v-model="updateContest.award"
              placeholder="请输入奖励内容"
            />
          </a-form-item>
          <!-- 题目一 -->
          <a-form-item field="one" label="题目一">
            <a-input
              v-model="updateContest.questions['1'].questionId"
              placeholder="请输入第一题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="updateContest.questions['1'].score"
              placeholder="请输入第一题分数"
            />
          </a-form-item>
          <!-- 题目二 -->
          <a-form-item field="two" label="题目二">
            <a-input
              v-model="updateContest.questions['2'].questionId"
              placeholder="请输入第二题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="updateContest.questions['2'].score"
              placeholder="请输入第二题分数"
            />
          </a-form-item>
          <!-- 题目三-->
          <a-form-item field="three" label="题目三">
            <a-input
              v-model="updateContest.questions['3'].questionId"
              placeholder="请输入第三题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="updateContest.questions['3'].score"
              placeholder="请输入第三题分数"
            />
          </a-form-item>
          <!-- 题目四 -->
          <a-form-item field="four" label="题目四">
            <a-input
              v-model="updateContest.questions['4'].questionId"
              placeholder="请输入第四题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="updateContest.questions['4'].score"
              placeholder="请输入第四题分数"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 创建竞赛 -->
    <a-modal
      width="30%"
      :visible="addContestVisible"
      placement="right"
      @ok="handleAddContest"
      @cancel="closeAddContestModal"
      unmountOnClose
    >
      <div style="text-align: center">
        <a-form
          :model="addContest"
          label-align="right"
          title="竞赛信息"
          style="max-width: 480px; margin: 0 auto"
        >
          <a-form-item field="title" label="标题 :">
            <a-input v-model="addContest.title" placeholder="请输入竞赛标题" />
          </a-form-item>
          <a-form-item field="tips" label="提示 :">
            <a-textarea
              v-model="addContest.tips"
              placeholder="请输入竞赛提示"
            />
          </a-form-item>
          <a-form-item field="startTime" label="开始时间 :">
            <a-date-picker
              v-model="addContest.startTime"
              style="width: 220px; margin: 0 24px 24px 0"
              show-time
              :time-picker-props="{ defaultValue: addContest.startTime }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item field="endTime" label="结束时间 :">
            <a-date-picker
              v-model="addContest.endTime"
              style="width: 220px; margin: 0 24px 24px 0"
              show-time
              :time-picker-props="{ defaultValue: addContest.endTime }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item field="duration" label="持续时间 :">
            <a-textarea
              v-model="addContest.duration"
              placeholder="请输入持续时间"
            />
          </a-form-item>
          <a-form-item field="award" label="奖励 :">
            <a-textarea
              v-model="addContest.award"
              placeholder="请输入奖励内容"
            />
          </a-form-item>
          <!-- 题目一 -->
          <a-form-item field="one" label="题目一">
            <a-input
              v-model="addContest.questions['1'].questionId"
              placeholder="请输入第一题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="addContest.questions['1'].score"
              placeholder="请输入第一题分数"
            />
          </a-form-item>
          <!-- 题目二 -->
          <a-form-item field="two" label="题目二">
            <a-input
              v-model="addContest.questions['2'].questionId"
              placeholder="请输入第二题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="addContest.questions['2'].score"
              placeholder="请输入第二题分数"
            />
          </a-form-item>
          <!-- 题目三-->
          <a-form-item field="three" label="题目三">
            <a-input
              v-model="addContest.questions['3'].questionId"
              placeholder="请输入第三题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="addContest.questions['3'].score"
              placeholder="请输入第三题分数"
            />
          </a-form-item>
          <!-- 题目四 -->
          <a-form-item field="four" label="题目四">
            <a-input
              v-model="addContest.questions['4'].questionId"
              placeholder="请输入第四题"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="addContest.questions['4'].score"
              placeholder="请输入第四题分数"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import {
  Contest,
  ContestApplyControllerService,
  ContestControllerService,
} from "../../../generated";
import { useStore } from "vuex";

document.title = "竞赛";

const router = useRouter();

// 获取登录用户
const store = useStore();
let loginUser = store.state.user.loginUser;

// 搜索参数
const searchParams = ref({
  title: "",
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

// 竞赛总数
const total = ref(0);

// 竞赛数据
const dataList = ref([]);

// 修改竞赛对象
const updateContest = ref({
  id: 0,
  award: "",
  duration: 0,
  endTime: "",
  questions: {
    "1": {
      questionId: "",
      score: "",
    },
    "2": {
      questionId: "",
      score: "",
    },
    "3": {
      questionId: "",
      score: "",
    },
    "4": {
      questionId: "",
      score: "",
    },
  },
  startTime: "",
  tips: "",
  title: "",
});

// 创建竞赛对象
const addContest = ref({
  award: "",
  duration: 0,
  endTime: "",
  questions: {
    "1": {
      questionId: "",
      score: "",
    },
    "2": {
      questionId: "",
      score: "",
    },
    "3": {
      questionId: "",
      score: "",
    },
    "4": {
      questionId: "",
      score: "",
    },
  },
  startTime: "",
  tips: "",
  title: "",
});

// 弹窗是否可见
const updateContestVisible = ref(false);
const addContestVisible = ref(false);
// 打开弹窗
const openUpdateContestModal = (record: Contest) => {
  updateContestVisible.value = true;
  updateContest.value.id = record.id;
  updateContest.value.award = record.award;
  updateContest.value.duration = record.duration;
  updateContest.value.endTime = moment(record.endTime).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  updateContest.value.startTime = moment(record.startTime).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  updateContest.value.tips = record.tips;
  updateContest.value.title = record.title;
  updateContest.value.questions = JSON.parse(
    record.questions.replace(/:s*([0-9]{15,})s*(,?)/g, ': "$1" $2')
  );
};
const openAddContestModal = () => {
  addContestVisible.value = true;
};
// 关闭弹窗
const closeUpdateContestModal = () => {
  updateContestVisible.value = false;
};
const closeAddContestModal = () => {
  addContestVisible.value = false;
};
/**
 * 获取竞赛数据
 */
const getContests = async () => {
  const res = await ContestControllerService.listContestByPageUsingPost({
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
  getContests();
});

onMounted(() => {
  getContests();
});

const columns = [
  {
    title: "状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "竞赛",
    slotName: "title",
    align: "center",
  },
  {
    title: "开始时间",
    slotName: "startTime",
    align: "center",
  },
  {
    title: "结束时间",
    slotName: "endTime",
    align: "center",
  },
  {
    title: "时长",
    slotName: "duration",
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
    width: 80,
  },
];

/**
 * 页面刷新
 */
function refreshAtDailyTime(hour:number, minute:number, second:number) {
  function checkTime() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    if (currentHour === hour && currentMinute === minute && currentSecond === second) {
      location.reload(); // 刷新页面
    }
  }
  setInterval(checkTime, 1000);
}
refreshAtDailyTime(10, 30, 0);

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
};

/**
 * 报名/取消报名竞赛
 * @param record
 */
const doApply = async (record: Contest) => {
  const res = await ContestApplyControllerService.applyContestUsingPost({
    contestId: record.id,
    isApply: !record.isApply,
  });
  if (res.code == 0) {
    if (record.isApply) {
      message.success("取消报名成功");
    } else {
      message.success("报名成功");
    }
    await getContests();
  } else {
    message.error("" + res.message);
  }
};

/**
 * 更新竞赛
 */
const handleUpdateContest = async () => {
  const res = await ContestControllerService.updateContestUsingPost(
    updateContest.value
  );
  if (res.code == 0) {
    updateContestVisible.value = false;
    await getContests();
    message.success("修改成功");
  } else {
    message.error("" + res.message);
  }
};

/**
 * 创建竞赛
 */
const handleAddContest = async () => {
  const res = await ContestControllerService.addContestUsingPost(
    addContest.value
  );
  if (res.code == 0) {
    addContestVisible.value = false;
    await getContests();
    message.success("创建成功");
  } else {
    message.error("" + res.message);
  }
};

/**
 * 删除竞赛
 * @param record
 */
const doDelete = async (record: Contest) => {
  const res = await ContestControllerService.deleteContestUsingPost(record.id);
  if (res.code == 0) {
    message.success("删除成功");
  } else {
    message.error("删除失败，" + res.message);
  }
};

/**
 * 点击竞赛标题进行跳转
 * @param userId
 */
const goToContest = (contestId: number) => {
  router.push({
    path: `/detail/contest/${contestId}`,
  });
};
</script>

<style scoped>
#contestsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>