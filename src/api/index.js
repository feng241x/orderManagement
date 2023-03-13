/**
 * 本文件只添加一些自定义的组合式的请求，如发起多个请求返回结果等，单个请求找到对应controller的文件去添加
 */
import axios from "axios";

/** 全局默认的axios实例 */
export const myAxios = axios.create({
  baseURL: "/api",
});

myAxios.interceptors.request.use(function (request) {
  if (request.withCredentials !== false) {
    const tokenHeader = generateTokenHeader();
    if (tokenHeader) {
      request.headers
        ? Object.assign(request.headers, tokenHeader)
        : (request.headers = tokenHeader);
    }
  }
  return request;
});

// response 拦截处理
myAxios.interceptors.response.use(function (response) {
  const data = response.data;
  // 下载文件请求兼容
  if (response.config.responseType === "blob" && response.status === 200) {
    return response;
  }
  if (data?.code === "0") {
    return data.data;
  } else {
    if (data.code === "401") {
      if (!hasExpiredPop && !isLoginPage) {
        const url = response.config.url;
        if (url?.indexOf("/getInfo") > -1 || url?.indexOf("getRouters") > -1) {
          // 暂定这两个请求为界面初始加载需要的请求，直接跳转到登录界面，不需要弹框
        } else {
          hasExpiredPop = true;
          // 未登录
          Modal.confirm({
            content: "检测到未登录，是否跳转到登录界面？",
            onOk() {
              hasExpiredPop = false;
            },
            onCancel() {
              hasExpiredPop = false;
            },
          });
        }
      }
    } else {
      notification.error({
        message: data.message || "请求出错",
      });
    }
    return Promise.reject(data);
  }
});

/**
 * 登陆人信息查询
 * @returns 登陆人信息
 */
export function getInfo() {
  return myAxios.get("/getInfo");
}
