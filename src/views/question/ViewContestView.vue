<template>
  <div id="viewQuestionView">
    <a-resize-box :directions="['right']" v-model:width="resizeBoxWidth">
      <!--左栏-->
      <div id="leftPart">
        <a-card style="height: 695px">
          <a-scrollbar style="height: calc(100vh - 110px); overflow: auto">
            <a-tabs
              v-model:active-key="activeKey"
              size="mini"
              @tab-click="tabClick"
            >
              <!--第一题-->
              <a-tab-pane key="first" title="第一题">
                <a-card v-if="question" :title="question.title">
                  <a-space direction="vertical" size="large" fill>
                    <a-descriptions
                      title="判题条件"
                      :column="{ xs: 1, md: 2, lg: 3 }"
                    >
                      <a-descriptions-item label="时间限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="内存限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="堆栈限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-space>
                  <MDViewer :value="question.content || ''" />
                </a-card>
              </a-tab-pane>
              <!--第二题-->
              <a-tab-pane key="two" title="第二题">
                <a-card v-if="question" :title="question.title">
                  <a-space direction="vertical" size="large" fill>
                    <a-descriptions
                      title="判题条件"
                      :column="{ xs: 1, md: 2, lg: 3 }"
                    >
                      <a-descriptions-item label="时间限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="内存限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="堆栈限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-space>
                  <MDViewer :value="question.content || ''" />
                </a-card>
              </a-tab-pane>
              <!--第三题-->
              <a-tab-pane key="three" title="第三题">
                <a-card v-if="question" :title="question.title">
                  <a-space direction="vertical" size="large" fill>
                    <a-descriptions
                      title="判题条件"
                      :column="{ xs: 1, md: 2, lg: 3 }"
                    >
                      <a-descriptions-item label="时间限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="内存限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="堆栈限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-space>
                  <MDViewer :value="question.content || ''" />
                </a-card>
              </a-tab-pane>
              <!--第四题-->
              <a-tab-pane key="four" title="第四题">
                <a-card v-if="question" :title="question.title">
                  <a-space direction="vertical" size="large" fill>
                    <a-descriptions
                      title="判题条件"
                      :column="{ xs: 1, md: 2, lg: 3 }"
                    >
                      <a-descriptions-item label="时间限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="内存限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="堆栈限制">
                        {{ question.judgeConfig.timeLimit }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-space>
                  <MDViewer :value="question.content || ''" />
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-scrollbar>
        </a-card>
      </div>
    </a-resize-box>
    <!--右栏-->
    <div id="rightPart" :style="{ width: codeWidth + 'px' }">
      <a-card>
        <a-form :model="form" layout="inline" size="mini">
          <!--语言选择-->
          <a-form-item field="language" style="min-width: 240px">
            <a-space>
              <a-select
                v-model="form.language"
                :style="{ width: '150px' }"
                placeholder="请选择语言"
              >
                <a-option v-for="language in languages" :key="language"
                  >{{ language }}
                </a-option>
              </a-select>
              <!--控制台-->
              <a-button
                :disabled="moment().isAfter(moment(contest.endTime))"
                @click="handleConsoleClick"
                style="width: 66px; height: 28px; border-radius: 5px"
              >
                控制台
              </a-button>
              <!--提交按钮-->
              <a-button
                :disabled="moment().isAfter(moment(contest.endTime))"
                type="primary"
                status="success"
                style="width: 66px; height: 28px; border-radius: 5px"
                @click="doQuestionSubmit"
              >
                提交
              </a-button>
              <!--状态-->
              <a-tooltip content="竞赛结束后可查看">
                <a-button
                  :disabled="moment().isBefore(moment(contest.endTime))"
                  @click="handleRankClick"
                  style="width: 66px; height: 28px; border-radius: 5px"
                >
                  排名
                </a-button>
              </a-tooltip>
            </a-space>
          </a-form-item>
        </a-form>
        <!--代码编辑器-->
        <CodeEditor
          :value="form.code as string"
          :language="form.language as string"
          :hanndle-change="onCodeChange"
        />
      </a-card>
    </div>
    <!--控制台-->
    <a-drawer
      :height="500"
      :visible="consoleVisible"
      :placement="'bottom'"
      :hide-cancel="true"
      :ok-text="'运行'"
      :ok-loading="runLoading"
      @ok="handleRunClick"
      @cancel="handleConsoleClose"
      esc-to-close
    >
      <template #title> 自测运行</template>

      <a-space>
        <!--自定义输入-->
        <a-card>
          自定义输入：
          <a-divider />
          <a-textarea
            @input="
              (value :any) => {
                runCodeRequest.input = value;
              }
            "
            style="
              height: 250px;
              width: 690px;
              background-color: rgba(91, 91, 91, 0);
              border: white;
            "
          ></a-textarea>
        </a-card>
        <!--运行结果 -->
        <a-card>
          运行结果：
          <a-divider />
          <a-textarea
            v-model="runCodeResponse.output"
            style="
              height: 250px;
              width: 690px;
              background-color: rgba(91, 91, 91, 0);
              border: white;
            "
          ></a-textarea>
        </a-card>
      </a-space>
    </a-drawer>
    <!-- 排名 -->
    <a-drawer
      :width="1488"
      :visible="rankVisible"
      :placement="'right'"
      :hide-cancel="true"
      :ok-text="'关闭'"
      @ok="handleRankClose"
      @cancel="handleRankClose"
      esc-to-close
    >
      <template #title> 排名状态</template>
      <a-table
        :row-key="'id'"
        :stripe="true"
        :column-resizable="'yes'"
        :columns="contestRankColumns"
        :data="contestRankList"
        :pagination="{
          showTotal: true,
          pageSize: contestRankListSearchParams.pageSize,
          current: contestRankListSearchParams.current,
          total: contestRankListTotal,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onContestRankListPageChange"
        @pageSizeChange="onContestRankListPageSizeChange"
      >
        <template #rank="{ record }">
          {{ record.rank }}
        </template>
        <template #userName="{ record }">
          <a-space>
            <a-avatar
              :size="32"
              shape="circle"
              @click="goToUser(record.userVO.id)"
            >
              <img alt="userAvatar" :src="record.userVO.userAvatar" />
            </a-avatar>
            <a-typography-text>
              {{ record.userVO.userName }}
            </a-typography-text>
          </a-space>
        </template>

        <template #score="{ record }">
          {{ record.score }}
        </template>

        <template #completeTime="{ record }">
          {{ record.time.key }}
        </template>

        <template #firstQuestion="{ record }">
          <a-button
            type="text"
            @click="openCodeModal(record.submitDetail['1'].code)"
          >
            {{
              record.submitDetail["1"].acceptedTime != null
                ? record.submitDetail["1"].acceptedTime
                : ""
            }}
          </a-button>
        </template>

        <template #secondQuestion="{ record }">
          {{
            record.submitDetail["2"]?.acceptedTime != null
              ? record.submitDetail["2"]?.acceptedTime
              : ""
          }}
        </template>

        <template #thirdQuestion="{ record }">
          {{
            record.submitDetail["3"]?.acceptedTime != null
              ? record.submitDetail["3"]?.acceptedTime
              : ""
          }}
        </template>

        <template #fourthQuestion="{ record }">
          {{
            record.submitDetail["4"]?.acceptedTime != null
              ? record.submitDetail["4"]?.acceptedTime
              : ""
          }}
        </template>
      </a-table>
    </a-drawer>
    <a-modal
      :title="'代码'"
      :title-align="'start'"
      width="50%"
      :visible="codeVisible"
      placement="right"
      @cancel="closeCodeModal"
      unmountOnClose
      :footer="false"
      :closable="false"
    >
      <Codemirror
        v-model="code"
        :style="{ height: '599px' }"
        :autofocus="false"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        disabled
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MDViewer from "@/components/MDViewer.vue";
import { oneDark } from "@codemirror/theme-one-dark";
import { cpp } from "@codemirror/lang-cpp";
import java from "@codemirror/lang-java";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  ContestControllerService,
  ContestQuestionSubmit,
  ContestResultControllerService,
  QuestionControllerService,
  QuestionVO,
} from "../../../generated";
import moment from "moment/moment";
import { Codemirror } from "vue-codemirror";

const router = useRouter();
const route = useRoute();

// 获取登录用户
const store = useStore();
let loginUser = store.state.user.loginUser;

// 获取竞赛id
interface Props {
  contestId: string;
}

const props = withDefaults(defineProps<Props>(), {
  contestId: () => "",
});

// Tab栏默认tab
const activeKey = ref("first");

/**
 * 伸缩相关
 */
const resizeBoxWidth = ref(755);
const codeWidth = ref(0);

watchEffect(() => {
  codeWidth.value = window.innerWidth - resizeBoxWidth.value;
});
window.addEventListener("resize", () => {
  // 窗口大小改变时,手动触发更新
  codeWidth.value = window.innerWidth - resizeBoxWidth.value;
});

// 自测运行代码是否正在运行
const runLoading = ref(false);
// 控制台是否可见
const consoleVisible = ref(false);
// 排名是否可见
const rankVisible = ref(false);
// CodeMirror的一些配置
const extensions = [cpp(), oneDark];
// 自测运行代码的请求负载
const runCodeRequest = ref({ input: "" });
// 自测运行代码的请求响应
const runCodeResponse = ref({ output: "", message: "" });

// 竞赛
const contest = ref({
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

// 题目
const question = ref<QuestionVO>({
  acceptedNum: 0,
  answer: "",
  comments: 0,
  content: "",
  createTime: "",
  difficulty: 0,
  id: 0,
  isAccepted: 1,
  judgeConfig: {},
  likes: 0,
  submitNum: 0,
  tags: [],
  title: "",
  updateTime: "",
  userId: 0,
  userVO: {},
});
const questionId = ref(0);
const order = ref(1);

// 提交代码时的请求负载
const form = ref<ContestQuestionSubmit>({
  language: "java",
  code: "",
  questionId: -1,
});

// 支持语言
const languages = ref<string[]>();

// 排名分页
const contestRankList = ref([]);
const contestRankListTotal = ref(0);
const contestRankListSearchParams = ref({
  pageSize: 10,
  current: 1,
  contestId: props.contestId,
});
const contestRankColumns = [
  {
    title: "排名",
    slotName: "rank",
    align: "center",
    width: 64,
  },
  {
    title: "用户名",
    slotName: "userName",
    align: "center",
    width: 96,
  },
  {
    title: "得分",
    slotName: "score",
    align: "center",
    width: 64,
  },
  {
    title: "完成时间",
    slotName: "completeTime",
    align: "center",
    width: 128,
  },
  {
    title: "题目1",
    slotName: "firstQuestion",
    align: "center",
    width: 96,
  },
  {
    title: "题目2",
    slotName: "secondQuestion",
    align: "center",
    width: 96,
  },
  {
    title: "题目3",
    slotName: "thirdQuestion",
    align: "center",
    width: 96,
  },
  {
    title: "题目4",
    slotName: "fourthQuestion",
    align: "center",
    width: 96,
  },
];

// 某人某题提交的代码
const code = ref("");
// 弹窗
const codeVisible = ref(false);
// 打开弹窗
const openCodeModal = async (submitCode: string) => {
  codeVisible.value = true;
  code.value = submitCode;
};
// 关闭弹窗
const closeCodeModal = async (code: string) => {
  codeVisible.value = false;
};

/**
 * 监听函数所使用的变量的变化，改变时触发页面的重新加载
 */
watchEffect(async () => {
  await getQuestionByQuestionId(questionId.value);
});

onMounted(async () => {
  await getContestById();
  await getQuestionByQuestionId(contest.value.questions["1"].questionId);
  questionId.value = contest.value.questions["1"].questionId;
  await getLanguage();
});

/**
 * 改变页码
 * @param page
 */
const onContestRankListPageChange = async (page: number) => {
  contestRankListSearchParams.value = {
    ...contestRankListSearchParams.value,
    current: page,
  };
  await getContestRankList();
};
/**
 * 改变分页大小
 * @param size
 */
const onContestRankListPageSizeChange = async (size: number) => {
  contestRankListSearchParams.value = {
    ...contestRankListSearchParams.value,
    pageSize: size,
  };
  await getContestRankList();
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

/**
 * 获取竞赛
 */
const getContestById = async () => {
  console.log(props.contestId);
  const res = await ContestControllerService.getContestByIdUsingGet(
    props.contestId
  );
  if (res.code == 0) {
    document.title = res.data?.title;
    contest.value.id = res.data?.id;
    contest.value.award = res.data?.award;
    contest.value.duration = res.data?.duration;
    contest.value.endTime = moment(res.data?.endTime).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    contest.value.startTime = moment(res.data?.startTime).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    contest.value.tips = res.data?.tips;
    contest.value.title = res.data?.title;
    contest.value.questions = JSON.parse(
      res.data?.questions.replace(/:s*([0-9]{15,})s*(,?)/g, ': "$1" $2')
    );
  }
};

/**
 * 获取题目
 */
const getQuestionByQuestionId = async (id: any) => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(id);
  if (res.code === 0) {
    question.value = res.data;
    document.title = res.data?.title as string;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 代码编辑器内容切换
 * @param value
 */
const onCodeChange = (value: string) => {
  form.value.code = value;
};

/**
 * 点击按钮打开控制台
 */
const handleConsoleClick = () => {
  consoleVisible.value = true;
};

/**
 * 关闭控制台
 */
const handleConsoleClose = () => {
  consoleVisible.value = false;
};

/**
 * 点击按钮打开排名状态
 */
const handleRankClick = async () => {
  rankVisible.value = true;
  await getContestRankList();
};

/**
 * 关闭排名状态
 */
const handleRankClose = () => {
  rankVisible.value = false;
};

/**
 * 自测运行代码
 */
const handleRunClick = async () => {
  runLoading.value = true;
  const res = await ContestResultControllerService.contestQuestionRunUsingPost({
    input: runCodeRequest.value.input,
    code: form.value.code,
    language: form.value.language,
  });
  if (res.code === 0) {
    runCodeResponse.value.output = res.data.output
      ? res.data.output
      : res.data.message;
  }
  runLoading.value = false;
};

/**
 * 提交代码
 * @constructor
 */
const doQuestionSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res =
    await ContestResultControllerService.contestQuestionSubmitUsingPost({
      contestId: props.contestId,
      order: order.value,
      questionId: questionId.value,
      code: form.value.code,
      language: form.value.language,
    });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败，" + res.message);
  }
};

const getContestRankList = async () => {
  const res =
    await ContestResultControllerService.contestRankStatisticsUsingPost(
      contestRankListSearchParams.value
    );
  if (res.code == 0) {
    contestRankList.value = res.data.records;
    contestRankListTotal.value = res.data.total;
  } else {
    message.error(res.message);
  }
};

/**
 * Tab栏点击事件
 * @param key
 */
const tabClick = async (key: string) => {
  if (key == "first") {
    await getQuestionByQuestionId(contest.value.questions["1"].questionId);
    order.value = 1;
    questionId.value = contest.value.questions["1"].questionId;
  } else if (key == "two") {
    await getQuestionByQuestionId(contest.value.questions["2"].questionId);
    order.value = 2;
    questionId.value = contest.value.questions["2"].questionId;
  } else if (key == "three") {
    await getQuestionByQuestionId(contest.value.questions["3"].questionId);
    order.value = 3;
    questionId.value = contest.value.questions["3"].questionId;
  } else if (key == "four") {
    await getQuestionByQuestionId(contest.value.questions["4"].questionId);
    order.value = 4;
    questionId.value = contest.value.questions["4"].questionId;
  }
};

/**
 * 点击头像进行跳转
 * @param userId
 */
const goToUser = (userId: number) => {
  if (userId == loginUser.id) {
    router.push({
      path: `/_userInfo`,
    });
  } else {
    router.push({
      path: `/_userInfo/${userId}`,
    });
  }
};
</script>

<style>
#viewQuestionView {
  margin: 0 auto;
  width: 100%;
  display: flex;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

#leftPart {
  flex: 1;
}

#rightPart {
  min-width: 385px;
}
</style>