import { myAxios } from ".";

function generateRequestUrl(action: string) {
  return `/system/enumCommon/${action}`;
}

/**
 * 回收张台类型枚举获取
 * @param params
 * @returns
 */
export function queryRecycleEnum() {
  return myAxios.get(generateRequestUrl("queryRecycleEnum"));
}

/**
 * 返款状态枚举获取
 * @param params
 * @returns
 */
export function queryRefundEnum() {
  return myAxios.get(generateRequestUrl("queryRefundEnum"));
}

/**
 * 角色枚举获取
 * @param params
 * @returns
 */
export function queryRoleEnum() {
  return myAxios.get(generateRequestUrl("queryRoleEnum"));
}
