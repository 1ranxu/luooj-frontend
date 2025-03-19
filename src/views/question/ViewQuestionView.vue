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
                        {{ question.judgeConfig.memoryLimit }}
                      </a-descriptions-item>
                      <a-descriptions-item label="堆栈限制">
                        {{ question.judgeConfig.stackLimit }}
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
                      <!-- 点赞 -->
                      <IconHeartFill
                        v-if="question.isLike"
                        style="font-size: 23px; color: red"
                        @click="likeQuestion"
                      />
                      <IconHeart
                        v-else
                        style="font-size: 23px; color: gray"
                        @click="likeQuestion"
                      />
                      {{ question.likes }}
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
              <a-tab-pane key="comment" title="评论">
                <!-- 发表评论 -->
                <a-comment align="right" :avatar="loginUser.userAvatar">
                  <template #actions>
                    <a-button
                      key="1"
                      type="primary"
                      status="success"
                      @click="publisOrReply(props.id, 0, 0)"
                    >
                      评论
                    </a-button>
                  </template>
                  <template #content>
                    <a-input
                      v-model="replyContent"
                      placeholder="Here is you content."
                    />
                  </template>
                </a-comment>
                <!-- 一级评论 -->
                <a-comment
                  v-for="firstComment in comments"
                  :author="firstComment.userName"
                  :content="firstComment.content"
                  :datetime="
                    moment(firstComment.createTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  "
                >
                  <template #avatar>
                    <a-avatar @click="goToUser(firstComment.userId)" :size="32">
                      <img :src="firstComment.userAvatar" />
                    </a-avatar>
                  </template>
                  <template #actions>
                    <!-- 点赞图标 -->
                    <span
                      class="action"
                      key="heart"
                      @click="likeComment(firstComment.id)"
                    >
                      <span v-if="firstComment.isLike">
                        <IconHeartFill :style="{ color: '#f53f3f' }" />
                      </span>
                      <span v-else>
                        <IconHeart />
                      </span>
                      {{ firstComment.likes }}
                    </span>
                    <!-- 回复图标 -->
                    <span
                      class="action"
                      key="reply"
                      @click="toggleReplyBox(firstComment)"
                    >
                      <IconMessage /> Reply
                    </span>
                    <!-- 删除图标 -->
                    <span
                      class="action"
                      key="delete"
                      @click="deleteComment(firstComment.id)"
                      v-if="firstComment.userId == loginUser.id"
                    >
                      <a-tooltip :content="'删除'">
                        <IconDelete />
                      </a-tooltip>
                    </span>
                    <!-- 举报图标 -->
                    <span
                      class="action"
                      key="delete"
                      v-if="firstComment.userId != loginUser.id"
                      @click="
                        reportComment(1, firstComment.id, firstComment.userId)
                      "
                    >
                      <a-tooltip :content="'举报'">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </span>
                  </template>
                  <!-- 一级评论回复框 -->
                  <a-comment
                    align="right"
                    v-if="firstComment.showReplyBox"
                    :avatar="loginUser.userAvatar"
                  >
                    <template #actions>
                      <a-button
                        key="0"
                        type="secondary"
                        @click="toggleReplyBox(firstComment)"
                      >
                        Cancel
                      </a-button>
                      <a-button
                        key="1"
                        type="primary"
                        status="success"
                        @click="publisOrReply(props.id, firstComment.id, 0)"
                      >
                        Reply
                      </a-button>
                    </template>
                    <template #content>
                      <a-input
                        v-model="replyContent"
                        placeholder="Here is you content."
                      />
                    </template>
                  </a-comment>
                  <!-- 二级评论 -->
                  <a-collapse
                    v-if="firstComment.childList.length != 0"
                    :default-active-key="[1]"
                    accordion
                    :bordered="false"
                  >
                    <a-collapse-item
                      :header="firstComment.childList.length + '条回复'"
                      key="1"
                    >
                      <!-- 二级评论 -->
                      <a-comment
                        :author="
                          secondComment.userName +
                          '' +
                          (secondComment.respondUserId == 0
                            ? ''
                            : ' 回复 ' + secondComment.respondUserName)
                        "
                        :content="secondComment.content"
                        :datetime="
                          moment(secondComment.createTime).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )
                        "
                        v-for="secondComment in firstComment.childList"
                      >
                        <template #avatar>
                          <a-avatar
                            @click="goToUser(secondComment.userId)"
                            :size="32"
                          >
                            <img :src="secondComment.userAvatar" />
                          </a-avatar>
                        </template>
                        <template #actions>
                          <!-- 点赞图标 -->
                          <span
                            class="action"
                            key="heart"
                            @click="likeComment(secondComment.id)"
                          >
                            <span v-if="secondComment.isLike">
                              <IconHeartFill :style="{ color: '#f53f3f' }" />
                            </span>
                            <span v-else>
                              <IconHeart />
                            </span>
                            {{ secondComment.likes }}
                          </span>
                          <!-- 回复图标 -->
                          <span
                            class="action"
                            key="reply"
                            @click="toggleReplyBox(secondComment)"
                          >
                            <IconMessage /> Reply
                          </span>
                          <!-- 删除图标 -->
                          <span
                            class="action"
                            key="delete"
                            @click="deleteComment(secondComment.id)"
                            v-if="secondComment.userId == loginUser.id"
                          >
                            <a-tooltip :content="'删除'">
                              <IconDelete />
                            </a-tooltip>
                          </span>
                          <!-- 举报图标 -->
                          <span
                            class="action"
                            key="delete"
                            v-if="secondComment.userId != loginUser.id"
                            @click="
                              reportComment(
                                1,
                                secondComment.id,
                                secondComment.userId
                              )
                            "
                          >
                            <a-tooltip :content="'举报'">
                              <icon-exclamation-circle />
                            </a-tooltip>
                          </span>
                        </template>
                        <!-- 二级评论回复框 -->
                        <a-comment
                          align="right"
                          v-if="secondComment.showReplyBox"
                          :avatar="loginUser.userAvatar"
                        >
                          <template #actions>
                            <a-button
                              key="0"
                              type="secondary"
                              @click="toggleReplyBox(secondComment)"
                            >
                              Cancel
                            </a-button>
                            <a-button
                              key="1"
                              type="primary"
                              status="success"
                              @click="
                                publisOrReply(
                                  props.id,
                                  firstComment.id,
                                  secondComment.userId
                                )
                              "
                            >
                              Reply
                            </a-button>
                          </template>
                          <template #content>
                            <a-input
                              v-model="replyContent"
                              placeholder="Here is you content."
                            />
                          </template>
                        </a-comment>
                      </a-comment>
                    </a-collapse-item>
                  </a-collapse>
                </a-comment>
                <a-pagination
                  style="position: relative; top: 5px"
                  :total="firstCommentNum"
                  show-page-size
                  simple
                  show-total
                  v-model:current="commentsSearchParams.current"
                  v-model:page-size="commentsSearchParams.pageSize"
                  @change="onCommentsPageChange"
                  @page-size-change="onCommentsPageSizeChange"
                />
              </a-tab-pane>
              <!--题解-->
              <a-tab-pane key="answers" title="题解">
                <a-list
                  v-if="showQuestionSolutionList"
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
                      <!-- 创建题解 -->
                      <a-form-item>
                        <a-button
                          :disabled="question.isAccepted == 1"
                          type="primary"
                          shape="round"
                          status="success"
                          @click="openAddQuestionSolutionModal"
                          >发表题解
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </template>
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
                            @click="
                              () => {
                                showQuestionSolutionList = false;
                                goToSolution(item.id);
                              }
                            "
                          >
                            {{ item.title }}
                          </a-typography-text>
                        </template>
                        <template #description>
                          <a-typography-text
                            ellipsis
                            type="secondary"
                            @click="
                              () => {
                                showQuestionSolutionList = false;
                                goToSolution(item.id);
                              }
                            "
                            >{{ item.content }}
                          </a-typography-text>
                          <a-overflow-list
                            @click="
                              () => {
                                showQuestionSolutionList = false;
                                goToSolution(item.id);
                              }
                            "
                            style="width: 500px"
                            min="8"
                            margin="8"
                          >
                            <a-tag
                              v-for="(tag, index) of JSON.parse(item.tags)"
                              :key="index"
                              color="green"
                              >{{ tag }}
                            </a-tag>
                          </a-overflow-list>
                          <!-- 点赞数图标 -->
                          <span
                            @click="
                              () => {
                                showQuestionSolutionList = false;
                                goToSolution(item.id);
                              }
                            "
                          >
                            <IconHeartFill :style="{ color: '#f53f3f' }" />
                            {{ item.likes }}
                          </span>
                          <!-- 回复数图标 -->
                          <span
                            style="margin-left: 5px"
                            @click="
                              () => {
                                showQuestionSolutionList = false;
                                goToSolution(item.id);
                              }
                            "
                          >
                            <IconMessage /> {{ item.comments }}
                          </span>
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>
                <router-view v-if="!showQuestionSolutionList" />
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
    <!-- 创建题解 -->
    <a-modal
      width="50%"
      :visible="addQuestionSolutionVisible"
      placement="right"
      @cancel="closeAddQuestionSolutionModal"
      @ok="addQuestionSolution"
      :ok-text="'创建'"
      unmountOnClose
      :closable="false"
    >
      <a-form :model="addQuestionSolutionForm" label-align="left">
        <a-form-item field="title" label="题解标题" tooltip="请输入标题">
          <a-input
            v-model="addQuestionSolutionForm.title"
            placeholder="请输入题解标题"
          />
        </a-form-item>
        <a-form-item field="tags" label="标签" tooltip="请输入标签">
          <a-input-tag
            v-model="addQuestionSolutionForm.tags"
            placeholder="请输入标签"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="content" tooltip="请输入内容" label="题解内容">
          <MDEditor
            :value="addQuestionSolutionForm.content"
            :hanndle-change="onContentChange"
          />
        </a-form-item>
      </a-form>
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
import {
  defineProps,
  onBeforeMount,
  onMounted,
  ref,
  watchEffect,
  withDefaults,
} from "vue";
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
import { QuestionCommentControllerService } from "../../../generated/services/QuestionCommentControllerService";
import { QuestionComment } from "../../../generated/models/QuestionComment";
import { Message } from "@arco-design/web-vue";
import { CommentReportControllerService } from "../../../generated/services/CommentReportControllerService";
import { useRoute, useRouter } from "vue-router";
import { QuestionSolutionControllerService } from "../../../generated/services/QuestionSolutionControllerService";
import MDEditor from "@/components/MDEditor.vue";

const router = useRouter();
const route = useRoute();

// 获取题目id
interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

// Tab栏默认tab
const activeKey = ref("question");

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
const addQuestionSolutionVisible = ref(false);
// 打开弹窗
const openQuestionListModal = () => {
  questionListVisible.value = true;
};
const openAddQuestionSolutionModal = () => {
  addQuestionSolutionVisible.value = true;
};
// 关闭弹窗
const closeQuestionListModal = () => {
  questionListVisible.value = false;
};
const closeAddQuestionSolutionModal = () => {
  addQuestionSolutionVisible.value = false;
};

// 评论
const comments = ref([]);
const commentNum = ref(0);
const firstCommentNum = ref(0);
const commentsSearchParams = ref({
  current: 1,
  pageSize: 10,
  questionId: props.id,
  sortField: "createTime",
  sortOrder: "ascend",
});
const replyContent = ref("");

// 题解
// 用来控制展示题解列表还是具体的题解
const showQuestionSolutionList = ref(true);
const questionSolutionList = ref([]);
const questionSolutionListTotal = ref(0);
const questionSolutionListSearchParams = ref({
  pageSize: 3,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  questionId: props.id,
  title: "",
  tags: [],
});
// 创建题解
const addQuestionSolutionForm = ref({
  questionId: props.id,
  title: "",
  content: "",
  tags: [],
});

/**
 * 题解内容改变函数
 * @param value
 */
const onContentChange = (value: string) => {
  addQuestionSolutionForm.value.content = value;
};

/**
 * 获取题目
 */
const getQuestionByQuestionId = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    document.title = res.data?.title as string;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 获取个人提交记录
 */
const getPersonalQuestionSubmitByQuestionId = async () => {
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
 * 监听函数所使用的变量的变化，改变时触发页面的重新加载
 */
watchEffect(async () => {
  await getQuestionByQuestionId();
});
watchEffect(async () => {
  await getPersonalQuestionSubmitByQuestionId();
});
watchEffect(async () => {
  await getQuestionSolutionList();
});

/**
 * 在跳转到一个路由之前进行判断
 */
onBeforeMount(() => {
  if (route.fullPath.includes("answers")) {
    activeKey.value = "answers";
  } else if (route.fullPath.includes("solution")) {
    showQuestionSolutionList.value = false;
    activeKey.value = "answers";
  }
});

onMounted(async () => {
  await getQuestionByQuestionId();
  await getPersonalQuestionSubmitByQuestionId();
  await getLanguage();
  await getQuestionCollectByUserAllQuestionListDetail();
  await getComments();
  await getQuestionSolutionList();
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
const onCommentsPageChange = async (page: number) => {
  commentsSearchParams.value = {
    ...commentsSearchParams.value,
    current: page,
  };
  await getComments();
};
const onQuestionSolutionListPageChange = (page: number) => {
  questionSolutionListSearchParams.value = {
    ...questionSolutionListSearchParams.value,
    current: page,
  };
  getQuestionSolutionList();
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
const onCommentsPageSizeChange = async (size: number) => {
  commentsSearchParams.value = {
    ...commentsSearchParams.value,
    pageSize: size,
  };
  await getComments();
};
const onQuestionSolutionListPageSizeChange = (size: number) => {
  questionSolutionListSearchParams.value = {
    ...questionSolutionListSearchParams.value,
    pageSize: size,
  };
  getQuestionSolutionList();
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
  if (res.code == 0) {
    await getQuestionCollectByUserAllQuestionListDetail();
    message.success("收藏成功");
  } else {
    message.error("收藏失败");
  }
};

/**
 * 点赞题目
 */
const likeQuestion = async () => {
  const res = await QuestionControllerService.likeQuestionUsingPost(props.id);
  if (res.code == 0) {
    await getQuestionByQuestionId();
  } else {
    Message.error(res.message);
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
  if (res.code == 0) {
    await getQuestionCollectByUserAllQuestionListDetail();
    message.success("取消收藏成功");
  } else {
    message.error("取消收藏失败");
  }
};

/**
 * 获取评论列表
 */
const getComments = async () => {
  const res =
    await QuestionCommentControllerService.listQuestionCommentUsingPost(
      commentsSearchParams.value
    );
  if (res.code == 0) {
    comments.value = res.data.result;
    commentNum.value = res.data.commentNum;
    firstCommentNum.value = res.data.total;
  }
};

/**
 * 点击回复或者取消按钮，修改回复框的显示状态
 * @param comment
 */
const toggleReplyBox = (comment: QuestionComment) => {
  comment.showReplyBox = !comment.showReplyBox;
};

/**
 * 发表或者回复评论
 * @param questionId
 * @param parentId
 * @param respondUserId
 */
const publisOrReply = async (
  questionId: number,
  parentId: number,
  respondUserId: number
) => {
  const res =
    await QuestionCommentControllerService.publishQuestionCommentUsingPost({
      questionId: questionId,
      parentId: parentId,
      respondUserId: respondUserId,
      content: replyContent.value,
    });
  if (res.code == 0) {
    await getComments();
    Message.success("回复成功");
  } else {
    Message.error("回复失败：" + res.message);
  }
};

/**
 * 点赞评论
 * @param commmntId
 */
const likeComment = async (commmntId: number) => {
  const res =
    await QuestionCommentControllerService.likeQuestionCommentUsingPost(
      commmntId
    );
  if (res.code == 0) {
    await getComments();
  } else {
    Message.error(res.message);
  }
};

/**
 * 删除评论
 * @param commentId
 */
const deleteComment = async (commentId: number) => {
  const res =
    await QuestionCommentControllerService.deleteQuestionCommentUsingPost({
      id: commentId,
    });
  if (res.code == 0) {
    await getComments();
    Message.success("删除成功");
  } else {
    Message.error("删除失败：" + res.message);
  }
};

/**
 * 举报评论
 * @param commentType 评论类型
 * @param commentId 评论id
 * @param reportedUserId 被举人id
 */
const reportComment = async (
  commentType: number,
  commentId: number,
  reportedUserId: number
) => {
  const res = await CommentReportControllerService.addCommentReportUsingPost({
    commentType: commentType,
    commentId: commentId,
    reportedUserId: reportedUserId,
  });
  if (res.code == 0) {
    Message.success("举报成功");
  } else {
    Message.error("举报失败：" + res.message);
  }
};

/**
 * 获取题解
 */
const getQuestionSolutionList = async () => {
  const res =
    await QuestionSolutionControllerService.listQuestionSolutionByPageUserUsingPost(
      questionSolutionListSearchParams.value
    );
  if (res.code == 0) {
    questionSolutionList.value = res.data.records;
    questionSolutionListTotal.value = res.data.total;
  } else {
    message.error(res.message);
  }
};

/**
 * 创建题解
 */
const addQuestionSolution = async () => {
  const res =
    await QuestionSolutionControllerService.addQuestionSolutionUsingPost(
      addQuestionSolutionForm.value
    );
  if (res.code == 0) {
    message.success("发表成功");
    addQuestionSolutionVisible.value = false;
    await getQuestionSolutionList();
  } else {
    message.error(res.message);
  }
};

/**
 * Tab栏点击事件
 * @param key
 */
const tabClick = (key: string) => {
  if (key == "answers") {
    if (route.path.includes("solution")) {
      // 当在具体题解页面时点击tab栏，就什么都不做
    } else {
      // 如果点击的是题解tab栏就跳转到以下这个路由，然后就会执行onBeforeMount中的判断
      router.push(`${route.path}?tab=answers`);
    }
  }
};

/**
 * 点击题解进行跳转
 * @param questionSolutionId
 */
const goToSolution = (questionSolutionId: number) => {
  router.push({
    path: `/view/question/${props.id}/solution/${questionSolutionId}`,
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
  }else{
    router.push({
      path: `/Ta/${userId}`,
    });
  }
};

router.afterEach((to, from, failure) => {
  // 路由跳转后，如果路径包含answers，就展示题解列表
  if (to.fullPath.includes("answers")) {
    showQuestionSolutionList.value = true;
  } else if (to.fullPath.includes("solution")) {
    // 如果路径包含solution，就不展示题解列表，并显示具体的题解
    showQuestionSolutionList.value = false;
  } else {
    // 否则就刷新页面，因为有可能是跳转到下一道题目
    location.reload();
  }
});
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

.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>