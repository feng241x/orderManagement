/**
 * 本文件只添加一些自定义的组合式的请求，如发起多个请求返回结果等，单个请求找到对应controller的文件去添加
 */
import axios from "axios";
import router from "next/router";
/** 全局默认的axios实例 */
export const myAxios = axios.create({
  baseURL: "http://localhost:8080/",
});

/** token header */
export function generateTokenHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return { Auth_Token: `Bearer ${token}` };
  }
  return null;
}

myAxios.interceptors.request.use(function (request: any) {
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
      router.push("/auth/login");
    } else {
      return Promise.reject(data);
    }
  }
});

/**
 * 登陆人信息查询
 * @returns 登陆人信息
 */
export function getInfo() {
  return myAxios.get("/getInfo");
}
