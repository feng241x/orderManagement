import React, { forwardRef, useContext, useEffect, useCallback, useState } from "react";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditDataGrid from "../sections/editorTable/";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { addUser, batchDelUser, editUser, resetPassword, userList } from "@/api/user";
import { GridActionsCellItem, GridPreProcessEditCellProps } from "@mui/x-data-grid";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import { deptList } from "@/api/dept";
import LockResetSharpIcon from "@mui/icons-material/LockResetSharp";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { queryRoleEnum } from "@/api/enumCommon";

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
  const stateManagement = (userId: number) => {};
  // 获取订单数据
  useEffect(() => {
    // 请求数据
    userList({ createTimeFrom: startDate, createTimeTo: endDate }).then((result: any) => {
      setDatagridData(result || []);
    });
  }, [startDate, endDate]);
  useEffect(() => {
    const rootPassword = (userId: string) => {
      resetPassword(userId)
        .then((result: any) => {
          setAlertState({
            ...alertState,
            open: true,
            severity: "success",
            message: `账号密码已重置为${result}`,
          });
        })
        .catch((error: any) => {
          setAlertState({
            ...alertState,
            open: true,
            severity: "error",
            message: error.message,
          });
        });
    };
    Promise.all([queryRoleEnum(), deptList()]).then((result) => {
      const [queryRoleDataList, deptDataList]: any = result;
      // 定义列属性
      const defaultColumnsFields = [
        {
          field: "userName",
          width: 120,
          headerName: "账号",
          required: true,
        },
        {
          field: "nickName",
          width: 120,
          headerName: "姓名",
          editable: true,
        },
        {
          field: "deptId",
          headerName: "部门名称",
          editable: true,
          width: 150,
          type: "singleSelect",
        },
        {
          field: "roleId",
          headerName: "角色",
          editable: true,
          width: 150,
          type: "singleSelect",
        },
        {
          field: "email",
          headerName: "邮箱",
          width: 150,
          editable: true,
          preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            const hasError = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
              params.props.value
            );
            return { ...params.props, error: !hasError };
          },
          regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
          errorMsg: "请输入正确的邮箱格式",
        },
        {
          field: "mobile",
          headerName: "手机",
          minWidth: 120,
          editable: true,
          preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            const hasError = /^1[3-9]\d{9}$/.test(params.props.value);
            return { ...params.props, error: !hasError };
          },
          regex: /^1[3-9]\d{9}$/,
          errorMsg: "请输入正确的手机号",
        },
        {
          field: "remark",
          headerName: "备注",
          editable: true,
          minWidth: 200,
        },
        {
          field: "sex",
          headerName: "性别",
          editable: true,
          type: "singleSelect",
          valueOptions: [
            { label: "女", value: "0" },
            { label: "男", value: "1" },
          ],
          renderCell: ({ value }: any) => (value === "1" ? "男" : "女"),
        },
        {
          field: "status",
          headerName: "状态",
          minWidth: 120,
          editable: true,
          required: true,
          type: "singleSelect",
          valueOptions: [
            { label: "启用", value: "0" },
            { label: "禁用", value: "1" },
          ],
          renderCell: ({ value }: any) => (
            <Chip
              label={value === "0" ? "启用" : "禁用"}
              color={value === "0" ? "success" : "default"}
              icon={value === "0" ? <CheckCircleSharpIcon /> : <CancelSharpIcon />}
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
        {
          field: "actions",
          type: "actions",
          width: 80,
          getActions: (params: any) => [
            // <GridActionsCellItem
            //   key={"stateManagement"}
            //   icon={params.status === "0" ? <ToggleOffIcon /> : <ToggleOnIcon />}
            //   label={params.status === "0" ? "启用" : "禁用"}
            //   onClick={() => stateManagement(params.id)}
            // />,
            <GridActionsCellItem
              key={"resetPassword"}
              icon={<LockResetSharpIcon />}
              label="重置密码"
              onClick={() => rootPassword(params.id)}
            />,
          ],
        },
      ];
      // 更新回收状态枚举
      const deptListEnum: any = defaultColumnsFields.find((item) => item["field"] === "deptId");
      Object.assign(deptListEnum, {
        valueOptions: deptDataList?.map((item: any) => ({
          value: item["deptId"],
          label: item["deptName"],
        })),
      });
      // 更新角色枚举
      const queryRoleScopeEnum: any = defaultColumnsFields.find(
        (item) => item["field"] === "roleId"
      );
      Object.assign(queryRoleScopeEnum, {
        valueOptions: queryRoleDataList?.map((item: any) => ({
          value: item["code"],
          label: item["name"],
        })),
      });
      setColumnsFields(defaultColumnsFields);
    });
    // 在这里调用 rootPassword 函数
  }, [alertState]);
  // 更新编辑行数据
  const onChangeRowData = async (newData: any) => {
    return await editUser(newData);
  };
  // 新增
  const onAddRowData = (data: any) => {
    return addUser(data).then((result) => {
      setDatagridData(datagridData.concat([result]));
      return true;
    });
  };
  // 删除
  const onDelHandle = (ids: number[]) => {
    return batchDelUser(ids.join(","))
      .then((result) => {
        if (result) {
          setAlertState({
            ...alertState,
            open: true,
            severity: "success",
            message: "删除数据成功",
          });
        }
        setDatagridData(datagridData.filter((item: any) => !ids.includes(item["userId"])));
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
        <title>用户管理 | 订单管理系统</title>
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
                <Typography variant="h4">用户管理</Typography>
              </Stack>
            </Stack>
            <EditDataGrid
              columnsFields={columnsFields}
              pageType={"user"}
              datagridData={datagridData}
              onChangeRowData={onChangeRowData}
              onAddRowData={onAddRowData}
              onDelHandle={onDelHandle}
              getRowId={(item: any) => item["userId"]}
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
