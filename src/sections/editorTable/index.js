import * as React from "react";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DataGrid, zhCN } from "@mui/x-data-grid";
import { createFakeServer } from "@mui/x-data-grid-generator";
import Mock from "mockjs";
const Random = Mock.Random;
const SERVER_OPTIONS = {
  useCursorPagination: false,
};
const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);
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

export default function ServerPaginationGrid(props) {
  const { addRowHandle } = props;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 25,
  });
  const { isLoading, rows, pageInfo } = useQuery(paginationModel);
  const [rowCountState, setRowCountState] = React.useState(pageInfo?.totalRowCount || 0);
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.totalRowCount !== undefined ? pageInfo?.totalRowCount : prevRowCountState
    );
  }, [pageInfo?.totalRowCount, setRowCountState]);

  const [rowsData, setRowsData] = React.useState([]);
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
      "list|20000-100000": [
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

  return (
    <div style={{ height: 550, width: "100%" }}>
      <DataGrid
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        checkboxSelection
        rows={rowsData}
        columns={columns}
        // rowCount={rowCountState}
        loading={isLoading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        // paginationModel={paginationModel}
        // paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
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
