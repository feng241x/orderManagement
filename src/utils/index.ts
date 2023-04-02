// 设置请求 token
export function setToken(token?: string) {
  if (token) {
    localStorage.setItem("token", token);
  }
  // myAxios.defaults.headers.common['Auth_Token'] = `Bearer ${localStorage.getItem('token')}`;
}
/** 清除token */
export function removeToken() {
  localStorage.removeItem("token");
  // delete myAxios.defaults.headers.common['Auth_Token'];
}
/** 判断是否已登录 */
export function isAuthed(): boolean {
  // TODO
  return true;
}
