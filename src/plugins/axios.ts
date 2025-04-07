import axios from "axios";
import { OpenAPI } from "../../generated";

// 携带凭证
OpenAPI.WITH_CREDENTIALS = true;
// 区分多环境
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8504"
    : "https://gateway.luooj.icu";

OpenAPI.BASE = baseUrl;
console.log("当前环境：", process.env.NODE_ENV, "请求地址", baseUrl);
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 假设token存在localStorage中
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    console.log(response.data);
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
