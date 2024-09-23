import React, { useState, useEffect, useContext } from "react";
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
import { faGitlabSquare } from "@fortawesome/free-brands-svg-icons";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import {
  faFileCircleCheck,
  faFileWaveform,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons/faFileLines";
import { Box } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate, useLocation } from "react-router-dom";
import TableDropdown from "../components/TableDropdown";
import CircularProgress from "@mui/material/CircularProgress";
import { Config } from "../constants";
import { tableState } from "../model/componentTableModel";
import SnackbarContext from "../utils/SnackbarContext";
import AccessManger from "../components/accessManger";
import Button from "@mui/material/Button";
import ImportFilesFromGit from "../components/ImportFilesFromGit";
import { getLastCompRevisionAndIfActive } from "../dataSource/componentDAOs";
import PatchGITFiles from "../components/PatchGITFiles";
function ComponentsTable(props) {
  // State variables
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(0);
  const [parents, setParents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [clickedComponent, setClickedComponent] = useState(null);
  const [visibleRows, setVisibleRows] = useState([]);
  const [backClicked, setBackClicked] = useState(false);
  const { openSnackbar } = useContext(SnackbarContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [isGitActive,setIsGitActive]=useState("false")
  const [lastCompRevision,setLastCompRevision]=useState("")
  const navigate = useNavigate();

  // Pagination event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to check if a component is new or deleted
  async function CheckIfNew(component) {
    let result = "";
    let lastCompRevision = "1";

    if (level === 1) {
      try {
        const response = await fetch(
          Config.getMaxActiveCompRevision + "?parentID=" + component.id
        );

        if (!response.ok) {
          openSnackbar("Fetching data error", "error");
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
        openSnackbar("Fetching data error", "error");
      }
    }

    return result;
  }

  // Dialog close handler
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Rows per page change handler
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Update visible rows when the page, rows, or data changes
  useEffect(() => {
    setVisibleRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, rowsPerPage, page]);

  // Close dropdown when clicking outside
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Container click handler
  const handleContainerClick = (event) => {
    if (anchorEl && !anchorEl.contains(event.target)) {
      handleClose();
    }
  };

  // Navigate to component history
  const goToHistory = (componentID) => {
    navigate(`history/${componentID}`);
  };

  // Navigate to component edit page
  const goToEdit = (row) => {
    navigate("edit", { state: { data: row } });
  };

  // Navigate to component configurations page
  const goToConfigurations = (row) => {
    navigate("configurations", { state: { data: row } });
  };
  // Back button click handler
  function handleBack() {
    if (!loading) {
      if (level !== 0) {
        var path = tableState.path;
        tableState.path = path.slice(0, path.lastIndexOf("/"));
        compAccessToEdit.pop();
        tableState.compAccessToEdit.pop();
        tableState.rows = tableState.parents.pop();
        tableState.level = tableState.level - 1;
        setBackClicked(true);
        setRows(parents.pop());
        setLevel((prevLevel) => prevLevel - 1);
      } else {
        tableState.compAccessToEdit = [];
        setCompAccessToEdit([]);
        tableState.parents = [];
        tableState.level = 0;
        tableState.rows = [];
        setRows([]);
        setLevel(0);
        goToHistory(0);
      }
    }
  }

  // Component access state
  const [compAccessToEdit, setCompAccessToEdit] = useState([]);

  // Add new component handler
  const handleAddNew = () => {
    let createNew = "Detector";
    if (level === 1) {
      createNew = "Sub Detector";
    }
    if (level === 2) {
      createNew = "Component";
    }
    navigate("createNew", { state: { data: createNew } });
  };

  // Initial data fetch and update
  useEffect(() => {
    setRows(tableState.rows);
    setLevel(tableState.level);
    setParents(tableState.parents);
    setCompAccessToEdit(tableState.compAccessToEdit);
    const fetchData = async () => {
      try {
        const response = await fetch(Config.getDetectors);
        if (!response.ok) {
          openSnackbar("Fetching data error", "error");
        }
        const data = await response.json();
        let result = [];

        for (const row of data) {
          result.push({ ...row});
        }
        setRows(result);
        setLoading(false);
      } catch (error) {
        openSnackbar("Fetching data error", "error");
        setLoading(false);
      }
    };
    if (tableState.rows.length === 0 && tableState.level === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch data when the level changes
  useEffect(() => {
    const fetchData = async () => {
      tableState.path += "/" + clickedComponent.name;
      try {
        let response 
        if (level == 1) {
          response = await fetch(
            Config.getComponent + "?parentID=" + clickedComponent.id+"&maxActive=true"
          );
        } else {
            response = await fetch(
            Config.getComponent + "?parentID=" + clickedComponent.id+"&maxActive=false"
          );
        }
        if (!response.ok) {
          openSnackbar("Fetching data error", "error");
        }
        const data = await response.json();
        let result = [];
        for (const row of data) {
          result.push({ ...row });
        }
        if (level === 2) {

          result = result
            .sort((a, b) => {
              return (
                new Date(a.lastModified).getTime() -
                new Date(b.lastModified).getTime()
              );
            })
            .reverse();
        }

        if (level === 2) {
          getLastCompRevisionAndIfActive(tableState.path,setIsGitActive,setLastCompRevision,setLoading)
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
          tableState.rows = result
            .sort((a, b) => {
              return (
                new Date(a.lastModified).getTime() -
                new Date(b.lastModified).getTime()
              );
            })
            .reverse();
        } else {
          setRows(result);
          tableState.rows = result;
        }
        setLoading(false);
      } catch (error) {
        openSnackbar("Fetching data error", "error");
        setLoading(false);
      }
    };
    if (clickedComponent !== null && !backClicked) {
      fetchData();
    }
  }, [level]);

  // Navigate into a component or open file on click
  function GetInside(component) {
    compAccessToEdit.push(component);
    tableState.compAccessToEdit.push({
      id: component.id,
      name: component.name,
    });
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
    } else {
      parents.push(rows);
      tableState.parents.push(rows);
      setClickedComponent(component);
      setLevel((prevLevel) => prevLevel + 1);
      tableState.level = level + 1;
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer component={Paper} onClick={handleContainerClick}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={6} align="center">
                {level == 2 && isGitActive=="true" && !loading ? (
                    <>
                    <ImportFilesFromGit lastRevisionInfo={rows[0]} clickedComponent={clickedComponent} />
                    {lastCompRevision===rows[0].fullRevision?(
                     <span style={{ backgroundColor: '#3efa45',padding:'5px',margin:'5px',borderRadius:'5px'}} >The latest revision: {lastCompRevision.substring(0, 5)}</span>
                    ):(
                     <span style={{ backgroundColor: '#f5676c',padding:'5px',margin:'5px',borderRadius:'5px'}} >The latest revision: {lastCompRevision.substring(0, 5)}</span>
                    )}
                    </>
                  ) :null}
                  {level== 3 && isGitActive=="true"&& !loading?(
                    <PatchGITFiles clickedComponent={clickedComponent}/>
                  ):(
                    null)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {/* Back and navigation buttons */}
                  <IconButton aria-label="history" onClick={() => handleBack()}>
                    <FontAwesomeIcon
                      icon={level !== 0 ? faArrowLeft : faClockRotateLeft}
                    />
                  </IconButton>
                  {level <= 2 ? (
                    <AccessManger compAccessToEdit={compAccessToEdit} />
                  ) : null}
                  {level <= 2 ? (
                    <IconButton
                      aria-label="createNew"
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
                  <h3>{level === 2 ? "Version" : "Size (B)"}</h3>
                </TableCell>
                <TableCell align="left">
                  <h3>{level === 2 ? "Revision" : "Type"}</h3>
                </TableCell>
                <TableCell align="left">
                  <h3>Last Modified</h3>
                </TableCell>
                <TableCell align="center">
                  <h3>Options</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* Table Body */}
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
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {/* Display icons based on component type */}
                      <TableCell align="left">
                        {row.isActive ? (
                          <FontAwesomeIcon
                            size="2xl"
                            icon={faFileCircleCheck}
                            style={{ color: "darkgreen" }}
                          />
                        ) : level === 2 ? (
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
                      {/* Display component name and status */}
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
                          {row.extra}
                        </div>
                      </TableCell>
                      {/* Display version or size based on the component level */}
                      <TableCell align="left">
                        {level === 2 ? row.version : row.size}
                      </TableCell>
                      {/* Display revision or type based on the component level */}
                      <TableCell align="left">
                        {level === 2 ? row.revision : row.type}
                      </TableCell>
                      {/* Display last modified timestamp */}
                      <TableCell align="left">{row.lastModified}</TableCell>
                      {/* Options dropdown for each row */}
                      <TableCell align="center">
                        <TableDropdown
                          handleDelete={() => goToHistory(row.id)}
                          handleEdit={() => goToEdit(row)}
                          handleConfiguration={() => goToConfigurations(row)}
                          handleHistory={() => goToHistory(row.id)}
                          level={level}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // Display message if no data found
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
