<template>
  <div id="userView">
    <a-descriptions-item>
      <!--   头像展示   -->
      <a-avatar :size="100" shape="circle">
        <img alt="头像" :src="user.userAvatar" />
      </a-avatar>
      <!-- 关注 -->
      <a-button
        v-if="!isFollow"
        type="text"
        shape="round"
        status="normal"
        size="medium"
        style="margin: 10px"
        @click="follow(user.id, true)"
        >关注
      </a-button>
      <!-- 取消关注 -->
      <a-button
        v-else
        type="text"
        shape="round"
        status="normal"
        size="medium"
        style="margin: 10px"
        @click="follow(user.id, false)"
        >取消关注
      </a-button>
    </a-descriptions-item>
    <!--  通过题目数排名  -->
    <a-card title="全站排名">
      <a-descriptions size="large" column="1" bordered>
        <a-descriptions-item :label="'账号'">
          {{ user.userAccount }}
        </a-descriptions-item>
        <a-descriptions-item :label="'用户昵称'">
          {{ user.userName }}
        </a-descriptions-item>
        <a-descriptions-item :label="'我的简介'">
          {{ user.userProfile }}
        </a-descriptions-item>
        <a-descriptions-item :label="'用户角色'">
          {{ user.userRole === "user" ? "普通用户" : "管理员" }}
        </a-descriptions-item>
        <a-descriptions-item :label="'邮箱'">
          {{ user.email }}
        </a-descriptions-item>
        <a-descriptions-item :label="'性别'">
          {{ user.gender == null ? "未设置" : user.gender == 0 ? "男" : "女" }}
        </a-descriptions-item>
      </a-descriptions>
      <template #extra>
        <a-tooltip content="通过题目数排名">
          <a-badge status="processing" :text="acceptedQuestionRanking" />
        </a-tooltip>
      </template>
    </a-card>
    <div>
      <a-button
        shape="round"
        status="success"
        size="small"
        type="outline"
        style="margin: 10px"
      >
        <a-link @click="toIndex">首页</a-link>
      </a-button>
    </div>
  </div>
  <!-- 通过题目详情统计 -->
  <div id="userAcceptedQuestionDetail">
    <a-tooltip
      position="bottom"
      :content="
        acceptedQuestionDetail.eachDifficultysubmissionPassRate[0] * 100 + '%'
      "
    >
      <div
        style="
          float: left;
          width: 200px;
          height: 88px;
          background-color: rgb(247, 248, 250);
          border-radius: 10px;
        "
      >
        <div style="text-align: center; font-size: 20px; margin-top: 15px">
          <a-typography-text type="success"> 简单</a-typography-text>
        </div>
        <div style="text-align: center; font-size: 18px">
          <a-typography-text>
            {{ acceptedQuestionDetail.eachDifficultyPassNum[0] }}/{{
              acceptedQuestionDetail.eachDifficultyQuestionNum[0]
            }}
          </a-typography-text>
        </div>
      </div>
    </a-tooltip>
    <a-tooltip
      position="bottom"
      :content="
        acceptedQuestionDetail.eachDifficultysubmissionPassRate[1] * 100 + '%'
      "
    >
      <div
        style="
          float: left;
          margin-left: 6px;
          width: 200px;
          height: 88px;
          background-color: rgb(247, 248, 250);
          border-radius: 10px;
        "
      >
        <div style="text-align: center; font-size: 20px; margin-top: 15px">
          <a-typography-text type="warning"> 中等</a-typography-text>
        </div>
        <div style="text-align: center; font-size: 18px">
          <a-typography-text>
            {{ acceptedQuestionDetail.eachDifficultyPassNum[1] }}/{{
              acceptedQuestionDetail.eachDifficultyQuestionNum[1]
            }}
          </a-typography-text>
        </div>
      </div>
    </a-tooltip>
    <a-tooltip
      position="bottom"
      :content="
        acceptedQuestionDetail.eachDifficultysubmissionPassRate[2] * 100 + '%'
      "
    >
      <div
        style="
          float: left;
          margin-left: 6px;
          width: 200px;
          height: 88px;
          background-color: rgb(247, 248, 250);
          border-radius: 10px;
        "
      >
        <div style="text-align: center; font-size: 20px; margin-top: 15px">
          <a-typography-text type="danger"> 困难</a-typography-text>
        </div>
        <div style="text-align: center; font-size: 18px">
          <a-typography-text>
            {{ acceptedQuestionDetail.eachDifficultyPassNum[2] }}/{{
              acceptedQuestionDetail.eachDifficultyQuestionNum[2]
            }}
          </a-typography-text>
        </div>
      </div>
    </a-tooltip>
    <a-tooltip
      position="bottom"
      :content="acceptedQuestionDetail.submissionPassRate * 100 + '%'"
    >
      <div
        style="
          float: left;
          margin-left: 6px;
          width: 200px;
          height: 88px;
          background-color: rgb(247, 248, 250);
          border-radius: 10px;
        "
      >
        <div style="text-align: center; font-size: 20px; margin-top: 15px">
          <a-typography-text type="primary"> 已解答</a-typography-text>
        </div>
        <div style="text-align: center; font-size: 18px">
          <a-typography-text>
            {{ acceptedQuestionDetail.passTotalNum }}/{{
              acceptedQuestionDetail.questionTotalNum
            }}
          </a-typography-text>
        </div>
      </div>
    </a-tooltip>
  </div>
  <!-- 题目提交详情统计 -->
  <div id="userSubmitDetail">
    <a-space>
      <a-select
        v-model="hotMap.calendar[0].range"
        :style="{ width: '150px' }"
        placeholder="请选择年份"
      >
        <a-option v-for="year in years" :value="year">{{ year }}</a-option>
      </a-select>
      <a-typography style="margin-left: 100px; color: #3c3c4399"
        >总提交次数：
      </a-typography>
      <a-typography
        >{{ submitDetail.years[hotMap.calendar[0].range] }}
      </a-typography>
      <a-typography style="margin-left: 100px; color: #3c3c4399"
        >累计提交天数：
      </a-typography>
      <a-typography
        >{{ submitDetail.dayNum[hotMap.calendar[0].range] }}
      </a-typography>
    </a-space>
    <v-chart autoresize :option="hotMap" />
  </div>
  <!-- 题单/题解/收藏 -->
  <div id="other">
    <a-tabs default-active-key="questionList" size="large">
      <!--题单-->
      <a-tab-pane key="questionList" title="题单">
        <a-list
          :scrollbar="true"
          :max-height="700"
          :size="'large'"
          :data="questionList"
          :pagination-props="{
            total: questionListTotal,
            current: questionListSearchParams.current,
            pageSize: questionListSearchParams.pageSize,
            showTotal: true,
            showPageSize: true,
          }"
          @pageSizeChange="onQuestionListPageSizeChange"
          @pageChange="onQuestionListPageChange"
        >
          <template #header>
            <a-form
              :model="questionListSearchParams"
              layout="inline"
              style="justify-content: center; align-content: center"
            >
              <a-form-item
                field="title"
                label="标题："
                tooltip="请输入题单标题"
              >
                <a-input
                  v-model="questionListSearchParams.title"
                  placeholder="请输入题单标题"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  shape="round"
                  status="normal"
                  @click="getQuestionList"
                  >搜 索
                </a-button>
              </a-form-item>
            </a-form>
          </template>
          <template #item="{ item }">
            <a-list-item>
              <a-button
                type="text"
                shape="round"
                status="normal"
                size="medium"
                style="margin: 10px"
                @click="openActualQuestionsModal(item.id)"
              >
                <a-list-item-meta :title="item.title"></a-list-item-meta>
              </a-button>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <!--题解-->
      <a-tab-pane key="questionSolution" title="题解">
        <a-list
          :hoverable="true"
          :scrollbar="true"
          :max-height="700"
          :size="'large'"
          :data="questionSolutionList"
          :pagination-props="{
            total: questionSolutionListTotal,
            current: questionSolutionListSearchParams.current,
            pageSize: questionSolutionListSearchParams.pageSize,
            showTotal: true,
          }"
          @pageSizeChange="onQuestionSolutionListPageSizeChange"
          @pageChange="onQuestionSolutionListPageChange"
        >
          <template #header>
            <a-form
              :model="questionSolutionListSearchParams"
              layout="inline"
              style="
                top: 20px;
                left: 80px;
                justify-content: center;
                align-content: center;
              "
            >
              <a-form-item field="tags" tooltip="请输入题解标签">
                <a-input-tag
                  v-model="questionSolutionListSearchParams.tags"
                  placeholder="请输入标签"
                />
              </a-form-item>
              <a-form-item field="title" tooltip="请输入题解标题">
                <a-input
                  v-model="questionSolutionListSearchParams.title"
                  placeholder="请输入题解标题"
                />
              </a-form-item>
              <!-- 搜索题解 -->
              <a-form-item>
                <a-button
                  type="primary"
                  shape="round"
                  status="normal"
                  @click="getQuestionSolutionList"
                  >搜 索
                </a-button>
              </a-form-item>
            </a-form>
          </template>
          <template #item="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title">
                <template #avatar>
                  <a-avatar>
                    <img alt="avatar" :src="item.userAvatar" />
                  </a-avatar>
                </template>
                <template #title>
                  <a-typography-text
                    bold
                    @click="goToSolution(item.questionId, item.id)"
                  >
                    {{ item.title }}
                  </a-typography-text>
                </template>
                <template #description>
                  <a-typography-text
                    ellipsis
                    type="secondary"
                    @click="goToSolution(item.questionId, item.id)"
                    >{{ item.content }}
                  </a-typography-text>
                  <a-overflow-list
                    style="width: 500px"
                    min="8"
                    margin="8"
                    @click="goToSolution(item.questionId, item.id)"
                  >
                    <a-tag
                      v-for="(tag, index) of JSON.parse(item.tags)"
                      :key="index"
                      color="green"
                      >{{ tag }}
                    </a-tag>
                  </a-overflow-list>
                  <!-- 点赞数图标 -->
                  <span @click="goToSolution(item.questionId, item.id)">
                    <IconHeartFill :style="{ color: '#f53f3f' }" />
                    {{ item.likes }}
                  </span>
                  <!-- 回复数图标 -->
                  <span
                    style="margin-left: 5px"
                    @click="goToSolution(item.questionId, item.id)"
                  >
                    <IconMessage /> {{ item.comments }}
                  </span>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <!--收藏-->
      <a-tab-pane key="collect" title="收藏">
        <a-tabs
          :position="'left'"
          default-active-key="collectQuestionList"
          size="small"
        >
          <!-- 收藏题单 -->
          <a-tab-pane key="collectQuestionList" title="题单">
            <a-list
              :scrollbar="true"
              :max-height="700"
              :size="'large'"
              :data="collectQuestionList"
              :pagination-props="{
                total: collectQuestionListTotal,
                current: collectQuestionListSearchParams.current,
                pageSize: collectQuestionListSearchParams.pageSize,
                showTotal: true,
                showPageSize: true,
              }"
              @pageSizeChange="onCollectQuestionListPageSizeChange"
              @pageChange="onCollectQuestionListPageChange"
            >
              <template #item="{ item }">
                <a-list-item>
                  <a-button
                    type="text"
                    shape="round"
                    status="normal"
                    size="medium"
                    style="margin: 10px"
                    @click="openActualCollectQuestionsModal(item.id)"
                  >
                    <a-list-item-meta :title="item.title"></a-list-item-meta>
                  </a-button>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
          <!-- 收藏题解 -->
          <a-tab-pane key="collectQuestionSolution" title="题解">
            <a-list
              :hoverable="true"
              :scrollbar="true"
              :max-height="700"
              :size="'large'"
              :data="collectQuestionSolutionList"
              :pagination-props="{
                total: collectQuestionSolutionListTotal,
                current: collectQuestionSolutionListSearchParams.current,
                pageSize: collectQuestionSolutionListSearchParams.pageSize,
                showTotal: true,
              }"
              @pageSizeChange="onCollectQuestionSolutionListPageSizeChange"
              @pageChange="onCollectQuestionSolutionListPageChange"
            >
              <template #item="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.title">
                    <template #avatar>
                      <a-avatar @click="goToUser(item.userId)">
                        <img alt="avatar" :src="item.userAvatar" />
                      </a-avatar>
                    </template>
                    <template #title>
                      <a-typography-text
                        bold
                        @click="goToSolution(item.questionId, item.id)"
                      >
                        {{ item.title }}
                      </a-typography-text>
                    </template>
                    <template #description>
                      <a-typography-text
                        ellipsis
                        type="secondary"
                        @click="goToSolution(item.questionId, item.id)"
                        >{{ item.content }}
                      </a-typography-text>
                      <a-overflow-list
                        style="width: 500px"
                        min="4"
                        margin="8"
                        @click="goToSolution(item.questionId, item.id)"
                      >
                        <a-tag
                          v-for="(tag, index) of JSON.parse(item.tags)"
                          :key="index"
                          color="green"
                          >{{ tag }}
                        </a-tag>
                      </a-overflow-list>
                      <!-- 点赞数图标 -->
                      <span @click="goToSolution(item.questionId, item.id)">
                        <IconHeartFill :style="{ color: '#f53f3f' }" />
                        {{ item.likes }}
                      </span>
                      <!-- 回复数图标 -->
                      <span
                        style="margin-left: 5px"
                        @click="goToSolution(item.questionId, item.id)"
                      >
                        <IconMessage /> {{ item.comments }}
                      </span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>
  </div>
  <!-- 具体的题单 -->
  <a-modal
    width="50%"
    :visible="actualQuestionsVisible"
    placement="right"
    @cancel="closeActualQuestionsModel"
    unmountOnClose
    :footer="false"
    :closable="false"
  >
    <a-list
      :data="questions"
      :pagination-props="{
        total: questionsTotal,
        current: questionsSearchParams.current,
        pageSize: questionsSearchParams.pageSize,
        showTotal: true,
        showPageSize: true,
      }"
      @pageSizeChange="onQuestionsPageSizeChange"
      @pageChange="onQuestionsPageChange"
    >
      <template #item="{ item }">
        <a-list-item>
          <a-button
            type="text"
            shape="round"
            status="normal"
            size="medium"
            style="margin: 10px"
            @click="toDoQuestion(item)"
          >
            <a-list-item-meta :title="item.title"></a-list-item-meta>
          </a-button>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
  <!-- 具体的收藏题单 -->
  <a-modal
    width="50%"
    :visible="actualCollectQuestionsVisible"
    placement="right"
    @cancel="closeActualCollectQuestionsModel"
    unmountOnClose
    :footer="false"
    :closable="false"
  >
    <a-list
      :data="collectQuestions"
      :pagination-props="{
        total: collectQuestionsTotal,
        current: collectQuestionsSearchParams.current,
        pageSize: collectQuestionsSearchParams.pageSize,
        showTotal: true,
        showPageSize: true,
      }"
      @pageSizeChange="onCollectQuestionsPageSizeChange"
      @pageChange="onCollectQuestionsPageChange"
    >
      <template #item="{ item }">
        <a-list-item>
          <a-button
            type="text"
            shape="round"
            status="normal"
            size="medium"
            style="margin: 10px"
            @click="toDoQuestion(item)"
          >
            <a-list-item-meta :title="item.title"></a-list-item-meta>
          </a-button>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { onMounted, ref, watchEffect } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import {
  QuestionSolutionCollectControllerService,
  QuestionSolutionControllerService,
} from "../../../generated";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import message from "@arco-design/web-vue/es/message";
import { FollowControllerService } from "../../../generated/services/FollowControllerService";
import { AcceptedQuestionDetailVO } from "../../../generated/models/AcceptedQuestionDetailVO";
import { AcceptedQuestionControllerService } from "../../../generated/services/AcceptedQuestionControllerService";
import { QuestionSubmitControllerService } from "../../../generated/services/QuestionSubmitControllerService";
import { QuestionListControllerService } from "../../../generated/services/QuestionListControllerService";
import { QuestionCollectControllerService } from "../../../generated/services/QuestionCollectControllerService";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { Question } from "../../../generated/models/Question";
import { QuestionListCollectControllerService } from "../../../generated/services/QuestionListCollectControllerService";

document.title = "Ta的主页";

const router = useRouter();
const store = useStore();

// 获取登录用户
let loginUser = store.state.user.loginUser;

// 获取用户id
interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const isFollow = ref(false);

// 获取用户
const user = ref({
  createTime: "",
  email: "",
  fans: 0,
  followers: 0,
  gender: 0,
  id: props.id,
  score: 0,
  updateTime: "",
  userAccount: "",
  userAvatar: "",
  userName: "",
  userProfile: "",
  userRole: "",
});

// 个人信息所展示的列
const userInfoColumns = [
  {
    label: "账号：",
    value: user.value.userAccount,
  },
  {
    label: "用户昵称：",
    value: user.value.userName,
  },
  {
    label: "我的简介：",
    value: user.value.userProfile,
  },

  {
    label: "邮箱：",
    value: user.value.email,
  },
];

// 通过题目排名
const acceptedQuestionRanking = ref(1);

// 题单分页
const questionList = ref([]);
const questionListTotal = ref(0);
const questionListSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  title: "",
  userId: props.id,
});

// 具体的题单中的题目分页
const questions = ref([]);
const questionsTotal = ref(0);
const questionsSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  questionListId: 0,
});

// 收藏题单分页
const collectQuestionList = ref([]);
const collectQuestionListTotal = ref(0);
const collectQuestionListSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  userId: props.id,
});

// 具体的收藏题单中的题目分页
const collectQuestions = ref([]);
const collectQuestionsTotal = ref(0);
const collectQuestionsSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  questionListId: 0,
});

// 用来记录所点击的某个题单的id
const questionListId = ref(0);

// 通过题目详情
const acceptedQuestionDetail = ref({
  passTotalNum: 0,
  eachDifficultyPassNum: {
    0: 0,
    1: 0,
    2: 0,
  },
  questionTotalNum: 0,
  eachDifficultyQuestionNum: {
    0: 0,
    1: 0,
    2: 0,
  },
  submissionPassRate: 0,
  eachDifficultysubmissionPassRate: {
    0: 0,
    1: 0,
    2: 0,
  },
} as AcceptedQuestionDetailVO);

// 题目提交详情
const submitDetail = ref({
  years: {},
  submitDetail: {},
  dayNum: {},
});

// 题目提交的年份
const years = ref([]);

// 题解
const questionSolutionList = ref([]);
const questionSolutionListTotal = ref(0);
const questionSolutionListSearchParams = ref({
  pageSize: 4,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  userId: props.id,
  questionId: null,
  title: "",
  tags: [],
});

// 题解收藏
const collectQuestionSolutionList = ref([]);
const collectQuestionSolutionListTotal = ref(0);
const collectQuestionSolutionListSearchParams = ref({
  pageSize: 4,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  userId: props.id,
  solutionId: null,
});

// 弹窗是否可见
const actualQuestionsVisible = ref(false);
const actualCollectQuestionsVisible = ref(false);
// 打开弹窗
const openActualQuestionsModal = (id: number) => {
  questionListId.value = id;
  actualQuestionsVisible.value = true;
  getQuestionsByQuestionListId(id);
};
const openActualCollectQuestionsModal = (id: number) => {
  actualCollectQuestionsVisible.value = true;
  getCollectQuestionsByCollectQuestionListId(id);
};
// 关闭弹窗
const closeActualQuestionsModel = () => {
  actualQuestionsVisible.value = false;
};
const closeActualCollectQuestionsModel = () => {
  actualCollectQuestionsVisible.value = false;
};

// 热力图
const hotMap = ref({
  tooltip: {
    position: "top",
    formatter: function (params) {
      return `${params.value}`;
    },
  },
  visualMap: {
    min: 0,
    max: 20,
    calculable: true,
    splitNumber: "5",
    type: "piecewise",
    orient: "horizontal",
    left: "center",
    top: "top",
    inRange: {
      color: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    },
  },
  calendar: [
    {
      left: 30,
      right: 30,
      range: "",
      cellSize: ["auto", 16],
    },
  ],
  series: [
    {
      type: "heatmap",
      coordinateSystem: "calendar",
      calendarIndex: 0,
      data: [],
    },
  ],
});

/**
 * 获取个人通过题目数排名
 */
const getAcceptedQuestionRanking = async () => {
  const res =
    await AcceptedQuestionControllerService.getAcceptedQuestionRankingUsingGet(props.id);
  if (res.code == 0) {
    acceptedQuestionRanking.value = res.data as number;
  }
};

/**
 * 关注或取消关注
 * @param record
 */
const follow = async (userId: number, followOrNot: boolean) => {
  const res = await FollowControllerService.followUsingPost(
    followOrNot,
    userId
  );
  if (res.code === 0) {
    isFollow.value = !isFollow;
    location.reload();
  } else {
    message.error(res.message);
  }
};

/**
 * 改变页码
 * @param page
 */
const onQuestionListPageChange = (page: number) => {
  questionListSearchParams.value = {
    ...questionListSearchParams.value,
    current: page,
  };
};
const onQuestionsPageChange = (page: number) => {
  questionsSearchParams.value = {
    ...questionsSearchParams.value,
    current: page,
  };
};
const onCollectQuestionListPageChange = (page: number) => {
  collectQuestionListSearchParams.value = {
    ...collectQuestionListSearchParams.value,
    current: page,
  };
};
const onCollectQuestionsPageChange = (page: number) => {
  collectQuestionsSearchParams.value = {
    ...collectQuestionsSearchParams.value,
    current: page,
  };
};
const onQuestionSolutionListPageChange = (page: number) => {
  questionSolutionListSearchParams.value = {
    ...questionSolutionListSearchParams.value,
    current: page,
  };
  getQuestionSolutionList();
};
const onCollectQuestionSolutionListPageChange = (page: number) => {
  collectQuestionSolutionListSearchParams.value = {
    ...collectQuestionSolutionListSearchParams.value,
    current: page,
  };
  getCollectQuestionSolutionList();
};

/**
 * 改变分页大小
 * @param size
 */
const onQuestionListPageSizeChange = (size: number) => {
  questionListSearchParams.value = {
    ...questionListSearchParams.value,
    pageSize: size,
  };
};
const onQuestionsPageSizeChange = (size: number) => {
  questionsSearchParams.value = {
    ...questionsSearchParams.value,
    pageSize: size,
  };
};
const onCollectQuestionListPageSizeChange = (size: number) => {
  collectQuestionListSearchParams.value = {
    ...collectQuestionListSearchParams.value,
    pageSize: size,
  };
};
const onCollectQuestionsPageSizeChange = (size: number) => {
  collectQuestionsSearchParams.value = {
    ...collectQuestionsSearchParams.value,
    pageSize: size,
  };
};
const onQuestionSolutionListPageSizeChange = (size: number) => {
  questionSolutionListSearchParams.value = {
    ...questionSolutionListSearchParams.value,
    pageSize: size,
  };
  getQuestionSolutionList();
};
const onCollectQuestionSolutionListPageSizeChange = (size: number) => {
  collectQuestionSolutionListSearchParams.value = {
    ...collectQuestionSolutionListSearchParams.value,
    pageSize: size,
  };
  getCollectQuestionSolutionList();
};

/**
 * 获取用户信息
 */
const getUser = async () => {
  const res = await UserControllerService.getUserVoByIdUsingGet(
    props.id as any
  );
  if (res.code == 0) {
    user.value = res.data as any;
  } else {
    message.error("" + res.message);
  }
};

const getIsFollow = async () => {
  const res = await FollowControllerService.isFollowUsingGet(props.id as any);
  if (res.code == 0) {
    isFollow.value = res.data as any;
  } else {
    message.error("" + res.message);
  }
};

/**
 * 获取通过题目详情
 */
const getAcceptedQuestionDetail = async () => {
  const res =
    await AcceptedQuestionControllerService.getAcceptedQuestionDetailUsingGet(
      props.id as any
    );
  if (res.code === 0) {
    acceptedQuestionDetail.value = res.data as {};
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 获取个人提交详情
 */
const getSubmitDetail = async () => {
  const res =
    await QuestionSubmitControllerService.getPersonSubmitDetailUsingGet(
      props.id as any
    );
  if (res.code === 0) {
    console.log(submitDetail.value.submitDetail);
    submitDetail.value = res.data as any;
    hotMap.value.series[0].data = Object.entries(
      res.data?.submitDetail as any
    ) as any;
    years.value = Object.keys(res.data?.years as any) as never[];
    if (years.value.length == 0) {
      years.value = [new Date().getFullYear() as never];
    }
    hotMap.value.calendar[0].range = years.value.at(-1) as any;
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 获取题单
 */
const getQuestionList = async () => {
  const res =
    await QuestionListControllerService.listQuestionListByPageUserUsingPost(
      questionListSearchParams.value as any
    );
  if (res.code === 0) {
    questionList.value = res.data.records;
    questionListTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 获取某个题单的题目
 */
const getQuestionsByQuestionListId = async (id: number) => {
  console.log(questionsSearchParams.value);
  const res =
    await QuestionCollectControllerService.listQuestionCollectByPageUserUsingPost(
      { ...questionsSearchParams.value, questionListId: id }
    );
  if (res.code === 0) {
    questions.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const questionVO =
          await QuestionControllerService.getQuestionVoByIdUsingGet(
            x.questionId
          );
        return { ...questionVO.data, questionListId: id };
      })
    )) as [];
    questionsTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
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
 * 获取收藏的题单
 */
const getCollectQuestionList = async () => {
  const res =
    await QuestionListCollectControllerService.listQuestionListCollectByPageUserUsingPost(
      collectQuestionListSearchParams.value as any
    );
  if (res.code === 0) {
    collectQuestionList.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const questionList =
          await QuestionListControllerService.getQuestionListByIdUsingPost(
            x.questionListId
          );
        return questionList.data;
      })
    )) as [];
    collectQuestionListTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 获取某个收藏题单的题目
 */
const getCollectQuestionsByCollectQuestionListId = async (id: number) => {
  const res =
    await QuestionCollectControllerService.listQuestionCollectByPageUserUsingPost(
      { ...collectQuestionsSearchParams.value, questionListId: id }
    );
  if (res.code === 0) {
    collectQuestions.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const questionVO =
          await QuestionControllerService.getQuestionVoByIdUsingGet(
            x.questionId
          );
        return { ...questionVO.data, questionListId: id };
      })
    )) as [];
    collectQuestionsTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 获取题解
 */
const getQuestionSolutionList = async () => {
  const res =
    await QuestionSolutionControllerService.listQuestionSolutionByPageUserUsingPost(
      questionSolutionListSearchParams.value as any
    );
  if (res.code == 0) {
    questionSolutionList.value = res.data.records;
    questionSolutionListTotal.value = res.data.total;
  } else {
    message.error(res.message);
  }
};

/**
 * 获取收藏的题解
 */
const getCollectQuestionSolutionList = async () => {
  const res =
    await QuestionSolutionCollectControllerService.listQuestionSolutionCollectByPageUserUsingPost(
      collectQuestionSolutionListSearchParams.value as any
    );
  if (res.code === 0) {
    collectQuestionSolutionList.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const questionSolution =
          await QuestionSolutionControllerService.getQuestionSolutionByIdUsingGet(
            x.solutionId
          );
        return questionSolution.data;
      })
    )) as [];
    collectQuestionSolutionListTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
  }
};

onMounted(async () => {
  await getIsFollow();
  await getUser();
  await getAcceptedQuestionDetail();
  await getAcceptedQuestionRanking();
  await getSubmitDetail();
  await getQuestionList();
  await getQuestionSolutionList();
  await getCollectQuestionSolutionList();
});

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  getQuestionList();
});
watchEffect(() => {
  getQuestionsByQuestionListId(questionListId.value);
});
watchEffect(async () => {
  await getCollectQuestionList();
});

/**
 * 回到首页
 * @param question
 */
const toIndex = () => {
  router.push({
    path: `/`,
  });
};

/**
 * 点击题解进行跳转
 * @param questionSolutionId
 */
const goToSolution = (questionId: number, questionSolutionId: number) => {
  router.push({
    path: `/view/question/${questionId}/solution/${questionSolutionId}`,
  });
};

/**
 * 点击头像进行跳转
 * @param userId
 */
const goToUser = (userId: number) => {
  if (userId == loginUser.id) {
    router.push({
      path: `/mine`,
    });
  } else {
    router.push({
      path: `/Ta/${userId}`,
    });
  }
};
</script>

<style scoped>
#userView {
  position: relative;
  margin-left: 0;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}

#userAcceptedQuestionDetail {
  position: relative;
  margin-left: 0;
  margin-top: 10px;
  height: 85px;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}

#userSubmitDetail {
  position: relative;
  margin-left: 0;
  margin-top: 10px;
  height: 200px;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}

#other {
  position: absolute;
  left: 868px;
  top: 127px;
  height: 821px;
  padding: 10px;
  width: 580px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}
</style>