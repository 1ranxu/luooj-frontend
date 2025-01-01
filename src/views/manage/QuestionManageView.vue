<template>
  <div id="QuestionManageView">
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
      <a-form-item>
        <a-button
          type="outline"
          shape="round"
          status="normal"
          @click="openAddQuestionModal"
          >创建
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

      <template #difficulty="{ record }">
        <div v-if="record.difficulty == 0">简单</div>
        <div v-else-if="record.difficulty == 1">中等</div>
        <div v-else>困难</div>
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
          <a-button
            type="outline"
            shape="round"
            @click="openUpdateQuestionModal(record)"
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
    <!-- 修改题目 -->
    <a-modal
      width="60%"
      :visible="updateQuestionVisible"
      placement="right"
      @ok="handleUpdateQuestion"
      @cancel="closeUpdateQuestionModal"
      unmountOnClose
    >
      <a-card style="max-width: 840px; margin: auto">
        <template #title>
          <h2>修改题目</h2>
        </template>
        <a-form :model="updateQuestion" label-align="left">
          <a-form-item field="title" label="题目标题" tooltip="请输入标题">
            <a-input
              v-model="updateQuestion.title"
              placeholder="请输入题目标题"
            />
          </a-form-item>
          <a-form-item field="difficulty" label="题目难度" tooltip="请选择难度">
            <a-select
              v-model="updateQuestion.difficulty"
              placeholder="请选择难度"
            >
              <a-option :value="0" :disabled="updateQuestion.difficulty == 0"
                >简单
              </a-option>
              <a-option :value="1" :disabled="updateQuestion.difficulty == 1"
                >中等
              </a-option>
              <a-option :value="2" :disabled="updateQuestion.difficulty == 2"
                >困难
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="tags" label="标签" tooltip="请输入标签">
            <a-input-tag
              v-model="updateQuestion.tags"
              placeholder="请输入标签"
              allow-clear
            />
          </a-form-item>

          <a-form-item field="content" tooltip="请输入内容" label="题目内容">
            <MDEditor
              :value="updateQuestion.content"
              :hanndle-change="updateQuestionOnContentChange"
            />
          </a-form-item>

          <a-form-item field="answer" tooltip="请输入答案" label="题目答案">
            <MDEditor
              :value="updateQuestion.answer"
              :hanndle-change="updateQuestionOnAnswerChange"
            />
          </a-form-item>
          <a-form-item
            tooltip="请设置配置"
            label="判题配置"
            :content-flex="false"
            :merge-props="false"
          >
            <a-space direction="vertical" style="min-width: 480px">
              <a-form-item field="judgeConfig.timeLimit" label="时间限制">
                <a-input-number
                  v-model="updateQuestion.judgeConfig.timeLimit"
                  placeholder="请输入时间限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                ms
              </a-form-item>
              <a-form-item field="judgeConfig.timeLimit" label="内存限制">
                <a-input-number
                  v-model="updateQuestion.judgeConfig.memoryLimit"
                  placeholder="请输入内存限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                KB
              </a-form-item>
              <a-form-item field="judgeConfig.timeLimit" label="堆栈限制">
                <a-input-number
                  v-model="updateQuestion.judgeConfig.stackLimit"
                  placeholder="请输入堆栈限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                KB
              </a-form-item>
            </a-space>
          </a-form-item>
          <a-form-item
            tooltip="请设置用例"
            label="判题用例"
            :content-flex="false"
            :merge-props="false"
          >
            <a-form-item
              v-for="(judgeCase, index) of updateQuestion.judgeCaseList"
              :key="index"
              no-style
            >
              <a-space direction="vertical" style="min-width: 480px">
                <a-form-item
                  :field="`form.judgeCaseList[${index}].input`"
                  :label="`输入用例-${index}`"
                  :key="index"
                >
                  <a-textarea
                    v-model="judgeCase.input"
                    placeholder="输入用例"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  :field="`form.judgeCaseList[${index}].output`"
                  :label="`输出用例-${index}`"
                  :key="index"
                >
                  <a-textarea
                    v-model="judgeCase.output"
                    placeholder="输出用例"
                    allow-clear
                  />
                </a-form-item>

                <a-button
                  @click="updateQuestionOnHandleDelete(index)"
                  status="danger"
                  >删除
                </a-button>
              </a-space>
            </a-form-item>
            <div style="margin-top: 32px">
              <a-button
                @click="updateQuestionOnHandleAdd"
                type="outline"
                status="success"
                >新增测试用例
              </a-button>
            </div>
          </a-form-item>
          <div style="margin-top: 16px"></div>
        </a-form>
      </a-card>
    </a-modal>
    <!-- 创建题目 -->
    <a-modal
      width="60%"
      :visible="addQuestionVisible"
      placement="right"
      @ok="handleAddQuestion"
      @cancel="closeAddQuestionModal"
      unmountOnClose
    >
      <a-card style="max-width: 840px; margin: auto">
        <template #title>
          <h2>创建题目</h2>
        </template>
        <a-form :model="addQuestion" label-align="left">
          <a-form-item field="title" label="题目标题" tooltip="请输入标题">
            <a-input v-model="addQuestion.title" placeholder="请输入题目标题" />
          </a-form-item>
          <a-form-item field="difficulty" label="题目难度" tooltip="请选择难度">
            <a-select
              v-model="addQuestion.difficulty"
              placeholder="请选择难度"
            >
              <a-option :value="0" :disabled="addQuestion.difficulty == 0"
                >简单
              </a-option>
              <a-option :value="1" :disabled="addQuestion.difficulty == 1"
                >中等
              </a-option>
              <a-option :value="2" :disabled="addQuestion.difficulty == 2"
                >困难
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="tags" label="标签" tooltip="请输入标签">
            <a-input-tag
              v-model="addQuestion.tags"
              placeholder="请输入标签"
              allow-clear
            />
          </a-form-item>

          <a-form-item field="content" tooltip="请输入内容" label="题目内容">
            <MDEditor
              :value="addQuestion.content"
              :hanndle-change="addQuestionOnContentChange"
            />
          </a-form-item>

          <a-form-item field="answer" tooltip="请输入答案" label="题目答案">
            <MDEditor
              :value="addQuestion.answer"
              :hanndle-change="addQuestionOnAnswerChange"
            />
          </a-form-item>
          <a-form-item
            tooltip="请设置配置"
            label="判题配置"
            :content-flex="false"
            :merge-props="false"
          >
            <a-space direction="vertical" style="min-width: 480px">
              <a-form-item field="judgeConfig.timeLimit" label="时间限制">
                <a-input-number
                  v-model="addQuestion.judgeConfig.timeLimit"
                  placeholder="请输入时间限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                ms
              </a-form-item>
              <a-form-item field="judgeConfig.timeLimit" label="内存限制">
                <a-input-number
                  v-model="addQuestion.judgeConfig.memoryLimit"
                  placeholder="请输入内存限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                KB
              </a-form-item>
              <a-form-item field="judgeConfig.timeLimit" label="堆栈限制">
                <a-input-number
                  v-model="addQuestion.judgeConfig.stackLimit"
                  placeholder="请输入堆栈限制"
                  mode="button"
                  min="0"
                  size="large"
                />
                KB
              </a-form-item>
            </a-space>
          </a-form-item>
          <a-form-item
            tooltip="请设置用例"
            label="判题用例"
            :content-flex="false"
            :merge-props="false"
          >
            <a-form-item
              v-for="(judgeCase, index) of addQuestion.judgeCaseList"
              :key="index"
              no-style
            >
              <a-space direction="vertical" style="min-width: 480px">
                <a-form-item
                  :field="`form.judgeCaseList[${index}].input`"
                  :label="`输入用例-${index}`"
                  :key="index"
                >
                  <a-textarea
                    v-model="judgeCase.input"
                    placeholder="输入用例"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  :field="`form.judgeCaseList[${index}].output`"
                  :label="`输出用例-${index}`"
                  :key="index"
                >
                  <a-textarea
                    v-model="judgeCase.output"
                    placeholder="输出用例"
                    allow-clear
                  />
                </a-form-item>

                <a-button
                  @click="addQuestionOnHandleDelete(index)"
                  status="danger"
                  >删除
                </a-button>
              </a-space>
            </a-form-item>
            <div style="margin-top: 32px">
              <a-button
                @click="addQuestionOnHandleAdd"
                type="outline"
                status="success"
                >新增测试用例
              </a-button>
            </div>
          </a-form-item>
          <div style="margin-top: 16px"></div>
        </a-form>
      </a-card>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { Question } from "../../../generated/models/Question";
import { QuestionAddRequest, QuestionUpdateRequest } from "../../../generated";
import MDEditor from "@/components/MDEditor.vue";

document.title = "题目管理";

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

// 修改题目对象
const updateQuestion = ref({
  id: undefined,
  answer: "",
  content: "",
  difficulty: undefined,
  judgeCaseList: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  tags: [],
  title: "",
} as QuestionUpdateRequest);

// 创建竞赛对象
const addQuestion = ref({
  answer: "",
  content: "",
  difficulty: undefined,
  judgeCaseList: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  tags: [],
  title: "",
} as QuestionAddRequest);

// 弹窗是否可见
const updateQuestionVisible = ref(false);
const addQuestionVisible = ref(false);
// 打开弹窗
const openUpdateQuestionModal = (record: Question) => {
  updateQuestionVisible.value = true;
  updateQuestion.value.id = record.id;
  updateQuestion.value.answer = record.answer;
  updateQuestion.value.content = record.content;
  updateQuestion.value.difficulty = record.difficulty;
  updateQuestion.value.title = record.title;
  updateQuestion.value.tags = JSON.parse((record.tags as string) ?? "[]");
  updateQuestion.value.judgeCaseList = JSON.parse(
    (record.judgeCase as string) ?? "[]"
  );
  updateQuestion.value.judgeConfig = JSON.parse(
    (record.judgeConfig as string) ?? "{}"
  );
};
const openAddQuestionModal = () => {
  addQuestionVisible.value = true;
};
// 关闭弹窗
const closeUpdateQuestionModal = () => {
  updateQuestionVisible.value = false;
};
const closeAddQuestionModal = () => {
  addQuestionVisible.value = false;
};

/**
 * 修改题目新增判题用例
 */
const updateQuestionOnHandleAdd = () => {
  if (updateQuestion.value.judgeCaseList) {
    updateQuestion.value.judgeCaseList.push({
      input: "",
      output: "",
    });
  }
};

/**
 * 修改题目删除判题用例
 * @param index
 */
const updateQuestionOnHandleDelete = (index: number) => {
  if (updateQuestion.value.judgeCaseList) {
    updateQuestion.value.judgeCaseList.splice(index, 1);
  }
};

/**
 * 修改题目新增判题用例
 */
const addQuestionOnHandleAdd = () => {
  if (addQuestion.value.judgeCaseList) {
    addQuestion.value.judgeCaseList.push({
      input: "",
      output: "",
    });
  }
};

/**
 * 创建题目删除判题用例
 * @param index
 */
const addQuestionOnHandleDelete = (index: number) => {
  if (addQuestion.value.judgeCaseList) {
    addQuestion.value.judgeCaseList.splice(index, 1);
  }
};

/**
 * 修改题目答案改变函数
 * @param value
 */
const updateQuestionOnAnswerChange = (value: string) => {
  updateQuestion.value.answer = value;
};

/**
 * 修改题目内容改变函数
 * @param value
 */
const updateQuestionOnContentChange = (value: string) => {
  updateQuestion.value.content = value;
};

/**
 * 创建题目答案改变函数
 * @param value
 */
const addQuestionOnAnswerChange = (value: string) => {
  addQuestion.value.answer = value;
};

/**
 * 创建题目内容改变函数
 * @param value
 */
const addQuestionOnContentChange = (value: string) => {
  addQuestion.value.content = value;
};

/**
 * 更新题目
 */
const handleUpdateQuestion = async () => {
  const res = await QuestionControllerService.updateQuestionUsingPost(
    updateQuestion.value
  );
  if (res.code === 0) {
    message.success("更新成功");
    updateQuestionVisible.value = false;
    // 更新数据
    loadData();
  } else {
    message.error("更新失败，" + res.message);
  }
};

/**
 * 创建题目
 */
const handleAddQuestion = async () => {
  const res = await QuestionControllerService.addQuestionUsingPost(
    addQuestion.value
  );
  if (res.code === 0) {
    message.success("创建成功");
    addQuestionVisible.value = false;
    // 更新数据
    loadData();
  } else {
    message.error("创建失败，" + res.message);
  }
};

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
  {
    title: "难度",
    slotName: "difficulty",
    align: "center",
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
#QuestionManageView {
}
</style>