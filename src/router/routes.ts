import { RouteRecordRaw } from "vue-router";
import NoAuthView from "/src/views/NoAuthView.vue";
import AccessEnum from "@/access/AccessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import UserInfoView from "@/views/user/UserInfoView.vue";
import UserManageView from "@/views/user/UserManageView.vue";
import QuestionLayout from "@/layouts/QuestionLayout.vue";
import QuestionListView from "@/views/question/QuestionListView.vue";
import QuestionSoulutionView from "@/views/question/QuestionSolutionView.vue";
import UserView from "@/views/user/UserView.vue";
import ContestsView from "@/views/question/ContestsView.vue";
import ViewContestView from "@/views/question/ViewContestView.vue";
import ContestLayout from "@/layouts/ContestLayout.vue";
import AcceptedQuestionManageView from "@/views/question/AcceptedQuestionManageView.vue";
import ContestApplyManageView from "@/views/question/ContestApplyManageView.vue";
import ContestResultManageView from "@/views/question/ContestResultManageView.vue";
import QuestionCollectManageView from "@/views/question/QuestionCollectManageView.vue";
import QuestionCommentManageView from "@/views/question/QuestionCommentManageView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/_userInfo",
    name: "个人信息",
    component: UserInfoView,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/_userInfo/:id",
    name: "Ta的主页",
    component: UserView,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
    props: true,
  },
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  {
    path: "/questions",
    name: "题库",
    component: QuestionsView,
  },
  {
    path: "/contests",
    name: "竞赛",
    component: ContestsView,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/detail",
    name: "查看竞赛",
    component: ContestLayout,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
    children:[
      {
        path: "contest/:contestId",
        name: "竞赛详情",
        component: ViewContestView,
        meta: {
          access: AccessEnum.USER,
          hideInMenu: true,
        },
        props: true,
      }
    ]
  },
  {
    path: "/questionList",
    name: "题单",
    component: QuestionListView,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/question_submit",
    name: "提交记录",
    component: QuestionSubmitView,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/view",
    name: "题目",
    component: QuestionLayout,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
    children: [
      {
        path: "question/:id",
        name: "在线做题",
        component: ViewQuestionView,
        props: true,
        children: [
          {
            path: "solution/:questionSolutionId", // 这里的路径应该是相对于上一级的
            name: "题解",
            component: QuestionSoulutionView,
            props: true,
          },
        ],
      },
    ],
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/_userManage",
    name: "用户管理",
    component: UserManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/question",
    name: "题目管理",
    component: ManageQuestionView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/questionCollect",
    name: "题目收藏管理",
    component: QuestionCollectManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/questionComment",
    name: "题目评论管理",
    component: QuestionCommentManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/acceptedQuestion",
    name: "通过题目管理",
    component: AcceptedQuestionManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/contest",
    name: "竞赛报名管理",
    component: ContestApplyManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/manage/contestResult",
    name: "竞赛结果管理",
    component: ContestResultManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "题目更新",
    component: AddQuestionView,
    meta: {
      access: AccessEnum.ADMIN,
      hideInMenu: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "仅管理员可见",
  //   component: AdminView,
  //   meta: {
  //     access: AccessEnum.ADMIN,
  //   },
  // },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/about",
  //   name: "关于我的",
  //   component: AboutView,
  // },
];

export default routes;
