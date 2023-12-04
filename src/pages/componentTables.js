import React, { useState, useEffect,useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faArrowLeft,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import {
  faFileCircleCheck,
  faFileWaveform,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons/faFileLines";
import { Box, Tab } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate,useLocation } from "react-router-dom";
import TableDropdown from "../components/TableDropdown";
import CircularProgress from "@mui/material/CircularProgress";
import { Config } from "../constants";
import { tableState } from "../model/componentTableModel";

import SnackbarContext from "../utils/SnackbarContext";
import AccessManger from "../components/accessManger";

function ComponentsTable(props) {
  const [dialogOpen, setDialogOpen] = React.useState(false);


  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(0);
  const [parents,setParents] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clickedComponent, setClickedComponent] = useState(null);
  const [visibleRows, setVisibleRows] = useState([]);
  const [backClicked, setBackClicked] = useState(false);
  const { openSnackbar } = useContext(SnackbarContext);
  const [openDialog, setOpenDialog] = React.useState(false);



 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  async function CheckIfNew(component) {
    let result = "";
    let lastCompRevision = "1";

    if (level === 1) {
      try {
        const response = await fetch(
          Config.getMaxActiveCompRevision + "?parentID=" + component.id
        );

        if (!response.ok) {
          openSnackbar("Fetching data error", "error")
        }
        const data = await response.json();
        const maxImportedActiveCompRevision = data["maxActiveCompRevision"];

        if (
          maxImportedActiveCompRevision !== null &&
          maxImportedActiveCompRevision !== lastCompRevision
        ) {
          result = lastCompRevision !== null ? "New" : "Deleted";
        }
      } catch (error) {
        // Handle errors here if necessary
        openSnackbar("Fetching data error", "error")
      }
    }

    return result;
  }
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    setVisibleRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, rowsPerPage, page]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleContainerClick = (event) => {
    if (anchorEl && !anchorEl.contains(event.target)) {
      handleClose();
    }
  };
  const goToHistory = (componentID) => {
      navigate(`history/${componentID}`);  
  };
  const goToEdit = (row) => {
    navigate("edit", { state: { data: row } });
  };
  function handleBack() {
    if (!loading) {
      if (level != 0) {
        tableState.rows=tableState.parents.pop()
        tableState.level=tableState.level-1
        setBackClicked(true);
        setRows(parents.pop());
        setLevel((prevLevel) => prevLevel - 1);
        
      } else {
        tableState.parents=[]
        tableState.level=0
        tableState.rows=[]
        setRows([]);
        setLevel(0);
        goToHistory(0);
      }
    }
  }
  const [compAccessToEdit, setCompAccessToEdit] = useState(null);
  const handleAddNew = () => {
    let createNew = "Detector";
    if (level == 1) {
      createNew = "Sub Detector";
    }
    if (level == 2) {
      createNew = "Component";
    }
    navigate("createNew", { state: { data: createNew } });
  };

  
  useEffect(() => {
    setRows(tableState.rows)
    setLevel(tableState.level)
    setParents(tableState.parents)
    const fetchData = async () => {
      try {
        const response = await fetch(Config.getDetectors);
        if (!response.ok) {
            openSnackbar("Fetching data error", "error")
        }
        const data = await response.json()
        let result = [];

        for (const row of data) {
          const status = await CheckIfNew(row);
          result.push({ ...row, status });
        }
        setRows(result);
        setLoading(false);
      } catch (error) {
        openSnackbar("Fetching data error", "error")
        setLoading(false); // Loading is complete, even in case of an error
      }
    };
    if (tableState.rows.length == 0 && tableState.level == 0)
    {
      fetchData();
    }
    else {
      setLoading(false);
    } 
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          Config.getComponent + "?parentID=" + clickedComponent.id
        );
        if (!response.ok) {
          openSnackbar("Fetching data error", "error")
        }
        const data = await response.json();
        let result = [];
        for (const row of data) {
          const status = await CheckIfNew(row);
          result.push({ ...row, status });
        }
        if (level == 2) {
          result = result
            .sort((a, b) => {
              return (
                new Date(a.lastModified).getTime() -
                new Date(b.lastModified).getTime()
              );
            })
            .reverse();
        }
        //sorting on last modified date
        if (level == 2) {
          setRows(
            result
              .sort((a, b) => {
                return (
                  new Date(a.lastModified).getTime() -
                  new Date(b.lastModified).getTime()
                );
              })
              .reverse()
          );
          tableState.rows=result
          .sort((a, b) => {
            return (
              new Date(a.lastModified).getTime() -
              new Date(b.lastModified).getTime()
            );
          })
          .reverse()
        } else {
          setRows(result);
          tableState.rows=result
        }
        setLoading(false);
      } catch (error) {
        openSnackbar("Fetching data error", "error")
        setLoading(false); // Loading is complete, even in case of an error
      }
    };
    if (clickedComponent != null && !backClicked) {
      fetchData();
    }
  }, [level]);
  function GetInside(component) {
    setBackClicked(false);
    setLoading(true);
    if (!component.isFolder) {
      let link = window.open(
        Config.downloadFileService +
          "?path=" +
          component.path +
          "&name=" +
          component.name,
        "_blank"
      );
      setLoading(false);
      return;
    }
    else{
      parents.push(rows);
      tableState.parents.push(rows)
      setClickedComponent(component);
      setLevel((prevLevel) => prevLevel + 1);
      tableState.level=level+1
    }   
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer component={Paper} onClick={handleContainerClick}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton aria-label="history" onClick={() => handleBack()}>
                    <FontAwesomeIcon
                      icon={level != 0 ? faArrowLeft : faClockRotateLeft}
                    />
                  </IconButton>
                  <AccessManger compAccessToEdit={compAccessToEdit}/>
                  {level <= 2 ? (
                    <IconButton
                      aria-label="access"
                      onClick={() => handleAddNew()}
                    >
                      <FontAwesomeIcon icon={faSquarePlus}></FontAwesomeIcon>
                    </IconButton>
                  ) : null}
                </TableCell>
                <TableCell align="left">
                  <h3>Name</h3>
                </TableCell>
                <TableCell align="left">
                  <h3>{level == 2 ? "Version" : "Size (B)"}</h3>
                </TableCell>
                <TableCell align="left">
                  <h3>{level == 2 ? "Revision" : "Type"}</h3>
                </TableCell>
                <TableCell align="left">
                  <h3>Last Modified</h3>
                </TableCell>
                <TableCell align="center">
                  <h3>Options</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                    {" "}
                    <CircularProgress />{" "}
                  </TableCell>
                </TableRow>
              ) : visibleRows.length > 0 ? (
                visibleRows.map((value) => {
                  let row = value;
                  if (row.size == "0") {
                    row.size = "";
                  }
                  return (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">
                        {row.isActive ? (
                          <FontAwesomeIcon
                            size="2xl"
                            icon={faFileCircleCheck}
                            style={{ color: "darkgreen" }}
                          />
                        ) : level == 2 ? (
                          <FontAwesomeIcon
                            size="2xl"
                            icon={faFileWaveform}
                            style={{ color: "black" }}
                          />
                        ) : row.isFolder ? (
                          <FontAwesomeIcon size="2xl" icon={faFolder} />
                        ) : (
                          <FontAwesomeIcon size="2xl" icon={faFileLines} />
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row" align="left">
                        <div
                          style={{
                            color: "green",
                            textDecoration: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => GetInside(row)}
                        >
                          {row.name}
                        </div>
                        <div style={{ margin: 0, color: "black" }}>
                          {row.status}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {level == 2 ? row.version : row.size}
                      </TableCell>
                      <TableCell align="left">
                        {level == 2 ? row.revision : row.type}
                      </TableCell>
                      <TableCell align="left">{row.lastModified}</TableCell>
                      <TableCell align="center">
                        <TableDropdown
                          handleDelete={() => goToHistory(row.id)}
                          handleEdit={() => goToEdit(row)}
                          handleConfiguration={() => goToHistory(row.id)}
                          handleHistory={() => goToHistory(row.id)}
                          level={level}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                    {" "}
                    No Data found{" "}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
export default ComponentsTable;
