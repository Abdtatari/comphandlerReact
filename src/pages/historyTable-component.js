import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams,useLocation } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { get } from "react-hook-form";
import { green, orange } from "@mui/material/colors";
import { Config } from "../constants";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { getHistory, getHistory2 } from "../dataSource/historyDAOs";

const columns = [
  { field: "time", headerName: "Time", width: 250, type: "Date",},
  { field: "user", headerName: "User", width: 100,},
  { field: "Component", headerName: "Component", width: 250,},
  {
    field: "Version",
    headerName: "Version",
    width: 150,
  },
  {
    field: "Revision",
    headerName: "Revision",
    width: 180,
  },
  {
    field: "actionName",
    headerName: "Action",
    width: 120,
    renderCell: (params) => getAction(params.row.actionName, params.row.url),
  },
];  


const boldHeaderCellStyle = {
  fontWeight: 'bold',
};
function PatchHanlder(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
function getAction(action, url) {
  if (action === "GIT_PATCH") {
    return (
      <Button
        size="small"
        color="primary"
        variant="contained"
        endIcon={<OpenInNewIcon />}
        onClick={() => PatchHanlder(url)}
      >
        Patch
      </Button>
    );
  } else if (action === "SET_ACTIVE") {
    return <em style={{ color: "green" }}>SET ACTIVE</em>;
  } else if (action === "DEP_REGISTER") {
    return <em style={{ color: "orange" }}>DEP REGISTER</em>;
  } else if (action === "GIT_IMPORT") {
    return <em style={{ color: "orange" }}>GIT IMPORT</em>;
  } else if (action === "UPDATE_COMP") {
    return <em style={{ color: "orange" }}>UPDATE COMP</em>;
  }
  return <div>action</div>;
}

function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const component = useParams();

  useEffect(() => {
    getHistory( component.componentID,setHistory,setHistoryLoading)    
  }, []);
  const navigate = useNavigate();

  const goBack = () => {
		navigate(-1);
	}
  return (
    <div style={{ width: "100%" }}>
      <IconButton
       onClick={goBack}
      >
        <ArrowBackIcon />
      </IconButton>
      <DataGrid
        rows={history}
        columns={columns}
        density="comfortable"
        hideFooterSelectedRowCount="true"
        paginationMode="client"
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        loading={historyLoading}
        autoHeight
        components={{
          HeaderCell: (props) => (
            <div style={boldHeaderCellStyle}>{props.value}</div>
          ),
        }}
      />
    </div>
  );
}
export default HistoryTable;
