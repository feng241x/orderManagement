import React, { forwardRef, useContext, useEffect, useReducer, useState } from "react";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditDataGrid from "../sections/editorTable";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { AuthContext, useAuthContext } from "@/contexts/auth-context";
import {
  addOTrack,
  batchDelOTrack,
  editOTrack,
  exportExcelTemplate,
  oTrackList,
} from "@/api/oTrackList";
import { createResourceId } from "@/utils/create-resource-id";
import { queryRecycleEnum, queryRefundEnum } from "@/api/enumCommon";
import { GridPreProcessEditCellProps } from "@mui/x-data-grid";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

const Alert = forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={3} ref={ref} variant="filled" {...props} />;
});

const now = dayjs();
const start = now.subtract(3, "day");

const Page = () => {
  const [datagridData, setDatagridData] = useState<any>([]);
  // 开始时间
  const [startDate, setStartDate] = useState<any>(start);
  // 结束时间
  const [endDate, setEndDate] = useState<any>(now);
  // 报错弹窗信息
  const [alertState, setAlertState] = useState<any>({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "请输入正确时间",
    severity: "error",
  });
  const [columnsFields, setColumnsFields] = useState<any>([]);
  const DownloadTemplateFile = (download: any) => {
    exportExcelTemplate().then((response) => {
      download(response);
    });
  };
  // 获取订单数据
  useEffect(() => {
    // 请求数据
    oTrackList({ createTimeFrom: startDate, createTimeTo: endDate }).then((result: any) => {
      setDatagridData(result);
    });
  }, [startDate, endDate]);
  // 获取枚举
  useEffect(() => {
    queryRecycleEnum().then((result: any) => {
      // 定义列属性
      const defaultColumnsFields = [
        {
          field: "trackingNum",
          headerName: "物流单号",
          minWidth: 300,
          editable: true,
          required: true,
        },
        {
          field: "recycleStatus",
          headerName: "回收状态",
          editable: true,
          required: true,
          valueOptions: [],
          minWidth: 200,
          type: "singleSelect",
          renderCell: ({ value }: any) => (
            <Chip
              label={result.find((item: any) => item["code"] === value)["name"]}
              color={value ? "success" : "default"}
              icon={value ? <CheckCircleSharpIcon /> : <CancelSharpIcon />}
            />
          ),
        },
        {
          field: "createBy",
          headerName: "录入人",
          minWidth: 200,
        },
        {
          field: "createTime",
          headerName: "录入时间",
          minWidth: 200,
          type: "dateTime",
          valueFormatter: ({ value }: any) => value && dayjs(value).format("YYYY/MM/DD HH:mm"),
        },
      ];
      // 更新回收状态枚举
      const recycleStatus: any = defaultColumnsFields.find(
        (item) => item["field"] === "recycleStatus"
      );
      Object.assign(recycleStatus, {
        valueOptions: result?.map((item: any) => ({
          value: item["code"],
          label: item["name"],
        })),
      });
      setColumnsFields(defaultColumnsFields);
    });
  }, []);
  // 更新编辑行数据
  const onChangeRowData = async (newData: any) => {
    return await editOTrack(newData);
  };
  // 新增订单
  const onAddRowData = (data: any) => {
    return addOTrack(data).then((result) => {
      setDatagridData(datagridData.concat([result]));
      return true;
    });
  };
  // 删除订单
  const onDelHandle = (ids: number[]) => {
    return batchDelOTrack(ids.join(",")).then((result) => {
      if (result) {
        setAlertState({
          ...alertState,
          open: true,
          severity: "success",
          message: "删除数据成功",
        });
      }
      setDatagridData(datagridData.filter((item: any) => !ids.includes(item["id"])));
      return true;
    });
  };
  const handleClose = () => {
    setAlertState({ ...alertState, open: false });
  };
  const { vertical, horizontal, open, message }: any = alertState;

  return (
    <>
      <Head>
        <title>物流单管理 | 订单管理系统</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={3}>
                <Typography variant="h4">物流单管理</Typography>
                <Stack alignItems="center" direction="row" spacing={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"zh-cn"}>
                    <DatePicker
                      label="开始时间"
                      value={startDate}
                      onChange={(newValue: any) => {
                        if (dayjs(newValue).diff(endDate) > 0) {
                          setAlertState({
                            ...alertState,
                            open: true,
                            message: "开始时间不能大于结束时间!",
                          });
                          return;
                        }
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                      label="结束时间"
                      value={endDate}
                      onChange={(newValue: any) => {
                        if (dayjs(newValue).diff(startDate) < 0) {
                          setAlertState({
                            ...alertState,
                            open: true,
                            message: "结束时间不能小于开始时间!",
                          });
                          return;
                        }
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {/* <Button onClick={searchDataHandle} color="primary" variant="contained">
                      查询
                    </Button> */}
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Stack>
            <EditDataGrid
              pageType="trackingNumber"
              columnsFields={columnsFields}
              datagridData={datagridData}
              onChangeRowData={onChangeRowData}
              onAddRowData={onAddRowData}
              onDelHandle={onDelHandle}
              DownloadTemplateFile={DownloadTemplateFile}
            />
          </Stack>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message={message}
            autoHideDuration={6000}
            key={vertical + horizontal}
          >
            <Alert sx={{ color: "#fff" }} severity={alertState.severity}>
              {message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
