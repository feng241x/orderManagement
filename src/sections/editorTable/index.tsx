import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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
import { oTrackListImport } from "@/api/oTrackList";
import CloudDownloadSharpIcon from "@mui/icons-material/CloudDownloadSharp";
import { useFormik } from "formik";
import * as Yup from "yup";

const ODD_OPACITY = 0.2;

interface EditDataGridProp {
  columnsFields: any[];
  datagridData: any[];
  onChangeRowData: Function;
  onAddRowData: Function;
  onDelHandle: Function;
  pageType?: "user" | "trackingNumber" | "orderManagement" | "dept" | undefined;
  DownloadTemplateFile?: Function;
  getRowId?: any;
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
  const {
    columnsFields,
    pageType,
    datagridData,
    getRowId,
    onChangeRowData,
    onAddRowData,
    onDelHandle,
    DownloadTemplateFile,
  } = opts;
  const [inputValues, setInputValues] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  // 新增订单弹窗状态管理
  const [openDialog, setOpenDialog] = useState(false);
  // 删除数据警告弹窗
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [rowsData, setRowsData] = useState<any>([]);
  const { handleSubmit, formState } = useForm();
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

  // 下载文件
  function download(res: any) {
    const { data, headers } = res;
    const fileName = "模板文件.xlsx";
    // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
    const blob = new Blob([data], { type: headers["content-type"] });
    let dom = document.createElement("a");
    let url = window.URL.createObjectURL(blob);
    dom.href = url;
    dom.download = decodeURI(fileName);
    dom.style.display = "none";
    document.body.appendChild(dom);
    dom.click();
    dom && dom.parentNode && dom.parentNode.removeChild(dom);
    window.URL.revokeObjectURL(url);
  }

  // 行选中
  const handleRowSelectionModelChange = (selectIds: GridRowSelectionModel) => {
    setSelectIds(selectIds);
  };

  const handleProcessRowUpdateError = useCallback((error: any) => {
    setSnackbar({ children: error.message, severity: "error" } as any);
  }, []);

  useEffect(() => {
    setRowsData(datagridData);
    let inputValues: any = {},
      errors: any = {};
    columnsFields.forEach((item: any) => {
      inputValues[item["field"]] = "";
      errors[item["field"]] = item["errorMsg"];
    });
    setInputValues(inputValues);
    setErrors(errors);
  }, [columnsFields, datagridData]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues: any) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleInputBlur = (name: any) => {
    const inputValue = inputValues[name];
    // 有验证规则的字段进行验证
    const column = columnsFields.find((item) => item["field"] === name);
    if (!column) return false;
    // 必填字段验证
    if (column["required"] && !inputValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [name]: column["errorMsg"],
      }));
      return;
    }
    if (!column["required"] && inputValue === "") {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [`${name.replace("inputValue", "errorText")}`]: "",
      }));
      return;
    }
    const regex = column["regex"];
    if (!regex) return false;
    if (!regex.test(inputValue)) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [name]: column["errorMsg"],
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [`${name.replace("inputValue", "errorText")}`]: "",
      }));
    }
  };

  // 提交新建表单
  const onSubmit = async (data: any) => {
    const result = await onAddRowData(inputValues);
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
  const handleFileInputChange = (event: any) => {
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
        if (pageType === "orderManagement") {
          importExcel(file)
            .then((result) => {
              setSnackbar({ children: "数据导入成功", severity: "success" } as any);
            })
            .catch((error) => {
              setSnackbar({ children: error.message, severity: "error" } as any);
            });
        } else if (pageType === "trackingNumber") {
          oTrackListImport(file)
            .then((result) => {
              setSnackbar({ children: "数据导入成功", severity: "success" } as any);
            })
            .catch((error) => {
              setSnackbar({ children: error.message, severity: "error" } as any);
            });
        }
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
          <>
            <Button
              size="small"
              component="label"
              onClick={() => DownloadTemplateFile && DownloadTemplateFile(download)}
              startIcon={
                <SvgIcon fontSize="small">
                  <CloudDownloadSharpIcon />
                </SvgIcon>
              }
            >
              下载导入模板
            </Button>
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
          </>
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
        columns={columnsFields}
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
        fullWidth={true}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="scroll-dialog-title">新建</DialogTitle>
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              {columnsFields
                .filter((column) => {
                  return column["editable"] || column["field"] === "userName";
                })
                .map((column: any) => {
                  const field = column["field"];
                  return (
                    <Grid item xs={6} key={field}>
                      <TextField
                        label={column["headerName"]}
                        select={column.hasOwnProperty("valueOptions")}
                        fullWidth
                        margin="dense"
                        required={column["required"]}
                        name={field}
                        value={inputValues[field]}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(field)}
                        error={Boolean(inputValues[field]) && Boolean(errors[field])}
                        helperText={inputValues[field] && errors[field]}
                      >
                        {column.hasOwnProperty("valueOptions") &&
                          column?.valueOptions.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  );
                })}
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
          <Alert
            {...snackbar}
            sx={{ color: "#fff" }}
            variant="filled"
            onClose={handleCloseSnackbar}
          />
        </Snackbar>
      )}
    </div>
  );
}
