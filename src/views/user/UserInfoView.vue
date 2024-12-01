<template>
  <div id="userInfoView">
    <a-descriptions-item>
      <a-avatar :size="100" shape="circle">
        <img alt="头像" :src="loginUser.userAvatar" />
      </a-avatar>
      <a-badge
        :max-count="9999"
        :count="loginUser.followers"
        :dotStyle="{ background: '#7BC616', color: '#fff' }"
      >
        <a-button
          type="text"
          shape="round"
          status="normal"
          size="medium"
          style="margin: 10px"
          @click="openFollowModalForm"
          >关注
        </a-button>
      </a-badge>
      <a-badge
        :max-count="9999"
        :count="loginUser.fans"
        :dotStyle="{ background: '#F53F3F', color: '#fff' }"
      >
        <a-button
          type="text"
          shape="round"
          status="normal"
          size="medium"
          style="margin: 10px"
          @click="openFanModalForm"
          >粉丝
        </a-button>
      </a-badge>
    </a-descriptions-item>
    <a-card title="我的信息">
      <a-descriptions :data="data" size="large" column="1" bordered />
      <template #extra>
        <a-badge status="success" text="在线" />
      </template>
    </a-card>
    <!--  关注列表  -->
    <a-modal
      width="50%"
      :visible="followVisible"
      placement="right"
      @cancel="closeFollowModel"
      :footer="false"
      :closable="false"
      unmountOnClose
    >
      <a-form
        :model="followSearchParams"
        layout="inline"
        style="justify-content: center; align-content: center; margin: 25px"
      >
        <a-form-item
          field="userAccount"
          label="账号："
          tooltip="请输入用户的账号"
        >
          <a-input
            v-model="followSearchParams.userAccount"
            placeholder="请输入用户的账号"
          />
        </a-form-item>
        <a-form-item
          field="userName"
          label="用户昵称："
          tooltip="请输入用户昵称"
        >
          <a-input
            v-model="followSearchParams.userName"
            placeholder="请输入要搜索的用户名称"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="outline"
            shape="round"
            status="normal"
            @click="getFollow"
            >搜 索
          </a-button>
        </a-form-item>
      </a-form>
      <a-table
        :show-header="false"
        :column-resizable="true"
        :ref="followTableRef"
        :columns="columns"
        :data="followList"
        :pagination="{
          showTotal: true,
          pageSize: followSearchParams.pageSize,
          current: followSearchParams.current,
          total,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onFollowPageChange"
        @pageSizeChange="onFollowPageSizeChange"
      >
        <template #userAvatar="{ record }">
          <a-avatar :size="70" shape="circle">
            <img alt="userAvatar" :src="record.userAvatar" />
          </a-avatar>
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button
              shape="round"
              type="outline"
              @click="follow(record)"
              v-if="record.isFollow"
              >已关注
            </a-button>
            <a-button
              shape="round"
              type="outline"
              @click="follow(record)"
              v-else
              >关注
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-modal>
    <!--  粉丝列表  -->
    <a-modal
      width="50%"
      :visible="fanVisible"
      placement="right"
      @cancel="closeFanModel"
      unmountOnClose
      :footer="false"
      :closable="false"
    >
      <a-form
        :model="fanSearchParams"
        layout="inline"
        style="justify-content: center; align-content: center; margin: 25px"
      >
        <a-form-item
          field="userAccount"
          label="账号："
          tooltip="请输入用户的账号"
        >
          <a-input
            v-model="fanSearchParams.userAccount"
            placeholder="请输入用户的账号"
          />
        </a-form-item>
        <a-form-item
          field="userName"
          label="用户昵称："
          tooltip="请输入用户昵称"
        >
          <a-input
            v-model="fanSearchParams.userName"
            placeholder="请输入要搜索的用户名称"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="outline" shape="round" status="normal" @click="getFan"
            >搜 索
          </a-button>
        </a-form-item>
      </a-form>
      <a-table
        :show-header="false"
        :column-resizable="true"
        :ref="fanTableRef"
        :columns="columns"
        :data="fanList"
        :pagination="{
          showTotal: true,
          pageSize: fanSearchParams.pageSize,
          current: fanSearchParams.current,
          total,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onFanPageChange"
        @pageSizeChange="onFanPageSizeChange"
      >
        <template #userAvatar="{ record }">
          <a-avatar :size="70" shape="circle">
            <img alt="userAvatar" :src="record.userAvatar" />
          </a-avatar>
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button
              shape="round"
              type="outline"
              @click="follow(record)"
              v-if="record.isFollow"
              >互相关注
            </a-button>
            <a-button
              shape="round"
              type="outline"
              @click="follow(record)"
              v-else
              >关注
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-modal>
    <!--  修改个人信息   -->
    <a-modal
      width="30%"
      :visible="updatePersonalInfoVisible"
      placement="right"
      @ok="updatePersonalInfo"
      @cancel="closeUpdatePersonalInfoModel"
      unmountOnClose
    >
      <div style="text-align: center">
        <a-upload
          action="/"
          :fileList="file ? [file] : []"
          :show-file-list="false"
          @change="onChange"
          :custom-request="uploadAvatar"
        >
          <template #upload-button>
            <div class="arco-upload-list-picture custom-upload-avatar">
              <a-avatar :size="70" shape="circle">
                <img alt="头像" :src="userAvatarImg" v-if="userAvatarImg" />
              </a-avatar>
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
            </div>
          </template>
        </a-upload>
      </div>
      <a-form
        :model="loginUser"
        label-align="right"
        title="个人信息"
        style="max-width: 480px; margin: 0 auto"
      >
        <a-form-item field="用户昵称" label="昵称 :">
          <a-input
            v-model="updatePersonalInfoForm.userName"
            placeholder="请输入用户昵称"
          />
        </a-form-item>
        <a-form-item field="userProfile" label="简介 :">
          <a-textarea
            v-model="updatePersonalInfoForm.userProfile"
            placeholder="请输入简介"
          />
        </a-form-item>
        <a-form-item field="gender" label="性别">
          <a-select
            v-model="updatePersonalInfoForm.gender"
            :style="{ width: '320px' }"
            placeholder="请选择性别"
          >
            <a-option :value="0" :disabled="updatePersonalInfoForm.gender == 0"
              >男
            </a-option>
            <a-option :value="1" :disabled="updatePersonalInfoForm.gender == 1"
              >女
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--  修改密码  -->
    <a-modal
      width="30%"
      :visible="updatePasswordVisible"
      placement="right"
      @ok="handleUpdatePasswordSubmit"
      @cancel="closeUpdatePasswordModel"
      unmountOnClose
    >
      <a-form
        :model="updatePasswordForm"
        label-align="right"
        title="修改密码"
        style="max-width: 480px; margin: 0 auto"
      >
        <a-form-item
          :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 8, message: '密码长度不能低于8位' },
            { maxLength: 16, message: '密码长度不能高于16位' },
          ]"
          field="newPassword"
          label="密码"
        >
          <a-tooltip content="大写字母、小写字母、数字" position="top">
            <a-input-password
              v-model="updatePasswordForm.newPassword"
              placeholder="请输入密码"
            />
          </a-tooltip>
        </a-form-item>
        <a-form-item
          :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 8, message: '密码长度不能低于8位' },
            { maxLength: 16, message: '密码长度不能高于16位' },
          ]"
          field="checkPassword"
          label="确认密码"
        >
          <a-tooltip content="大写字母、小写字母、数字" position="top">
            <a-input-password
              v-model="updatePasswordForm.checkPassword"
              placeholder="请确认密码"
            />
          </a-tooltip>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '邮箱不能为空' }]"
          field="email"
          label="邮箱"
        >
          <a-input
            disabled
            v-model="updatePasswordForm.eamil"
            placeholder="请输入邮箱"
          />
          <a-button
            type="text"
            status="success"
            @click="getCaptcha(updatePasswordForm.eamil, 'UPDATE_PASSWORD')"
            :disabled="
              updatePasswordForm.eamil == undefined ||
              !emailRegex.test(updatePasswordForm.eamil) ||
              time > 0
            "
            style="height: 32px; width: 130px"
          >
            <template v-if="time != 0"> {{ time }}</template>
            <template v-if="time == 0"> {{ tip }}</template>
          </a-button>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '验证码不能为空' }]"
          field="captcha"
          label="验证码"
        >
          <a-tooltip content="数字" position="top">
            <a-input
              v-model="updatePasswordForm.captcha"
              placeholder="请输入验证码"
            />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--  绑定邮箱  -->
    <a-modal
      width="30%"
      :visible="emailBindVisible"
      placement="right"
      @ok="handleEmailBindSubmit"
      @cancel="closeEmailBindModel"
      unmountOnClose
    >
      <a-form
        :model="emailForm"
        label-align="right"
        title="绑定邮箱"
        style="max-width: 480px; margin: 0 auto"
      >
        <a-form-item
          :rules="[{ required: true, message: '邮箱不能为空' }]"
          field="email"
          label="邮箱"
        >
          <a-input v-model="emailForm.eamil" placeholder="请输入邮箱" />

          <a-button
            type="text"
            status="success"
            @click="getCaptcha(emailForm.eamil, 'UPDATE_EMAIL')"
            :disabled="
              emailForm.eamil == undefined ||
              !emailRegex.test(emailForm.eamil) ||
              time > 0
            "
            style="height: 32px; width: 130px"
          >
            <template v-if="time != 0"> {{ time }}</template>
            <template v-if="time == 0"> {{ tip }}</template>
          </a-button>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '验证码不能为空' }]"
          field="captcha"
          label="验证码"
        >
          <a-tooltip content="数字" position="top">
            <a-input v-model="emailForm.captcha" placeholder="请输入验证码" />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--  解绑邮箱  -->
    <a-modal
      width="30%"
      :visible="emailUnBindVisible"
      placement="right"
      @ok="handleEmailUnBindSubmit"
      @cancel="closeEmailUnBindModel"
      unmountOnClose
    >
      <a-form
        :model="emailForm"
        label-align="right"
        title="解绑邮箱"
        style="max-width: 480px; margin: 0 auto"
      >
        <a-form-item
          :rules="[{ required: true, message: '邮箱不能为空' }]"
          field="email"
          label="邮箱"
        >
          <a-input
            disabled
            v-model="emailForm.eamil"
            placeholder="请输入邮箱"
          />
          <a-button
            type="text"
            status="success"
            @click="getCaptcha(emailForm.eamil, 'UPDATE_EMAIL')"
            :disabled="
              emailForm.eamil == undefined ||
              !emailRegex.test(emailForm.eamil) ||
              time > 0
            "
            style="height: 32px; width: 130px"
          >
            <template v-if="time != 0"> {{ time }}</template>
            <template v-if="time == 0"> {{ tip }}</template>
          </a-button>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '验证码不能为空' }]"
          field="captcha"
          label="验证码"
        >
          <a-tooltip content="数字" position="top">
            <a-input v-model="emailForm.captcha" placeholder="请输入验证码" />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </a-modal>
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
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openUpdatePersonalInfoModalForm"
        >编辑个人资料
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openUpdatePasswordModalForm"
        >修改密码
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openEmailBindModalForm"
        v-if="!loginUser.email"
        >绑定邮箱
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openEmailUnBindModalForm"
        v-if="loginUser.email"
        >解绑邮箱
      </a-button>
    </div>
  </div>
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
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { onMounted, ref, watchEffect } from "vue";
import { FileItem, Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { UserUpdateMyRequest } from "../../../generated/models/UserUpdateMyRequest";
import { FileControllerService } from "../../../generated";
import { UserControllerService } from "../../../generated/services/UserControllerService";
import message from "@arco-design/web-vue/es/message";
import { FollowControllerService } from "../../../generated/services/FollowControllerService";
import { AcceptedQuestionDetailVO } from "../../../generated/models/AcceptedQuestionDetailVO";
import { AcceptedQuestionControllerService } from "../../../generated/services/AcceptedQuestionControllerService";

document.title = "个人";

const router = useRouter();
const store = useStore();

// 个人
// 获取登录用户
let loginUser = store.state.user.loginUser;
const data = [
  {
    label: "账号：",
    value: loginUser.userAccount,
  },
  {
    label: "用户昵称：",
    value: loginUser.userName,
  },
  {
    label: "我的简介：",
    value: loginUser.userProfile,
  },
  {
    label: "用户角色：",
    value: loginUser.userRole === "user" ? "普通用户" : "管理员",
  },
  {
    label: "邮箱：",
    value: loginUser.email,
  },
  {
    label: "性别：",
    value:
      loginUser.gender == null ? "未设置" : loginUser.gender == 0 ? "男" : "女",
  },
];
const updatePersonalInfoForm = ref<UserUpdateMyRequest>({
  ...store.state.user?.loginUser,
});

// 头像
const file = ref();
let userAvatarImg = updatePersonalInfoForm.value.userAvatar;

// 关注
const followTableRef = ref();
const followList = ref([]);
const columns = [
  {
    title: "头像",
    slotName: "userAvatar",
    align: "center",
    width: 64,
  },
  {
    title: "账号",
    dataIndex: "userAccount",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "userName",
    align: "center",
  },

  {
    title: "简介",
    dataIndex: "userProfile",
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
  },
];

// 粉丝
const fanTableRef = ref();
const fanList = ref([]);

// 分页
const total = ref(0);
const followSearchParams = ref({
  userName: "",
  userAccount: "",
  pageSize: 10,
  current: 1,
});
const fanSearchParams = ref({
  userName: "",
  userAccount: "",
  pageSize: 10,
  current: 1,
});

// 密码
const updatePasswordForm = ref({
  captcha: "",
  checkPassword: "",
  newPassword: "",
  eamil: loginUser.email,
});

// 验证码
const tip = ref("获取验证码");
const time = ref(0);
const intervalId = ref();
let emailRegex = new RegExp(
  "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$"
);

// 邮箱
const emailForm = ref({
  captcha: "",
  eamil: loginUser.email,
});

// 通过详情
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

// 弹窗
const updatePersonalInfoVisible = ref(false);
const followVisible = ref(false);
const fanVisible = ref(false);
const updatePasswordVisible = ref(false);
const emailBindVisible = ref(false);
const emailUnBindVisible = ref(false);
// 打开弹窗
const openUpdatePersonalInfoModalForm = () => {
  updatePersonalInfoVisible.value = true;
};
const openFollowModalForm = () => {
  followVisible.value = true;
  getFollow();
};
const openFanModalForm = () => {
  fanVisible.value = true;
  getFan();
};
const openUpdatePasswordModalForm = () => {
  updatePasswordVisible.value = true;
};

const openEmailBindModalForm = () => {
  emailBindVisible.value = true;
};

const openEmailUnBindModalForm = () => {
  emailUnBindVisible.value = true;
};

// 关闭弹窗
const closeUpdatePersonalInfoModel = () => {
  updatePersonalInfoVisible.value = false;
};
const closeFollowModel = () => {
  followVisible.value = false;
};
const closeFanModel = () => {
  fanVisible.value = false;
};
const closeUpdatePasswordModel = () => {
  updatePasswordVisible.value = false;
};
const closeEmailBindModel = () => {
  emailBindVisible.value = false;
};

const closeEmailUnBindModel = () => {
  emailUnBindVisible.value = false;
};

/**
 * 编辑个人资料
 */
const updatePersonalInfo = async () => {
  const res = await UserControllerService.updatePersonalInfoUsingPost({
    ...updatePersonalInfoForm.value,
    userAvatar: userAvatarImg,
  });
  if (res.code === 0) {
    Message.success("更新成功！");
    updatePersonalInfoVisible.value = false;
    location.reload();
  } else {
    Message.error("更新失败！", res.msg);
  }
};

/**
 * 获取关注列表
 */
const getFollow = async () => {
  const res = await FollowControllerService.getFollowPageUsingPost({
    ...followSearchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.code === 0) {
    followList.value = await Promise.all(
      res.data.records.map(async (x) => {
        const isFollow = await FollowControllerService.isFollowUsingGet(x.id);
        return { ...x, isFollow: isFollow.data };
      })
    );
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 获取粉丝列表
 */
const getFan = async () => {
  const res = await FollowControllerService.getFansPageUsingPost({
    ...fanSearchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.code === 0) {
    fanList.value = await Promise.all(
      res.data.records.map(async (x) => {
        const isFollow = await FollowControllerService.isFollowUsingGet(x.id);
        return { ...x, isFollow: isFollow.data };
      })
    );
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  getFollow();
});
watchEffect(() => {
  getFan();
});

/**
 * 关注或取消关注
 * @param record
 */
const follow = async (record: any) => {
  const res = await FollowControllerService.followUsingPost(
    !record.isFollow,
    record.id
  );
  if (res.code === 0) {
    record.isFollow = !record.isFollow;
  } else {
    message.error(res.message);
  }
};

/**
 * 改变页码
 * @param page
 */
const onFollowPageChange = (page: number) => {
  followSearchParams.value = {
    ...followSearchParams.value,
    current: page,
  };
};
const onFanPageChange = (page: number) => {
  fanSearchParams.value = {
    ...fanSearchParams.value,
    current: page,
  };
};

/**
 * 改变分页大小
 * @param size
 */
const onFollowPageSizeChange = (size: number) => {
  followSearchParams.value = {
    ...followSearchParams.value,
    pageSize: size,
  };
};
const onFanPageSizeChange = (size: number) => {
  fanSearchParams.value = {
    ...fanSearchParams.value,
    pageSize: size,
  };
};

/**
 * 获取验证码
 * @param email
 * @param op
 */
const getCaptcha = async (email: string, op: string) => {
  time.value = 60; // 设置倒计时时间为60秒
  intervalId.value = setInterval(() => {
    if (time.value > 0) {
      time.value--; // 每秒减少1
    } else {
      clearInterval(intervalId.value); // 清除计时器
      time.value = 0; // 重置倒计时时间
    }
  }, 1000); // 设置定时器，每1000毫秒（1秒）执行一次
  const res = await UserControllerService.getCaptchaUsingGet(email, op);
  if (res.code == 0) {
    message.success("发送成功，请注意查收");
    console.log("hh");
  } else {
    message.error("发送失败，请稍后再试，" + res.message);
  }
};

/**
 * 更新密码
 */
const handleUpdatePasswordSubmit = async () => {
  if (
    updatePasswordForm.value.newPassword.length < 8 ||
    updatePasswordForm.value.newPassword.length > 16
  ) {
    message.error("密码长度介于8~16位");
    return;
  }
  if (
    updatePasswordForm.value.checkPassword?.length !==
      updatePasswordForm.value.newPassword?.length ||
    updatePasswordForm.value.checkPassword !==
      updatePasswordForm.value.newPassword
  ) {
    message.error("两次输入密码不一致");
    return;
  }
  const res = await UserControllerService.updateUserPasswordUsingPost({
    captcha: updatePasswordForm.value.captcha,
    newPassword: updatePasswordForm.value.newPassword,
    checkPassword: updatePasswordForm.value.checkPassword,
  });
  if (res.code === 0) {
    message.success("修改密码成功");
    updatePasswordVisible.value = false;
  } else {
    message.error("修改密码失败，" + res.message);
  }
};

/**
 * 绑定邮箱
 */
const handleEmailBindSubmit = async () => {
  const res = await UserControllerService.userBindEmailUsingPost({
    captcha: emailForm.value.captcha,
    email: emailForm.value.eamil,
  });
  if (res.code === 0) {
    message.success("绑定成功");
    emailBindVisible.value = false;
    location.reload();
  } else {
    message.error("绑定失败，" + res.message);
  }
};

/**
 * 解绑邮箱
 */
const handleEmailUnBindSubmit = async () => {
  const res = await UserControllerService.userUnBindEmailUsingPost({
    captcha: emailForm.value.captcha,
    email: emailForm.value.eamil,
  });
  if (res.code === 0) {
    message.success("解绑成功");
    emailUnBindVisible.value = false;
    location.reload();
  } else {
    message.error("解绑失败，" + res.message);
  }
};

/**
 * 上传头像
 */
const uploadAvatar = async () => {
  const res = await FileControllerService.uploadFileUsingPost(
    file?.value.file,
    "user_avatar"
  );
  if (res.code === 0) {
    userAvatarImg = res.data;
    Message.success("上传成功，点击确认即可修改头像");
  } else {
    Message.error("上传失败！" + res.data);
  }
};

onMounted(async () => {
  const res =
    await AcceptedQuestionControllerService.getAcceptedQuestionDetailUsingGet();
  if (res.code == 0) {
    acceptedQuestionDetail.value = res.data;
  } else {
    Message.error("" + res.message);
  }
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
 * 图片文件更改函数
 * @param _
 * @param currentFile
 */
const onChange = async (_: never, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
  };
};
</script>

<style scoped>
#userInfoView {
  margin: 0 auto;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}

#userAcceptedQuestionDetail {
  margin: 0 auto;
  margin-top: 10px;
  height: 85px;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}
</style>