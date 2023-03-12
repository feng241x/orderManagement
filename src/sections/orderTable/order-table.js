import PropTypes from "prop-types";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, zhCN } from "@mui/x-data-grid";
import { useState } from "react";
import { Box, Card } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useEffect } from "react";
const columnsData = [
  {
    field: "id",
    title: "平台单号",
  },
  {
    field: "aliId",
    title: "支付宝账号",
    minWidth: "100px",
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
    field: "wechatAccount",
    title: "微信号",
  },
  {
    field: "trackingNumber",
    title: "物流单号",
  },
  {
    field: "promotedProducts",
    title: "推广产品",
  },
  {
    field: "recoveryState",
    title: "回收状态",
  },
  {
    field: "refundState",
    title: "返款状态",
  },
  {
    field: "promoter",
    title: "推广人",
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
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export const OrderTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Scrollbar>
    </Card>
  );
};

OrderTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
