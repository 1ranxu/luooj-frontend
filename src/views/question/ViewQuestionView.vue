<template>
  <div id="viewQuestionView">
    <a-resize-box :directions="['right']" v-model:width="resizeBoxWidth">
      <!--左栏-->
      <div id="leftPart">
        <a-card style="height: 695px">
          <a-scrollbar style="height: calc(100vh - 110px); overflow: auto">
            <a-tabs default-active-key="question" size="mini">
              <!--题目详情-->
              <a-tab-pane key="question" title="题目详情">
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

                  <template #extra>
                    <a-space wrap>
                      <!-- 收藏 -->
                      <icon-star-fill
                        style="font-size: 23px; color: rgb(247, 186, 30)"
                        v-if="isCollect"
                        @click="openQuestionListModal"
                      />
                      <icon-star-fill
                        style="font-size: 23px; color: rgb(229, 230, 235)"
                        v-else
                        @click="openQuestionListModal"
                      />
                      <!-- 点赞 -->
                      <a-rate :count="1" :allow-clear="true" color="red">
                        <template #character>
                          <icon-heart-fill />
                        </template>
                      </a-rate>
                      <a-tag
                        v-for="(tag, index) of question.tags"
                        :key="index"
                        color="green"
                        >{{ tag }}
                      </a-tag>
                    </a-space>
                  </template>
                </a-card>
              </a-tab-pane>
              <!--评论区-->
              <a-tab-pane key="comment" title="评论" disabled>
                评论区
              </a-tab-pane>
              <!--题解-->
              <a-tab-pane key="answers" title="题解">
                <a-card v-if="question">
                  <MDViewer :value="question.answer || ''" />
                </a-card>
              </a-tab-pane>
              <!--提交记录-->
              <a-tab-pane key="history" title="提交记录">
                <a-table
                  :columns="columns"
                  :data="dataList"
                  :pagination="{
                    showTotal: true,
                    current: questionSubmitSearchParams.current,
                    pageSize: questionSubmitSearchParams.pageSize,
                    total,
                    showPageSize: true,
                  }"
                  @page-change="onQuestionSubmitPageChange"
                  @pageSizeChange="onQuestionSubmitPageSizeChange"
                  @row-click="handleHistoryRecordClick"
                >
                  <template #message="{ record }">
                    <a-tag
                      v-if="
                        record.judgeInfo.message ===
                        JudgeInfoMessageEnum.ACCEPTED
                      "
                      color="blue"
                      bordered
                    >
                      {{ record.judgeInfo.message }}
                    </a-tag>
                    <a-tag
                      v-else-if="
                        record.judgeInfo.message ===
                        JudgeInfoMessageEnum.WAITING
                      "
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
                    {{ record.judgeInfo.memory ? record.judgeInfo.memory : 0 }}
                    K
                  </template>

                  <template #time="{ record }">
                    {{ record.judgeInfo.time ? record.judgeInfo.time : 0 }}
                    ms
                  </template>

                  <template #createTime="{ record }">
                    {{
                      moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")
                    }}
                  </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-scrollbar>
        </a-card>
      </div>
    </a-resize-box>
    <!--  题单  -->
    <a-modal
      width="50%"
      :visible="questionListVisible"
      placement="right"
      @cancel="closeQuestionListModal"
      :footer="false"
      unmountOnClose
      :closable="false"
    >
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
            style="
              position: absolute;
              top: 0;
              left: 50px;
              justify-content: center;
              align-content: center;
            "
          >
            <a-form-item field="title" label="标题：" tooltip="请输入题单标题">
              <a-input
                v-model="questionListSearchParams.title"
                placeholder="请输入题单标题"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                type="outline"
                shape="round"
                status="normal"
                @click="getQuestionCollectByUserAllQuestionListDetail"
                >搜 索
              </a-button>
            </a-form-item>
          </a-form>
        </template>
        <template #item="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.title">
              <template #avatar>
                <a-tooltip
                  v-if="item.isCollect"
                  content="取消收藏"
                  @click="unCollectQuestion(item.id)"
                >
                  <icon-check-circle-fill
                    :style="{ fontSize: '32px', color: 'black' }"
                    :stroke-width="2"
                  />
                </a-tooltip>
                <a-tooltip
                  v-if="!item.isCollect"
                  content="收藏"
                  @click="collectQuestion(item.id)"
                >
                  <icon-check-circle-fill
                    :style="{ fontSize: '32px', color: 'gray' }"
                    :stroke-width="2"
                  />
                </a-tooltip>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
    <!--右栏-->
    <div
      id="rightPart"
      v-if="!historyVisible"
      :style="{ width: codeWidth + 'px' }"
    >
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
                @click="handleConsoleClick"
                style="width: 66px; height: 28px; border-radius: 5px"
              >
                控制台
              </a-button>
              <!--提交按钮-->
              <a-button
                type="primary"
                status="success"
                style="width: 66px; height: 28px; border-radius: 5px"
                @click="doQuestionSubmit"
              >
                提交
              </a-button>
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
    <!--提交记录详情-->
    <div id="history" v-if="historyVisible" :style="{ width: codeWidth }">
      <a-card>
        <!--关闭按钮-->
        <a-button
          type="text"
          @click="
            () => {
              historyVisible = false;
            }
          "
        >
          <template #icon>
            <icon-close />
          </template>
        </a-button>
        <!--提交记录的一些信息-->
        <a-space direction="vertical" size="large" fill>
          <a-descriptions :column="{ xs: 1, md: 2, lg: 3 }">
            <a-descriptions-item label="语言">
              <a-tag color="arcoblue">
                {{ historyRecord.language }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="执行时间">
              {{
                historyRecord.judgeInfo.time ? historyRecord.judgeInfo.time : 0
              }}
              ms
            </a-descriptions-item>
            <a-descriptions-item label="消耗内存">
              {{
                historyRecord.judgeInfo.memory
                  ? historyRecord.judgeInfo.memory
                  : 0
              }}
              K
            </a-descriptions-item>
          </a-descriptions>
        </a-space>
        <!--展示提交代码-->
        <Codemirror
          v-model="historyRecord.code"
          :style="{ height: '599px' }"
          :autofocus="false"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
          disabled
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MDViewer from "@/components/MDViewer.vue";
import JudgeInfoMessageEnum from "@/enums/JudgeInfoMessageEnum";
import moment from "moment/moment";
import { Codemirror } from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { cpp } from "@codemirror/lang-cpp";
import java from "@codemirror/lang-java";
import { QuestionSubmitControllerService } from "../../../generated/services/QuestionSubmitControllerService";
import { QuestionSubmitQueryRequest } from "../../../generated/models/QuestionSubmitQueryRequest";
import { QuestionVO } from "../../../generated/models/QuestionVO";
import { QuestionSubmitAddRequest } from "../../../generated/models/QuestionSubmitAddRequest";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { QuestionCollectControllerService } from "../../../generated/services/QuestionCollectControllerService";
import { useStore } from "vuex";

// 获取题目id
interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

// 获取登录用户
const store = useStore();
let loginUser = store.state.user.loginUser;

const resizeBoxWidth = ref(755);
const codeWidth = ref(0);

watchEffect(() => {
  codeWidth.value = window.innerWidth - resizeBoxWidth.value;
});
window.addEventListener("resize", () => {
  // 窗口大小改变时,手动触发更新
  codeWidth.value = window.innerWidth - resizeBoxWidth.value;
});

// 提交记录详情页面是否可见
const historyVisible = ref(false);
// 提交记录
const historyRecord = ref({});
// 自测运行代码是否正在运行
const runLoading = ref(false);
// 控制台是否可见
const consoleVisible = ref(false);
// CodeMirror的一些配置
const extensions = [cpp(), oneDark];
// 自测运行代码的请求负载
const runCodeRequest = ref({ input: "" });
// 自测运行代码的请求响应
const runCodeResponse = ref({ output: "", message: "" });

/**
 * 点击按钮打开控制台
 */
const handleConsoleClick = () => {
  consoleVisible.value = true;
};

/**
 * 自测运行代码
 */
const handleRunClick = async () => {
  runLoading.value = true;
  const res = await QuestionSubmitControllerService.questionRunOnlineUsingPost({
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
 * 关闭控制台
 */
const handleConsoleClose = () => {
  consoleVisible.value = false;
};

/**
 * 点击单条提交记录时的处理
 * @param value
 */
const handleHistoryRecordClick = (value: any) => {
  historyVisible.value = true;
  historyRecord.value = value;
};

// 查询个人提交记录的参数
const questionSubmitSearchParams = ref<QuestionSubmitQueryRequest>({
  language: undefined,
  questionId: undefined,
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});
// 个人提交记录总数
const total = ref(0);
// 个人提交记录
const dataList = ref([]);
// 个人提交记录需要展示的列
const columns = [
  {
    title: "判题结果",
    slotName: "message",
    align: "center",
    width: 100,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "编程语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "执行用时",
    slotName: "time",
    align: "center",
    width: 100,
  },
  {
    title: "消耗内存",
    slotName: "memory",
    align: "center",
    width: 100,
  },
];
// 题目
const question = ref<QuestionVO>();

// 提交代码时的请求负载
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
  questionId: -1,
});

// 支持语言
const languages = ref<string[]>();

// 题单
const questionList = ref([]);
const questionListTotal = ref(0);
const questionListSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  title: "",
  userId: loginUser.id,
});
const isCollect = ref(false);

// 弹窗
const questionListVisible = ref(false);
// 打开弹窗
const openQuestionListModal = () => {
  questionListVisible.value = true;
};
// 关闭弹窗
const closeQuestionListModal = () => {
  questionListVisible.value = false;
};

/**
 * 获取题目
 */
const loadData1 = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    document.title = res.data?.title;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 获取个人提交记录
 */
const loadData2 = async () => {
  const res =
    await QuestionSubmitControllerService.listMyQuestionSubmitByPageUsingPost({
      ...questionSubmitSearchParams.value,
      questionId: props.id as any,
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
watchEffect(async () => {
  await loadData2();
});

onMounted(async () => {
  await loadData1();
  await loadData2();
  await getLanguage();
  await getQuestionCollectByUserAllQuestionListDetail();
});

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
 * 提交代码
 * @constructor
 */
const doQuestionSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败，" + res.message);
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
 * 页面切换
 * @param page
 */
const onQuestionSubmitPageChange = (page: number) => {
  questionSubmitSearchParams.value = {
    ...questionSubmitSearchParams.value,
    current: page,
  };
};
const onQuestionListPageChange = (page: number) => {
  questionListSearchParams.value = {
    ...questionListSearchParams.value,
    current: page,
  };
};
/**
 * 页面大小切换
 * @param size
 */
const onQuestionSubmitPageSizeChange = (size: number) => {
  questionSubmitSearchParams.value = {
    ...questionSubmitSearchParams.value,
    pageSize: size,
  };
};
const onQuestionListPageSizeChange = (size: number) => {
  questionListSearchParams.value = {
    ...questionListSearchParams.value,
    pageSize: size,
  };
};

/**
 * 获取用户所有题单对某道题目的收藏情况
 */
const getQuestionCollectByUserAllQuestionListDetail = async () => {
  const res =
    await QuestionCollectControllerService.isQuestionCollectedByUserAllQuestionListUsingPost(
      props.id as any,
      questionListSearchParams.value
    );
  if (res.code == 0) {
    questionList.value = res.data.questionListVOPage.records;
    questionListTotal.value = res.data.questionListVOPage.total;
    isCollect.value = res.data.isCollect;
    console.log(isCollect.value);
  } else {
    message.error(res.message);
  }
};

/**
 * 收藏题目
 * @param questionListId
 */
const collectQuestion = async (questionListId: number) => {
  const res =
    await QuestionCollectControllerService.addQuestionCollectUsingPost({
      questionId: props.id as any,
      questionListId: questionListId,
    });
  if(res.code==0){
    await getQuestionCollectByUserAllQuestionListDetail();
    message.success("收藏成功");
  }else{
    message.error("收藏失败");
  }
};

/**
 * 取消收藏
 * @param questionListId
 */
const unCollectQuestion = async (questionListId: number) => {
  const res =
    await QuestionCollectControllerService.deleteQuestionCollectUsingPost({
      questionId: props.id as any,
      questionListId: questionListId,
    });
  if(res.code==0){
    await getQuestionCollectByUserAllQuestionListDetail();
    message.success("取消收藏成功");
  }else{
    message.error("取消收藏失败");
  }
};
</script>

<style scoped>
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

#history {
  min-width: 385px;
  flex: 1;
}
</style>