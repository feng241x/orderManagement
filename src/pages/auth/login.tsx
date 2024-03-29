import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useAuth } from "@/hooks/use-auth";
import { Layout as AuthLayout } from "@/layouts/auth/layout";
import { myAxios } from "@/api";
import { setToken } from "@/utils";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState("login");
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required("请输入账号信息"),
      password: Yup.string().max(255).required("请输入密码"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.username, values.password).then((result: boolean) => {
          if (result) router.push("/orderManagement");
        });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event: any, value: any) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>订单管理系统</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          mt: -20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">订单管理系统</Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="登录" value="login" />
            </Tabs>
            {method === "login" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.username && formik.errors.username)}
                    fullWidth
                    helperText={formik.touched.username && formik.errors.username}
                    label="账号"
                    name="username"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="input"
                    value={formik.values.username}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="密码"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                  登录
                </Button>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <AuthLayout>{page}</AuthLayout>;

export default Page;
