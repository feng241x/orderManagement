import { Dayjs } from "dayjs";
import { myAxios } from ".";

function generateRequestUrl(action: string) {
  return `/system/dept/${action}`;
}

/**
 * 用户数据列表
 * @param params
 * @returns
 */
export function deptList(params?: any) {
  return myAxios.get(generateRequestUrl("list"), {
    params,
  });
}

/**
 * 新增订单数据
 * @param params
 * @returns
 */
export function addDept(params: any) {
  return myAxios.post(generateRequestUrl("add"), params);
}

/**
 * 删除订单数据
 * @param params
 * @returns
 */
export function batchDelDept(deptId: string) {
  return myAxios.post(generateRequestUrl("delete"), {
    deptId,
  });
}

/**
 * 更新订单数据
 * @param params
 * @returns
 */
export function editDept(params: any) {
  return myAxios.post(generateRequestUrl("update"), params);
}
