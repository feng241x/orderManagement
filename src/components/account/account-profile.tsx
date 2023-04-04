import * as React from "react";
import { useAuthContext } from "@/contexts/auth-context";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePassword } from "@/api/user";

export const AccountProfile = () => {
  const {
    user: { avatar, email, mobile, nickName, remark, sex, userName, userId },
  }: any = useAuthContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValues, setInputValues] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const { handleSubmit, formState } = useForm();
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues: any) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };
  // 报错弹窗信息
  const [alertState, setAlertState] = useState<any>({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "请输入正确时间",
    severity: "error",
  });
  const handleInputBlur = (name: any) => {
    // 有验证规则的字段进行验证
    if (["newPassword", "newPassword2"].includes(name)) {
      // 新密码是否一致
      if (inputValues["newPassword"] !== inputValues["newPassword2"]) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          newPassword: "密码设置不一致，请检查！",
          newPassword2: "密码设置不一致，请检查！",
        }));
      } else {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [`${"newPassword".replace("inputValue", "errorText")}`]: "",
          [`${"newPassword2".replace("inputValue", "errorText")}`]: "",
        }));
      }
      return;
    }
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleClose = () => {
    setAlertState({ ...alertState, open: false });
  };

  // 提交新建表单
  const onSubmit = async (data: any) => {
    changePassword({
      userId: userId,
      oldPassword: inputValues["oldPassword"],
      newPassword: inputValues["newPassword"],
    })
      .then((result: any) => {
        //  关闭弹窗
        handleDialogClose();
        if (result) {
          setAlertState({
            ...alertState,
            open: true,
            severity: "success",
            message: "更新密码成功",
          });
        }
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
  const { vertical, horizontal, open, message }: any = alertState;
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {nickName}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {userName} {mobile}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {remark}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth onClick={handleClickOpen} variant="text">
          修改密码
        </Button>
      </CardActions>

      <Dialog fullWidth={true} open={openDialog} onClose={handleDialogClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>修改密码</DialogTitle>
          <DialogContent>
            <DialogContentText>请记住密码</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="oldPassword"
              label="旧密码"
              type="password"
              fullWidth
              variant="standard"
              value={inputValues["oldPassword"]}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur("oldPassword")}
              error={inputValues["oldPassword"] && Boolean(errors["oldPassword"])}
              helperText={inputValues["oldPassword"] && errors["oldPassword"]}
            />
            <TextField
              autoFocus
              margin="dense"
              name="newPassword"
              label="新密码"
              type="password"
              fullWidth
              variant="standard"
              value={inputValues["newPassword"]}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur("newPassword")}
              error={inputValues["newPassword"] && Boolean(errors["newPassword"])}
              helperText={inputValues["newPassword"] && errors["newPassword"]}
            />
            <TextField
              autoFocus
              margin="dense"
              name="newPassword2"
              label="再次确认新密码"
              type="password"
              fullWidth
              variant="standard"
              value={inputValues["newPassword2"]}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur("newPassword2")}
              error={inputValues["newPassword2"] && Boolean(errors["newPassword2"])}
              helperText={inputValues["newPassword2"] && errors["newPassword2"]}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>取消</Button>
            <Button type="submit">提交</Button>
          </DialogActions>
        </form>
      </Dialog>
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
    </Card>
  );
};
