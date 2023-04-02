import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Mock from "mockjs";
import { Button, DialogContentText, Grid, MenuItem, SvgIcon } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useForm } from "react-hook-form";
import {
  zhCN,
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { alpha, styled } from "@mui/material/styles";
import { importExcel } from "@/api/orderList";

const ODD_OPACITY = 0.2;

interface EditDataGridProp {
  columnsFields: any[];
  datagridData: any[];
  onChangeRowData: Function;
  onAddRowData: Function;
  onDelHandle: Function;
  pageType?: "user" | "trackingNumber" | "orderManagement" | "dept" | undefined;
  getRowId?: Function | undefined;
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function EditDataGrid(opts: EditDataGridProp) {
  const [columns, setColumns] = useState<any>([]);
  const {
    columnsFields,
    pageType,
    datagridData,
    getRowId,
    onChangeRowData,
    onAddRowData,
    onDelHandle,
  } = opts;
  const [inputValues, setInputValues] = useState({
    inputValue1: "",
    inputValue2: "",
  });
  const [errors, setErrors] = useState({
    errorText1: "",
    errorText2: "",
  });
  // 新增订单弹窗状态管理
  const [openDialog, setOpenDialog] = useState(false);
  // 删除数据警告弹窗
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [rowsData, setRowsData] = useState<any>([]);
  const { register, handleSubmit, formState } = useForm();
  // 当前表格选中项
  const [selectIds, setSelectIds] = useState<any>([]);

  const [snackbar, setSnackbar] = useState<any>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    async (newRow: any, oldRow: any) => {
      const response = await onChangeRowData(newRow, oldRow);
      setSnackbar({
        children: "成功修改数据",
        severity: "success",
      } as any);
      return response;
    },
    [onChangeRowData]
  );

  // 行选中
  const handleRowSelectionModelChange = (selectIds: GridRowSelectionModel) => {
    setSelectIds(selectIds);
  };

  const handleProcessRowUpdateError = useCallback((error: any) => {
    setSnackbar({ children: error.message, severity: "error" } as any);
  }, []);

  useEffect(() => {
    // 设置列表列头
    setColumns(columnsFields);
    setRowsData(datagridData);
  }, [columnsFields, datagridData]);

  // 提交新建表单
  const onSubmit = async (data: any) => {
    const result = await onAddRowData(data);
    if (result) {
      // 新建成功 关闭弹窗
      handleCloseDialog();
    }
  };

  // 删除数据
  const handleDelRow = (flag = false) => {
    if (flag) {
      onDelHandle(selectIds);
      setOpenDelDialog(false);
      return false;
    }
    // 获取当前选中数据 支持多选
    if (selectIds.length === 0) return;
    setOpenDelDialog(true);
  };

  // 上传文件
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType !== "application/vnd.ms-excel" &&
        fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSnackbar({ children: "请上传 Excel 文件", severity: "warning" } as any);
        event.target.value = "";
      } else {
        importExcel(file)
          .then((result) => {
            debugger;
          })
          .catch((error) => {
            setSnackbar({ children: error.message, severity: "error" } as any);
          });
      }
    }
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
          新增
        </Button>
        <Button
          size="small"
          startIcon={
            <SvgIcon fontSize="small">
              <DeleteIcon />
            </SvgIcon>
          }
          onClick={() => handleDelRow()}
        >
          删除
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        {["user", "dept"].includes(pageType || "") ? (
          ""
        ) : (
          <Button
            size="small"
            component="label"
            startIcon={
              <SvgIcon fontSize="small">
                <FileUploadOutlinedIcon />
              </SvgIcon>
            }
          >
            导入
            <input hidden accept=".xls,.xlsx" type="file" onChange={handleFileInputChange} />
          </Button>
        )}

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

  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
  };

  return (
    <div style={{ height: 650, width: "100%" }}>
      <StripedDataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        checkboxSelection
        rows={rowsData}
        getRowId={getRowId}
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
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: CustomToolbar }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
      />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll={"paper"}
        maxWidth={"md"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="scroll-dialog-title">新建订单</DialogTitle>
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              {columnsFields
                .filter((column) => {
                  return column["editable"] || column["field"] === "userName";
                })
                .map((column: any) => (
                  <Grid item xs={6} key={column["field"]}>
                    <TextField
                      label={column["headerName"]}
                      select={column.hasOwnProperty("valueOptions")}
                      fullWidth
                      margin="dense"
                      {...register(column["field"], {
                        required: column["required"],
                      })}
                    >
                      {column.hasOwnProperty("valueOptions") &&
                        column?.valueOptions.map((option: any) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              提交
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openDelDialog}
        onClose={handleCloseDelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color={"red"}>
            您确定要删除选中的<span style={{ fontWeight: 700 }}>{selectIds.length}</span>条数据吗?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelDialog}>取消</Button>
          <Button onClick={() => handleDelRow(true)} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} variant="filled" onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}
