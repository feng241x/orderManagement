import React, { forwardRef, useState } from "react";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditDataGrid from "../sections/editorTable/";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const Alert = forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={3} ref={ref} variant="filled" {...props} />;
});

const now = dayjs();
const start = now.subtract(3, "day");

// 定义列属性
const columnsFields = [
  {
    field: "id",
    title: "平台单号",
    minWidth: 100,
    editable: true,
  },
  {
    field: "aliId",
    title: "支付宝账号",
    editable: true,
  },
  {
    field: "aliuserName",
    title: "支付宝户主",
    editable: true,
  },
  {
    field: "platform",
    title: "平台账号",
    editable: true,
  },
  {
    field: "'wechatAccount'",
    title: "微信号",
    editable: true,
  },
  {
    field: "trackingNumber",
    title: "物流单号",
    editable: true,
  },
  {
    field: "promotedProducts",
    title: "推广产品",
    editable: true,
  },
  {
    field: "recoveryState",
    title: "回收状态",
    editable: true,
  },
  {
    field: "refundState",
    title: "返款状态",
    editable: true,
  },
  {
    field: "promoter",
    title: "推广人",
  },
  {
    field: "createTime",
    title: "创建时间",
  },
  {
    field: "money",
    title: "金额",
    editable: true,
  },
];

const Page = () => {
  // 开始时间
  const [startDate, setStartDate] = useState(start);
  // 结束时间
  const [endDate, setEndDate] = useState(now);
  // 报错弹窗信息
  const [alertState, setAlertState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "请输入正确时间",
  });
  // 重新查询数据
  const searchDataHandle = () => {
    // 获取开始 结束时间
    const queryParams = {
      startDate,
      endDate,
    };
    console.log(JSON.stringify(queryParams));
  };
  const handleClose = () => {
    setAlertState({ ...alertState, open: false });
  };
  const { vertical, horizontal, open, message }: any = alertState;

  return (
    <>
      <Head>
        <title>订单管理 | 订单管理系统</title>
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
                <Typography variant="h4">订单管理</Typography>
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
                    <Button onClick={searchDataHandle} color="primary" variant="contained">
                      查询
                    </Button>
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Stack>
            <EditDataGrid columnsFields={columnsFields} />
          </Stack>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message={message}
            autoHideDuration={6000}
            key={vertical + horizontal}
          >
            <Alert severity="error">{message}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
