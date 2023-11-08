// initial state
import { StoreOptions } from "vuex";
import AccessEnum from "@/access/AccessEnum";

export default {
  namespaced: true,
  //存储登录用户信息
  state: () => ({
    loginUser: {
      userName: "未登录",
      userRole: AccessEnum.NOT_LOGIN,
    },
  }),
  getters: {},
  actions: {
    //定义获取远程变量来更新用户信息的方法
    async getLoginUser({ commit, state }, payLoad) {
      // todo从远程请求获取登录用户信息
      commit("setLoginUser", payLoad);
    },
  },
  //定义更新登录用户的方法
  mutations: {
    setLoginUser(state, payLoad) {
      state.loginUser = payLoad;
    },
  },
} as StoreOptions<any>;
