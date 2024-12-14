<template>
  <div id="questionListView">
    <!-- 题单 -->
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
              @click="getQuestionList"
              >搜 索
            </a-button>
          </a-form-item>
        </a-form>
      </template>
      <template #item="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <!-- 题单创建人头像 -->
            <template #avatar>
              <a-avatar @click="goToUser(item.userId)"
                ><img alt="avatar" :src="item.userAvatar"
              /></a-avatar>
            </template>
            <!-- 题单标题 -->
            <template #title>
              <a-button
                type="text"
                shape="round"
                status="normal"
                size="medium"
                style="margin: 10px"
                @click="openActualQuestionsModal(item.id, item.userId)"
              >
                {{ item.title }}
              </a-button>
            </template>
          </a-list-item-meta>
          <template #actions>
            <!-- 收藏 -->
            <icon-star-fill
              style="font-size: 23px; color: rgb(247, 186, 30)"
              v-if="item.isCollect && item.userId != loginUser.id"
              @click="unCollectQuestion(item.id)"
            />
            <!-- 取消收藏 -->
            <icon-star-fill
              style="font-size: 23px; color: rgb(229, 230, 235)"
              v-if="!item.isCollect && item.userId != loginUser.id"
              @click="collectQuestion(item.id)"
            />
          </template>
        </a-list-item>
      </template>
    </a-list>
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
            <template #actions v-if="loginUser.id == item.userId">
              <a-popconfirm
                content="确定要取消收藏此题目吗?"
                type="error"
                okText="是"
                cancelText="否"
                @cancel="
                  () => {
                    message.warning(`已取消`);
                  }
                "
                @ok="deleteQuestionInQuestionList(item.id, item.questionListId)"
              >
                <icon-delete />
              </a-popconfirm>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { Question } from "../../../generated/models/Question";
import { QuestionListControllerService } from "../../../generated/services/QuestionListControllerService";
import { useStore } from "vuex";
import { QuestionListVO } from "../../../generated/models/QuestionListVO";
import { QuestionListCollectControllerService } from "../../../generated/services/QuestionListCollectControllerService";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import { QuestionCollectControllerService } from "../../../generated/services/QuestionCollectControllerService";
import { QuestionControllerService } from "../../../generated/services/QuestionControllerService";
import { Message } from "@arco-design/web-vue";

document.title = "题单";

const router = useRouter();

// 获取登录用户
const store = useStore();
let loginUser = store.state.user.loginUser;

// 题单分页
const questionList = ref([]);
const questionListTotal = ref(0);
const questionListSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  title: "",
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

// 用来记录所点击的某个题单的id
const questionListId = ref(0);

// 弹窗
const actualQuestionsVisible = ref(false);
// 打开弹窗
const openActualQuestionsModal = (id: number, userId: number) => {
  questionListId.value = id;
  actualQuestionsVisible.value = true;
  getQuestionsByQuestionListId(id, userId);
};
const closeActualQuestionsModel = () => {
  actualQuestionsVisible.value = false;
};

/**
 * 页面切换
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
/**
 * 页面大小切换
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

/**
 * 搜索题单
 */
const getQuestionList = async () => {
  const res =
    await QuestionListControllerService.listQuestionListByPageUserUsingPost(
      questionListSearchParams.value
    );
  if (res.code == 0) {
    questionList.value = (await Promise.all(
      res.data.records.map(async (x: QuestionListVO) => {
        const user = await UserControllerService.getUserVoByIdUsingGet(
          x.userId
        );
        return { ...x, userAvatar: user.data?.userAvatar };
      })
    )) as [];
    questionListTotal.value = res.data.total;
  } else {
    message.success(res.message);
  }
};
/**
 * 收藏题单
 * @param questionListId
 */
const collectQuestion = async (questionListId: number) => {
  const res =
    await QuestionListCollectControllerService.addQuestionListCollectUsingPost({
      questionListId: questionListId,
    });
  if (res.code == 0) {
    await getQuestionList();
    message.success("收藏成功");
  } else {
    message.error("收藏失败");
  }
};

/**
 * 取消收藏题单
 * @param questionListId
 */
const unCollectQuestion = async (questionListId: number) => {
  const res =
    await QuestionListCollectControllerService.deleteQuestionListCollectUsingPost(
      {
        questionListId: questionListId,
      }
    );
  if (res.code == 0) {
    await getQuestionList();
    message.success("取消收藏成功");
  } else {
    message.error("取消收藏失败");
  }
};

/**
 * 监听getQuestionList函数所使用的变量的变化，改变时触发页面的重新加载
 */
watchEffect(async () => {
  await getQuestionList();
});

onMounted(async () => {
  await getQuestionList();
});

/**
 * 获取某个题单的题目
 * @param questionListId 题目所属题单的id
 * @param userId 题目所属题单的创建人的id
 */
const getQuestionsByQuestionListId = async (
  questionListId: number,
  userId: number
) => {
  console.log(questionsSearchParams.value);
  const res =
    await QuestionCollectControllerService.listQuestionCollectByPageUserUsingPost(
      { ...questionsSearchParams.value, questionListId: questionListId }
    );
  if (res.code === 0) {
    questions.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const questionVO =
          await QuestionControllerService.getQuestionVoByIdUsingGet(
            x.questionId
          );
        return {
          ...questionVO.data,
          questionListId: questionListId,
          userId: userId,
        };
      })
    )) as [];
    questionsTotal.value = res.data.total;
  } else {
    Message.error("" + res.message);
  }
};

/**
 * 题单取消收藏题目
 * @param questionId
 * @param questionListId
 */
const deleteQuestionInQuestionList = async (
  questionId: number,
  questionListId: number
) => {
  const res =
    await QuestionCollectControllerService.deleteQuestionCollectUsingPost({
      questionId: questionId,
      questionListId: questionListId,
    });
  if (res.code === 0) {
    message.success("删除成功");
  } else {
    message.error("删除失败，" + res.message);
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
 * 点击头像进行跳转
 * @param userId
 */
const goToUser = (userId: number) => {
  if (userId != loginUser.id) {
    router.push({
      path: `/_userInfo/${userId}`,
    });
  }
};
</script>

<style scoped>
#questionListView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>