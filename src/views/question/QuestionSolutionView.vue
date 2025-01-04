<template>
  <div id="questionSolutionView">
    <a-card v-if="questionSolution.content" @click="">
      <MDViewer :value="questionSolution.content || ''" />
      <template #title>
        <a-button
          style="color: gray; font-size: 23px"
          type="text"
          @click="
            () => {
              router.push(
                route.fullPath.substring(
                  0,
                  route.fullPath.lastIndexOf('s') - 1
                ) + '?tab=answers'
              );
            }
          "
        >
          <icon-arrow-left />
        </a-button>
      </template>
      <template #extra>
        <a-space wrap>
          <a-overflow-list
            style="width: 455px; margin-top: 0px"
            min="4"
            margin="8"
          >
            <a-tag
              v-for="(tag, index) of JSON.parse(questionSolution.tags)"
              :key="index"
              color="green"
              >{{ tag }}
            </a-tag>
          </a-overflow-list>
          <!-- 收藏 -->
          <icon-star-fill
            style="font-size: 23px; color: rgb(247, 186, 30)"
            v-if="isCollet"
            @click="unCollectQuestionSolution"
          />
          <icon-star-fill
            style="font-size: 23px; color: rgb(229, 230, 235)"
            v-else
            @click="collectQuestionSolution"
          />
          <!-- 点赞 -->
          <IconHeartFill
            v-if="questionSolution.isLike"
            style="font-size: 23px; color: red"
            @click="likeQuestionSolution"
          />
          <IconHeart
            v-else
            style="font-size: 23px; color: gray"
            @click="likeQuestionSolution"
          />
          {{ questionSolution.likes }}
          <!-- 评论 -->
          <IconMessage style="font-size: 23px; color: gray" />
          {{ commentNum }}
          <!-- 举报图标 -->
          <a-tooltip :content="'举报'">
            <icon-exclamation-circle
              v-if="questionSolution.userId != loginUser.id"
              @click="
                reportSolution(questionSolution.id, questionSolution.userId)
              "
              style="font-size: 23px; color: gray"
            />
          </a-tooltip>
        </a-space>
      </template>
    </a-card>
    <!-- 发表评论 -->
    <a-comment id="publish" align="right" :avatar="loginUser.userAvatar">
      <template #actions>
        <a-button
          key="1"
          type="primary"
          status="success"
          @click="publisOrReply(props.questionSolutionId, 0, 0)"
        >
          评论
        </a-button>
      </template>
      <template #content>
        <a-input v-model="replyContent" placeholder="Here is you content." />
      </template>
    </a-comment>
    <!-- 一级评论 -->
    <a-comment
      v-for="firstComment in comments"
      :author="firstComment.userName"
      :content="firstComment.content"
      :datetime="moment(firstComment.createTime).format('YYYY-MM-DD HH:mm:ss')"
    >
      <template #avatar>
        <a-avatar @click="goToUser(firstComment.userId)" :size="32">
          <img :src="firstComment.userAvatar" />
        </a-avatar>
      </template>
      <template #actions>
        <!-- 点赞图标 -->
        <span class="action" key="heart" @click="likeComment(firstComment.id)">
          <span v-if="firstComment.isLike">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ firstComment.likes }}
        </span>
        <!-- 回复图标 -->
        <span class="action" key="reply" @click="toggleReplyBox(firstComment)">
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
          @click="reportComment(1, firstComment.id, firstComment.userId)"
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
            @click="publisOrReply(props.questionSolutionId, firstComment.id, 0)"
          >
            Reply
          </a-button>
        </template>
        <template #content>
          <a-input v-model="replyContent" placeholder="Here is you content." />
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
              moment(secondComment.createTime).format('YYYY-MM-DD HH:mm:ss')
            "
            v-for="secondComment in firstComment.childList"
          >
            <template #avatar>
              <a-avatar @click="goToUser(secondComment.userId)" :size="32">
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
                  reportComment(1, secondComment.id, secondComment.userId)
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
                      props.questionSolutionId,
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QuestionSolutionControllerService } from "../../../generated/services/QuestionSolutionControllerService";
import message from "@arco-design/web-vue/es/message";
import MDViewer from "@/components/MDViewer.vue";
import { QuestionSolutionCollectControllerService } from "../../../generated/services/QuestionSolutionCollectControllerService";
import moment from "moment";
import { useStore } from "vuex";
import {
  CommentReportControllerService,
  QuestionSolutionComment,
  QuestionSolutionCommentControllerService,
  QuestionSolutionReportControllerService,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";

const router = useRouter();
const route = useRoute();

// 获取题解id
interface Props {
  questionSolutionId: string;
}

const props = withDefaults(defineProps<Props>(), {
  questionSolutionId: () => "",
});

// 获取登录用户
const store = useStore();
let loginUser = store.state.user.loginUser;

// 题解
const questionSolution = ref({
  comments: 0,
  content: "",
  createTime: "",
  id: 0,
  isDelete: 0,
  isLike: false,
  likes: 0,
  questionId: 0,
  tags: "",
  title: "",
  updateTime: "",
  userAvatar: "",
  userId: 0,
  userName: "",
});

// 是否收藏题解
const isCollet = ref(false);

// 评论
const comments = ref([]);
const commentNum = ref(0);
const firstCommentNum = ref(0);
const commentsSearchParams = ref({
  current: 1,
  pageSize: 10,
  solutionId: props.questionSolutionId,
  sortField: "createTime",
  sortOrder: "ascend",
});
const replyContent = ref("");

onMounted(async () => {
  await getQuestionSolution();
  await isCollectQuestionSolution();
  await getComments();
});

const onCommentsPageChange = async (page: number) => {
  commentsSearchParams.value = {
    ...commentsSearchParams.value,
    current: page,
  };
  await getComments();
};

const onCommentsPageSizeChange = async (size: number) => {
  commentsSearchParams.value = {
    ...commentsSearchParams.value,
    pageSize: size,
  };
  await getComments();
};

/**
 * 获取题解
 */
const getQuestionSolution = async () => {
  const res =
    await QuestionSolutionControllerService.getQuestionSolutionByIdUsingGet(
      props.questionSolutionId as any
    );
  if (res.code == 0) {
    questionSolution.value = res.data as any;
  } else {
    message.error("" + res.message);
  }
};

/**
 * 判断当前用户是否收藏该题解
 */
const isCollectQuestionSolution = async () => {
  const res =
    await QuestionSolutionCollectControllerService.isQuestionSolutionCollectUsingPost(
      props.questionSolutionId
    );
  if (res.code == 0) {
    isCollet.value = res.data;
  } else {
    message.error("" + res.message);
  }
};

/**
 * 收藏题解
 */
const collectQuestionSolution = async () => {
  const res =
    await QuestionSolutionCollectControllerService.addQuestionSolutionCollectUsingPost(
      {
        solutionId: props.questionSolutionId,
      }
    );
  if (res.code == 0) {
    await isCollectQuestionSolution();
    message.success("收藏成功");
  } else {
    message.error("收藏失败");
  }
};

/**
 * 取消收藏
 */
const unCollectQuestionSolution = async () => {
  const res =
    await QuestionSolutionCollectControllerService.deleteQuestionSolutionCollectUsingPost(
      props.questionSolutionId
    );
  if (res.code == 0) {
    await isCollectQuestionSolution();
    message.success("取消收藏成功");
  } else {
    message.error("取消收藏失败");
  }
};

/**
 * 点赞/取消点赞题解
 */
const likeQuestionSolution = async () => {
  const res =
    await QuestionSolutionControllerService.likeQuestionSolutionUsingPost(
      props.questionSolutionId
    );
  if (res.code == 0) {
    await getQuestionSolution();
  } else {
    message.error("点赞失败，" + res.message);
  }
};

/**
 * 举报题解
 * @param solutionId
 * @param reportedUserId
 */
const reportSolution = async (solutionId: number, reportedUserId: number) => {
  const res =
    await QuestionSolutionReportControllerService.addQuestionSolutionReportUsingPost(
      {
        solutionId: solutionId,
        reportedUserId: reportedUserId,
      }
    );
  if (res.code == 0) {
    Message.success("举报成功");
  } else {
    Message.error("举报失败：" + res.message);
  }
};

/**
 * 获取评论列表
 */
const getComments = async () => {
  const res =
    await QuestionSolutionCommentControllerService.listQuestionSolutionCommentUsingPost(
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
const toggleReplyBox = (comment: QuestionSolutionComment) => {
  comment.showReplyBox = !comment.showReplyBox;
};

/**
 * 发表或者回复评论
 * @param questionId
 * @param parentId
 * @param respondUserId
 */
const publisOrReply = async (
  solutionId: number,
  parentId: number,
  respondUserId: number
) => {
  const res =
    await QuestionSolutionCommentControllerService.publishQuestionSolutionCommentUsingPost(
      {
        solutionId: solutionId,
        parentId: parentId,
        respondUserId: respondUserId,
        content: replyContent.value,
      }
    );
  if (res.code == 0) {
    await getComments();
    Message.success("评论成功");
  } else {
    Message.error("评论失败：" + res.message);
  }
};

/**
 * 点赞评论
 * @param commmntId
 */
const likeComment = async (commmntId: number) => {
  const res =
    await QuestionSolutionCommentControllerService.likeQuestionSolutionCommentUsingPost(
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
    await QuestionSolutionCommentControllerService.deleteQuestionSolutionCommentUsingPost(
      {
        id: commentId,
      }
    );
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