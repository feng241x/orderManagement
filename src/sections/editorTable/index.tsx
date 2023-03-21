import * as React from "react";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Mock from "mockjs";
import { Button, SvgIcon } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useForm } from "react-hook-form";
import {
  zhCN,
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const Random = Mock.Random;

const useFakeMutation = () => {
  return React.useCallback(
    (newRow: any, oldRow: any) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (newRow.name?.trim() === "") {
            reject(new Error("Error while saving user: name can't be empty."));
          } else {
            resolve({ ...newRow, name: newRow.name?.toUpperCase() });
          }
        }, 200);
      }),
    []
  );
};

interface EditDataGridProp {
  columnsFields: any[];
}

export default function EditDataGrid(opts: EditDataGridProp) {
  const [columns, setColumns] = useState([]);
  const { columnsFields } = opts;
  // 新增订单弹窗状态管理
  const [openDialog, setOpenDialog] = React.useState(false);
  const [rowsData, setRowsData] = React.useState([]);
  const { register, handleSubmit, formState } = useForm();
  const mutateRow = useFakeMutation();

  const [snackbar, setSnackbar] = React.useState<any>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    async (newRow: any, oldRow: any) => {
      debugger;
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, oldRow);
      setSnackbar({
        children: "User successfully saved",
        severity: "success",
      } as any);
      return response;
    },
    [mutateRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error: any) => {
    setSnackbar({ children: error.message, severity: "error" } as any);
  }, []);

  useEffect(() => {
    // 设置列表列头
    const columns: any = columnsFields.map((item: any) => ({
      field: item.field,
      headerName: item.title,
      minWidth: item.minWidth || 150,
      type: item.type,
      editable: item.editable || false,
    }));
    setColumns(columns);
    // mock 数据
    const rows = Mock.mock({
      "list|200-1000": [
        {
          "id|+1": 1,
          "aliId|+1": Random.integer(1000),
          "aliuserName|1": [
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
          ],
          "platform|+1": 2000001,
          "wechatAccount|+1": 32233,
          "trackingNumber|+1": 22312,
          promotedProducts: "洗手液",
          recoveryState: true,
          refundState: false,
          "promoter|1": [
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
            Random.cname(),
          ],
          "createTime|+3000": 1723242342,
        },
      ],
    });
    setRowsData(rows.list);
  }, [columnsFields]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          size="small"
          startIcon={
            <SvgIcon fontSize="small">
              <AddBoxOutlinedIcon />
            </SvgIcon>
          }
          onClick={handleAddRow}
        >
          新增
        </Button>
        <Button
          size="small"
          startIcon={
            <SvgIcon fontSize="small">
              <DeleteIcon />
            </SvgIcon>
          }
        >
          删除
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />

        <Button
          size="small"
          startIcon={
            <SvgIcon fontSize="small">
              <FileUploadOutlinedIcon />
            </SvgIcon>
          }
        >
          导入
        </Button>
        <GridToolbarExport
          printOptions={{
            disableToolbarButton: true,
          }}
        />
      </GridToolbarContainer>
    );
  };

  // 打开新建弹窗
  const handleAddRow = () => {
    setOpenDialog(true);
  };

  // 关闭弹窗
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 提交新建表单
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div style={{ height: 650, width: "100%" }}>
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        checkboxSelection
        rows={rowsData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: CustomToolbar }}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>新建订单</DialogTitle>
          <DialogContent>
            <TextField
              label="平台单号"
              type="text"
              fullWidth
              margin="dense"
              {...register("username", { required: true })}
            />
            <TextField
              label="支付宝账号"
              type="text"
              fullWidth
              margin="dense"
              {...register("aliId", { required: true })}
            />
            <TextField
              label="支付宝名称"
              fullWidth
              margin="dense"
              type="text"
              {...register("aliuserName", { required: true })}
            />
            <TextField
              label="平台账号"
              fullWidth
              margin="dense"
              type="text"
              {...register("platform", { required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              提交
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}
