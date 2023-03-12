import PropTypes from "prop-types";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, zhCN } from "@mui/x-data-grid";
import { useState } from "react";
import * as React from 'react';
import { Box, Card } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useEffect } from "react";
import Mock from "mockjs";
const Random = Mock.Random
const columnsFields = [
  {
    field: "id",
    title: "平台单号",
    minWidth: 100
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
    editable: true
  },
  {
    field: "recoveryState",
    title: "回收状态",
    editable: true
  },
  {
    field: "refundState",
    title: "返款状态",
    editable: true
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

function getFullName(params) {
  return `${params.getValue(params.id, 'firstName') || ''} ${
    params.getValue(params.id, 'lastName') || ''
  }`;
}

const columns = columnsFields.map(item => ({
  field: item.field,
  headerName: item.title,
  minWidth: item.minWidth || 150,
  type: item.type,
  editable: item.editable || false,
  valueGetter: getFullName,
}));

export const OrderTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const [rowsData, setRowsData] = React.useState([]);
  const [editRowsModel, setEditRowsModel] = React.useState({});

  const handleCellEditCommit = React.useCallback(
    ({ id, field, value }) => {
      if (field === 'fullName') {
        const [firstName, lastName] = value.toString().split(' ');
        const updatedRows = rowsData.map((row) => {
          if (row.id === id) {
            return { ...row, firstName, lastName };
          }
          return row;
        });
        setRows(updatedRows);
      }
    },
    [rowsData],
  );
  const handleEditRowsModelChange = React.useCallback((model) => {
    debugger;
    setEditRowsModel(model);
  }, []);
  useEffect(() => {
    // mock 数据
    const rows = Mock.mock({
      'list|1-30': [
        {
          'id|+1': 1,
          'aliId|+1': Random.integer(1000),
          'aliuserName|1': [Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname()],
          'platform|+1': 2000001,
          'wechatAccount|+1': 32233,
          'trackingNumber|+1': 22312,
          'promotedProducts': '洗手液',
          'recoveryState': true,
          'refundState': false,
          'promoter|1': [Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname(), Random.cname()],
          'createTime|+3000': 1723242342
        }
      ]
    })
    setRowsData(rows.list);
  }, [])
  const onCellEditStop = (row, b, c) => {
    // 获取关键属性值
    const {id, field} = row;
    debugger;
  }
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 30, 50]}
            checkboxSelection
            disableSelectionOnClick
            onCellEditCommit={handleCellEditCommit}
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
