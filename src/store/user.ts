// initial state
import { StoreOptions } from "vuex";
import AccessEnum from "@/access/AccessEnum";
import { UserControllerService } from "../../generated";


export default {
  namespaced: true,
  //存储登录用户信息
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
  }),
  getters: {},
  actions: {
    //定义获取远程变量来更新用户信息的方法
    getLoginUser: async function ({ commit, state }, payLoad) {
      // 从远程请求获取登录用户信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("setLoginUser", res.data);
      } else {
        commit("setLoginUser", {
          ...state.loginUser,
          userRole: AccessEnum.NOT_LOGIN,
        });
      }
    },
  },
  //定义更新登录用户的方法
  mutations: {
    setLoginUser(state, payLoad) {
      state.loginUser = payLoad;
    },
  },
} as StoreOptions<any>;
