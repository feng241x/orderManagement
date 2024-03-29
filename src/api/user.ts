import { Dayjs } from "dayjs";
import { myAxios } from ".";

function generateRequestUrl(action: string) {
  return `/system/user/${action}`;
}

/**
 * 用户数据列表
 * @param params
 * @returns
 */
export function userList(params: { createTimeFrom: Dayjs; createTimeTo: Dayjs }) {
  return myAxios.get(generateRequestUrl("listByParam"), {
    params,
  });
}

/**
 * 新增用户数据
 * @param params
 * @returns
 */
export function addUser(params: any) {
  return myAxios.post(generateRequestUrl("create"), params);
}

/**
 * 删除用户数据
 * @param params
 * @returns
 */
export function batchDelUser(userId: string) {
  return myAxios.post(generateRequestUrl("delete"), {
    userId,
  });
}

/**
 * 更新用户数据
 * @param params
 * @returns
 */
export function editUser(params: any) {
  return myAxios.post(generateRequestUrl("updateUserInfoByAdmin"), params);
}

/**
 * 重置用户密码
 * @param params
 * @returns
 */
export function resetPassword(userId: string) {
  return myAxios.post(generateRequestUrl("resetPassword"), {
    userId,
  });
}

/**
 * 更新用户密码
 * @param params
 * @returns
 */
export function changePassword(params: {
  newPassword: string;
  oldPassword: string;
  userId: number;
}) {
  return myAxios.post(generateRequestUrl("changePassword"), params);
}
