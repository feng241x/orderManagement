import { Dayjs } from "dayjs";
import { myAxios } from ".";

function generateRequestUrl(action: string) {
  return `/system/oOrder/${action}`;
}

/**
 * 订单数据列表
 * @param params
 * @returns
 */
export function orderList(params: { createTimeFrom: Dayjs; createTimeTo: Dayjs }) {
  return myAxios.get(generateRequestUrl("list"), {
    params,
  });
}

/**
 * 新增订单数据
 * @param params
 * @returns
 */
export function addOrder(params: any) {
  return myAxios.post(generateRequestUrl("add"), params);
}

/**
 * 删除订单数据
 * @param params
 * @returns
 */
export function batchDelOrder(idList: string) {
  return myAxios.get(generateRequestUrl(`batchDel/${idList}`));
}

/**
 * 更新订单数据
 * @param params
 * @returns
 */
export function editOrder(params: any) {
  return myAxios.post(generateRequestUrl("edit"), params);
}

/**
 * 导入订单数据
 * @param params
 * @returns
 */
export function importExcel(file: any) {
  const formData = new FormData();
  formData.append("file", file);
  return myAxios.post(generateRequestUrl("importExcel"), formData);
}

/**
 * 下载订单导入模板
 * @param params
 * @returns
 */
export function exportExcelTemplate() {
  return myAxios.get(generateRequestUrl("exportExcelTemplate"), {
    params: {},
    responseType: "blob",
  });
}
