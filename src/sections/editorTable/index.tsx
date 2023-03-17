import * as React from "react";
import { useEffect } from "react";
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
const columnsFields = [
  {
    field: "id",
    title: "平台单号",
    minWidth: 100,
  },
  {
    field: "aliId",
    title: "支付宝账号",
  },
  {
    field: "aliuserName",
    title: "支付宝户主",
  },
  {
    field: "platform",
    title: "平台账号",
  },
  {
    field: "'wechatAccount'",
    title: "微信号",
  },
  {
    field: "trackingNumber",
    title: "物流单号",
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
];

const columns = columnsFields.map((item) => ({
  field: item.field,
  headerName: item.title,
  minWidth: item.minWidth || 150,
  type: item.type,
  editable: item.editable || false,
}));

const useFakeMutation = () => {
  return React.useCallback(
    (newRow, oldRow) =>
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

export default function ServerPaginationGrid() {
  // 新增订单弹窗状态管理
  const [openDialog, setOpenDialog] = React.useState(false);
  const [rowsData, setRowsData] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const { register, handleSubmit, formState } = useForm();
  const mutateRow = useFakeMutation();

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow, abc, def) => {
      debugger;
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, oldRow);
      setSnackbar({ children: "User successfully saved", severity: "success" });
      return response;
    },
    [mutateRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  useEffect(() => {
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
  }, []);

  const createRandomRow = () => {
    let newData = {};
    columnsFields.forEach((item, index) => {
      newData[item["field"]] = item["field"] === "id" ? "-1" : "";
    });
    return newData;
  };

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
          新增订单
        </Button>
        <Button
          size="small"
          startIcon={
            <SvgIcon fontSize="small">
              <DeleteIcon />
            </SvgIcon>
          }
        >
          删除订单
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
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div style={{ height: 650, width: "100%" }}>
      <DataGrid
        height="auto"
        dataSet="Commodity"
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
        // rowCount={rowCountState}
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
