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
 * 新增订单数据
 * @param params
 * @returns
 */
export function addUser(params: any) {
  return myAxios.post(generateRequestUrl("create"), params);
}

/**
 * 删除订单数据
 * @param params
 * @returns
 */
export function batchDelUser(idList: string) {
  return myAxios.get(generateRequestUrl(`delete/${idList}`));
}

/**
 * 更新订单数据
 * @param params
 * @returns
 */
export function editUser(params: any) {
  return myAxios.post(generateRequestUrl("updateUserInfoByAdmin"), params);
}
