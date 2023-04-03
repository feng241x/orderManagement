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
import { addDept, batchDelDept, editDept, deptList } from "@/api/dept";
import { createResourceId } from "@/utils/create-resource-id";
import { queryRecycleEnum, queryRefundEnum, queryRoleScopeEnum } from "@/api/enumCommon";
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

  // 获取订单数据
  useEffect(() => {
    // 请求数据
    deptList({ createTimeFrom: startDate, createTimeTo: endDate }).then((result: any) => {
      setDatagridData(result);
    });
  }, [startDate, endDate]);
  // 获取枚举
  useEffect(() => {
    setTimeout(() => {
      queryRoleScopeEnum().then((result) => {
        // 定义列属性
        const defaultColumnsFields = [
          {
            field: "deptName",
            headerName: "部门名称",
            minWidth: 200,
            editable: true,
            required: true,
          },
          {
            field: "status",
            headerName: "状态",
            minWidth: 120,
            editable: true,
            type: "singleSelect",
            valueOptions: [
              { label: "禁用", value: "0" },
              { label: "启用", value: "1" },
            ],
            renderCell: ({ value }: any) => (
              <Chip
                label={value === "1" ? "启用" : "禁用"}
                color={value === "1" ? "success" : "default"}
                icon={value === "1" ? <CheckCircleSharpIcon /> : <CancelSharpIcon />}
              />
            ),
          },
          {
            field: "createTime",
            headerName: "创建时间",
            minWidth: 150,
            type: "dateTime",
            valueFormatter: ({ value }: any) => value && dayjs(value).format("YYYY/MM/DD HH:mm"),
          },
        ];
        setColumnsFields(defaultColumnsFields);
      });
    }, 100);
  }, []);
  // 更新编辑行数据
  const onChangeRowData = async (newData: any) => {
    return await editDept(newData);
  };
  // 新增订单
  const onAddRowData = (data: any) => {
    return addDept(data).then((result) => {
      setDatagridData(datagridData.concat([result]));
      return true;
    });
  };
  // 删除订单
  const onDelHandle = (ids: number[]) => {
    return batchDelDept(ids.join(","))
      .then((result) => {
        if (result) {
          setAlertState({
            ...alertState,
            open: true,
            severity: "success",
            message: "删除数据成功",
          });
        }
        setDatagridData(datagridData.filter((item: any) => !ids.includes(item["deptId"])));
        return true;
      })
      .catch((error) => {
        setAlertState({
          ...alertState,
          open: true,
          severity: "error",
          message: error.message,
        });
      });
  };
  const handleClose = () => {
    setAlertState({ ...alertState, open: false });
  };
  const { vertical, horizontal, open, message }: any = alertState;

  return (
    <>
      <Head>
        <title>部门管理 | 订单管理系统</title>
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
                <Typography variant="h4">部门管理</Typography>
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
              columnsFields={columnsFields}
              pageType={"dept"}
              datagridData={datagridData}
              onChangeRowData={onChangeRowData}
              onAddRowData={onAddRowData}
              onDelHandle={onDelHandle}
              getRowId={(item: any) => item["deptId"]}
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
            <Alert severity={alertState.severity}>{message}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
