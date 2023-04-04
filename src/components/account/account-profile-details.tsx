import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAuthContext } from "@/contexts/auth-context";

export const AccountProfileDetails = () => {
  const { user }: any = useAuthContext();
  const [values, setValues] = useState({
    avatar: "",
    email: "",
    mobile: "",
    nickName: "",
    remark: "",
    sex: "",
    userName: "",
  });

  useEffect(() => {
    setValues(user);
  }, [user]);

  const handleChange = useCallback((event: any) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event: any) => {
    event.preventDefault();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="编辑个人资料详情" title="档案" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="登录名"
                  name="userName"
                  disabled
                  value={values.userName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="昵称"
                  name="nickName"
                  onChange={handleChange}
                  disabled
                  required
                  value={values.nickName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  disabled
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="电话"
                  disabled
                  name="mobile"
                  onChange={handleChange}
                  type="number"
                  value={values.mobile}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  label="简介"
                  name="remark"
                  onChange={handleChange}
                  value={values.remark}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  label="性别"
                  name="sex"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.sex}
                >
                  <option key={"0"} value={"0"}>
                    女
                  </option>
                  <option key={"1"} value={"1"}>
                    男
                  </option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        {/* <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained">更新</Button>
        </CardActions> */}
      </Card>
    </form>
  );
};
