import router from "@/router";
// import store from '@/store'
import axios, { AxiosRequestConfig, Method } from "axios";

// 定义接口
interface PendingType {
  url?: string;
  method?: Method | string;
  params: any;
  data: any;
  cancel: any;
}
// 请求失败后的错误统一处理

const errorHandle = (status: number, other: string) => {
  switch (status) {
    case 302:
      console.log("接口重定向了！");
      break;
    case 400:
      console.log(
        "发出的请求有错误，服务器没有进行新建或修改数据的操作==>" + status
      );
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401: // 重定向
      // console.log('token:登录失效==>' + status + ':' + store.state.Roles)
      // localStorage.remove(store.state.Roles)
      // localStorage.get(store.state.Roles)
      router.replace({
        path: "/Login",
      });
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      console.log("登录过期,用户得到授权，但是访问是被禁止的==>" + status);
      // store.commit('token', null);
      setTimeout(() => {
        router.replace({
          path: "/Login",
        });
      }, 1000);
      break;
    case 404:
      console.log("网络请求不存在==>" + status);
      break;
    case 406:
      console.log("请求的格式不可得==>" + status);
      break;
    case 408:
      console.log(" 请求超时！");
      break;
    case 410:
      console.log("请求的资源被永久删除，且不会再得到的==>" + status);
      break;
    case 422:
      console.log("当创建一个对象时，发生一个验证错误==>" + status);
      break;
    case 500:
      console.log("服务器发生错误，请检查服务器==>" + status);
      break;
    case 502:
      console.log("网关错误==>" + status);
      break;
    case 503:
      console.log("服务不可用，服务器暂时过载或维护==>" + status);
      break;
    case 504:
      console.log("网关超时==>" + status);
      break;
    default:
      console.log("其他错误错误==>" + other);
  }
};

// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    // 当前请求在数组中存在时执行函数体
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel("操作太频繁，请稍后再试");
      // 从数组中移除记录
      pending.splice(item, 1);
    }
  }
};

// 1.实例化请求配置
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 3000,
  headers: {
    // php 的 post 传输请求头一定要这个 不然报错 接收不到值
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin-Type": "*",
  },
});

// 2.请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在请求之前做什么
    console.log("interceptors request : ", config);
    removePending(config);
    config.cancelToken = new CancelToken((c) => {
      pending.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c,
      });
    });
    // if(localStorage.get(store.state.Roles)) {
    //   config.headers.Authorization = localStorage.get(store.state.Roles);
    // }
    return config;
  },
  (error) => {
    // 请求错误时做些什么～
    return Promise.reject(error);
  }
);

// 3.响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应的数据做什么～
    console.log("response : ", response);
    removePending(response.config);
    // 请求成功
    if (response.status === 200 || response.status === 204) {
      return Promise.resolve(response.data.data); //过滤数据，不将状态码传给请求接口
    } else {
      return Promise.reject(response);
    }
    // return response
  },
  (error) => {
    const { response } = error;
    if (response) {
      errorHandle(response.status, response.data.message);

      // 超时重新请求
      const config = error.config;
      // 全局的请求次数,请求的间隙
      const [RETRY_COUNT, RETRY_DELAY] = [3, 1000];

      if (config && RETRY_COUNT) {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 0;
        // 检查是否已经把重试的总数用完
        if (config.__retryCount >= RETRY_COUNT) {
          return Promise.reject(response || { message: error.message });
        }
        // 增加重试计数
        config.__retryCount++;
        // 创造新的Promise来处理指数后退
        const backoff = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, RETRY_DELAY || 1);
        });
        // instance重试请求的Promise
        return backoff.then(() => {
          return instance(config);
        });
      }

      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 后续增加断网情况下做的一些操作
      // store.commit('networkState', false);
    }
    // return Promise.reject(error)
  }
);

export default instance;
