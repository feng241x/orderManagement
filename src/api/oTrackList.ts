import { Dayjs } from "dayjs";
import { myAxios } from ".";

function generateRequestUrl(action: string) {
  return `/system/oTrack/${action}`;
}

/**
 * 物流数据列表
 * @param params
 * @returns
 */
export function oTrackList(params: { createTimeFrom: Dayjs; createTimeTo: Dayjs }) {
  return myAxios.get(generateRequestUrl("list"), {
    params,
  });
}

/**
 * 新增订单数据
 * @param params
 * @returns
 */
export function addOTrack(params: any) {
  return myAxios.post(generateRequestUrl("add"), params);
}

/**
 * 删除订单数据
 * @param params
 * @returns
 */
export function batchDelOTrack(idList: string) {
  return myAxios.get(generateRequestUrl(`batchDel/${idList}`));
}

/**
 * 更新订单数据
 * @param params
 * @returns
 */
export function editOTrack(params: any) {
  return myAxios.post(generateRequestUrl("edit"), params);
}

/**
 * 导入订单数据
 * @param params
 * @returns
 */
export function oTrackListImport(file: any) {
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
