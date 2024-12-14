<template>
  <div id="userInfoView">
    <a-descriptions-item>
      <!--   头像展示   -->
      <a-avatar :size="100" shape="circle">
        <img alt="头像" :src="loginUser.userAvatar" />
      </a-avatar>
      <!--   关注列表展示按钮   -->
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
          @click="openFollowModal"
          >关注
        </a-button>
      </a-badge>
      <!--   粉丝列表展示按钮   -->
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
          @click="openFanModal"
          >粉丝
        </a-button>
      </a-badge>
    </a-descriptions-item>
    <!--  通过题目数排名  -->
    <a-card title="全站排名">
      <a-descriptions
        :data="userInfoColumns"
        size="large"
        column="1"
        bordered
      />
      <template #extra>
        <a-tooltip content="通过题目数排名">
          <a-badge status="processing" :text="acceptedQuestionRanking" />
        </a-tooltip>
      </template>
    </a-card>
    <!--  关注列表  -->
    <a-modal
      width="50%"
      :visible="followVisible"
      placement="right"
      @cancel="closeFollowModal"
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
          tooltip="请输入用户账号"
        >
          <a-input
            v-model="followSearchParams.userAccount"
            placeholder="请输入用户账号"
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
        :columns="followColumns"
        :data="followList"
        :pagination="{
          showTotal: true,
          pageSize: followSearchParams.pageSize,
          current: followSearchParams.current,
          total: followListTotal,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onFollowPageChange"
        @pageSizeChange="onFollowPageSizeChange"
      >
        <template #userAvatar="{ record }">
          <a-avatar :size="70" shape="circle" @click="goToUser(record.id)">
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
      @cancel="closeFanModal"
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
          tooltip="请输入用户账号"
        >
          <a-input
            v-model="fanSearchParams.userAccount"
            placeholder="请输入用户账号"
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
        :columns="fanColumns"
        :data="fanList"
        :pagination="{
          showTotal: true,
          pageSize: fanSearchParams.pageSize,
          current: fanSearchParams.current,
          total: fanListTotal,
          showJumper: true,
          showPageSize: true,
        }"
        @page-change="onFanPageChange"
        @pageSizeChange="onFanPageSizeChange"
      >
        <template #userAvatar="{ record }">
          <a-avatar :size="70" shape="circle" @click="goToUser(record.id)">
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
      @cancel="closeUpdatePersonalInfoModal"
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
        <a-form-item field="userName" label="昵称 :">
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
      @cancel="closeUpdatePasswordModal"
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
      @cancel="closeEmailBindModal"
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
      @cancel="closeEmailUnBindModal"
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
        @click="openUpdatePersonalInfoModal"
        >编辑个人资料
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openUpdatePasswordModal"
        >修改密码
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openEmailBindModal"
        v-if="!loginUser.email"
        >绑定邮箱
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openEmailUnBindModal"
        v-if="loginUser.email"
        >解绑邮箱
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
        <a-option v-for="year in years" :key="year">{{ year }}</a-option>
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
            <a-button
              type="text"
              shape="round"
              status="normal"
              size="medium"
              @click="openAddQuestionListModal"
              style="position: relative; top: 9px"
              >创建题单
            </a-button>
            <a-form
              :model="questionListSearchParams"
              layout="inline"
              style="
                position: absolute;
                top: 0;
                left: 80px;
                justify-content: center;
                align-content: center;
                margin: 25px;
              "
            >
              <a-form-item
                field="title"
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
              <template #actions>
                <icon-edit
                  @click="openUpdateQuestionListModal(item.id, item.title)"
                />
                <a-popconfirm
                  content="确定吗?"
                  type="error"
                  okText="是"
                  cancelText="否"
                  @cancel="
                    () => {
                      message.warning(`已取消`);
                    }
                  "
                  @ok="deleteQuestionList(item.id)"
                >
                  <icon-delete />
                </a-popconfirm>
              </template>
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
                  <span style="margin-left: 5px">
                    <a-popconfirm
                      content="确定吗?"
                      type="error"
                      okText="是"
                      cancelText="否"
                      @cancel="
                        () => {
                          message.warning(`已取消`);
                        }
                      "
                      @ok="deleteQuestionSolution(item.id)"
                    >
                      <icon-delete />
                    </a-popconfirm>
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
                  <template #actions>
                    <a-popconfirm
                      content="确定吗?"
                      type="error"
                      okText="是"
                      cancelText="否"
                      @cancel="
                        () => {
                          message.warning(`已取消`);
                        }
                      "
                      @ok="unCollectQuestionList(item.id)"
                    >
                      <icon-delete />
                    </a-popconfirm>
                  </template>
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
                      <a-typography-text bold @click="goToSolution(item.questionId, item.id)">
                        {{ item.title }}
                      </a-typography-text>
                    </template>
                    <template #description>
                      <a-typography-text ellipsis type="secondary" @click="goToSolution(item.questionId, item.id)"
                        >{{ item.content }}
                      </a-typography-text>
                      <a-overflow-list style="width: 500px" min="4" margin="8" @click="goToSolution(item.questionId, item.id)">
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
                      <span style="margin-left: 5px" @click="goToSolution(item.questionId, item.id)">
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
  <!-- 创建题单 -->
  <a-modal
    width="50%"
    :visible="addQuestionListVisible"
    placement="right"
    @cancel="closeAddQuestionListModal"
    @ok="addQuestionList"
    :ok-text="'创建'"
    unmountOnClose
    :closable="false"
  >
    <a-form
      :model="addQuestionListForm"
      label-align="right"
      title="创建题单"
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="title" label="题单标题 :">
        <a-input
          v-model="addQuestionListForm.title"
          placeholder="请输入题单标题"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 更新题单 -->
  <a-modal
    width="50%"
    :visible="updateQuestionListVisible"
    placement="right"
    @cancel="closeUpdateQuestionListModal"
    @ok="updateQuestionList"
    :ok-text="'更新'"
    unmountOnClose
    :closable="false"
  >
    <a-form
      :model="updateQuestionListForm"
      label-align="right"
      title="修改题单"
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="title" label="题单标题 :">
        <a-input
          v-model="updateQuestionListForm.title"
          placeholder="请输入题单标题"
        />
      </a-form-item>
    </a-form>
  </a-modal>
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
          <template #actions>
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
          <template #actions>
            <a-popconfirm
              content="确定要删除此题目吗?"
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
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { onMounted, ref, watchEffect } from "vue";
import { FileItem, Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { UserUpdateMyRequest } from "../../../generated/models/UserUpdateMyRequest";
import {
  FileControllerService,
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

document.title = "个人";

const router = useRouter();
const store = useStore();

// 获取登录用户
let loginUser = store.state.user.loginUser;
// 个人信息所展示的列
const userInfoColumns = [
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

// 编辑个人资料的表单对象
const updatePersonalInfoForm = ref<UserUpdateMyRequest>({
  ...store.state.user?.loginUser,
});

// 通过题目排名
const acceptedQuestionRanking = ref(1);

// 头像
const file = ref();
let userAvatarImg = updatePersonalInfoForm.value.userAvatar;

// 关注分页
const followTableRef = ref();
const followList = ref([]);
const followListTotal = ref(0);
const followSearchParams = ref({
  userName: "",
  userAccount: "",
  pageSize: 10,
  current: 1,
});
const followColumns = [
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

// 粉丝分页
const fanTableRef = ref();
const fanList = ref([]);
const fanListTotal = ref(0);
const fanSearchParams = ref({
  userName: "",
  userAccount: "",
  pageSize: 10,
  current: 1,
});
const fanColumns = [
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

// 题单分页
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
// 创建题单的表单对象
const addQuestionListForm = ref({
  title: "",
});
// 更新题单的表单对象
const updateQuestionListForm = ref({
  id: 0,
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

// 收藏题单分页
const collectQuestionList = ref([]);
const collectQuestionListTotal = ref(0);
const collectQuestionListSearchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "ascend",
  userId: loginUser.id,
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

// 修改密码的表单对象
const updatePasswordForm = ref({
  captcha: "",
  checkPassword: "",
  newPassword: "",
  eamil: loginUser.email,
});

// 验证码相关
const tip = ref("获取验证码");
const time = ref(0);
const intervalId = ref();
let emailRegex = new RegExp(
  "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$"
);

// 邮箱相关的表单对象
const emailForm = ref({
  captcha: "",
  eamil: loginUser.email,
});

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
  userId: loginUser.id,
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
  userId: loginUser.id,
  solutionId: null,
});

// 弹窗是否可见
const updatePersonalInfoVisible = ref(false);
const followVisible = ref(false);
const fanVisible = ref(false);
const updatePasswordVisible = ref(false);
const emailBindVisible = ref(false);
const emailUnBindVisible = ref(false);
const actualQuestionsVisible = ref(false);
const addQuestionListVisible = ref(false);
const updateQuestionListVisible = ref(false);
const actualCollectQuestionsVisible = ref(false);

// 打开弹窗
const openUpdatePersonalInfoModal = () => {
  updatePersonalInfoVisible.value = true;
};
const openFollowModal = () => {
  followVisible.value = true;
  getFollow();
};
const openFanModal = () => {
  fanVisible.value = true;
  getFan();
};
const openUpdatePasswordModal = () => {
  updatePasswordVisible.value = true;
};

const openEmailBindModal = () => {
  emailBindVisible.value = true;
};

const openEmailUnBindModal = () => {
  emailUnBindVisible.value = true;
};

const openActualQuestionsModal = (id: number) => {
  questionListId.value = id;
  actualQuestionsVisible.value = true;
  getQuestionsByQuestionListId(id);
};
const openAddQuestionListModal = () => {
  addQuestionListVisible.value = true;
};
const openUpdateQuestionListModal = (id: number, title: string) => {
  updateQuestionListVisible.value = true;
  updateQuestionListForm.value.id = id;
  updateQuestionListForm.value.title = title;
};
const openActualCollectQuestionsModal = (id: number) => {
  actualCollectQuestionsVisible.value = true;
  getCollectQuestionsByCollectQuestionListId(id);
};
// 关闭弹窗
const closeUpdatePersonalInfoModal = () => {
  updatePersonalInfoVisible.value = false;
};
const closeFollowModal = () => {
  followVisible.value = false;
};
const closeFanModal = () => {
  fanVisible.value = false;
};
const closeUpdatePasswordModal = () => {
  updatePasswordVisible.value = false;
};
const closeEmailBindModal = () => {
  emailBindVisible.value = false;
};
const closeEmailUnBindModal = () => {
  emailUnBindVisible.value = false;
};
const closeActualQuestionsModel = () => {
  actualQuestionsVisible.value = false;
};
const closeAddQuestionListModal = () => {
  addQuestionListVisible.value = false;
};
const closeUpdateQuestionListModal = () => {
  updateQuestionListVisible.value = false;
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
    max: 100,
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
      range: "2024",
      cellSize: ["auto", 16],
    },
  ],
  series: [
    {
      type: "heatmap",
      coordinateSystem: "calendar",
      calendarIndex: 0,
      data: Object.entries(submitDetail.value.submitDetail),
    },
  ],
});

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
 * 获取个人通过题目数排名
 */
const getAcceptedQuestionRanking = async () => {
  const res =
    await AcceptedQuestionControllerService.getAcceptedQuestionRankingUsingGet();
  if (res.code == 0) {
    acceptedQuestionRanking.value = res.data as number;
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
    followList.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const isFollow = await FollowControllerService.isFollowUsingGet(x.id);
        return { ...x, isFollow: isFollow.data };
      })
    )) as [];
    followListTotal.value = res.data.total;
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
    fanList.value = (await Promise.all(
      res.data.records.map(async (x: any) => {
        const isFollow = await FollowControllerService.isFollowUsingGet(x.id);
        return { ...x, isFollow: isFollow.data };
      })
    )) as [];
    fanListTotal.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

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

/**
 * 获取通过题目详情
 */
const getAcceptedQuestionDetail = async () => {
  const res =
    await AcceptedQuestionControllerService.getAcceptedQuestionDetailUsingGet(loginUser.id);
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
    await QuestionSubmitControllerService.getPersonSubmitDetailUsingGet(loginUser.id);
  if (res.code === 0) {
    console.log(submitDetail.value.submitDetail);
    submitDetail.value = res.data;
    hotMap.value.series[0].data = Object.entries(res.data?.submitDetail);
    years.value = Object.keys(res.data?.years) as never[];
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
      questionListSearchParams.value
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
 * 创建题单
 */
const addQuestionList = async () => {
  const res = await QuestionListControllerService.addQuestionListUsingPost(
    addQuestionListForm.value
  );
  if (res.code === 0) {
    message.success("创建成功");
    addQuestionListVisible.value = false;
    location.reload();
  } else {
    message.error("创建失败，" + res.message);
  }
};

/**
 * 更新题单
 */
const updateQuestionList = async () => {
  const res = await QuestionListControllerService.updateQuestionListUsingPost(
    updateQuestionListForm.value
  );
  if (res.code === 0) {
    message.success("更新成功");
    updateQuestionListVisible.value = false;
    location.reload();
  } else {
    message.error("更新失败，" + res.message);
  }
};

/**
 * 删除题单
 */
const deleteQuestionList = async (id: number) => {
  const res = await QuestionListControllerService.deleteQuestionListUsingPost(
    id
  );
  if (res.code === 0) {
    message.success("删除成功");
    location.reload();
  } else {
    message.error("删除失败，" + res.message);
  }
};

/**
 * 删除题单中的题目
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
 * 获取收藏的题单
 */
const getCollectQuestionList = async () => {
  const res =
    await QuestionListCollectControllerService.listQuestionListCollectByPageUserUsingPost(
      collectQuestionListSearchParams.value
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
 * 取消收藏题单
 */
const unCollectQuestionList = async (questionListId: number) => {
  const res =
    await QuestionListCollectControllerService.deleteQuestionListCollectUsingPost(
      {
        questionListId: questionListId,
      }
    );
  if (res.code === 0) {
    message.success("取消收藏成功");
  } else {
    message.error("取消收藏失败，" + res.message);
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
 * 获取收藏的题解
 */
const getCollectQuestionSolutionList = async () => {
  const res =
    await QuestionSolutionCollectControllerService.listQuestionSolutionCollectByPageUserUsingPost(
      collectQuestionSolutionListSearchParams.value
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

const deleteQuestionSolution = async (id) => {
  const res =
    await QuestionSolutionControllerService.deleteQuestionSolutionUsingPost({
      id: id,
    });
  if(res.code == 0){
    message.success("删除成功");
    await getQuestionSolutionList();
  }else{
    message.success("删除失败，"+res.message);
  }
};

onMounted(async () => {
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
  getFollow();
});
watchEffect(() => {
  getFan();
});
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
 * 图片文件更改函数
 * @param _
 * @param currentFile
 */
const onChange = async (_: never, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
  };
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
  if(userId != loginUser.id){
    router.push({
      path: `/_userInfo/${userId}`,
    });
  }
};
</script>

<style scoped>
#userInfoView {
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
