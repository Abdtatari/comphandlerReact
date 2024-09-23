import React, { useEffect, useState,useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { getSystemComponents } from "../dataSource/configDAOs";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SnackbarContext from "../utils/SnackbarContext";

import {
  getFilesFromGit,
  getRevisionsFromGit,
  getWebGITPathUsingName,
} from "../dataSource/GITDAO.js";
import { tableState } from "../model/componentTableModel";

function ImportFilesFromGit({ lastRevisionInfo ,clickedComponent}) {
  const { openSnackbar } = useContext(SnackbarContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revisionsList, setRevisionsList] = useState([]);
  const [selectedRevision, setSelectedRevision] = useState();
  const [showLogURL, setShowLogURL] = useState("");
  const [isFW, setIsFW] = useState(false);
  const [version, setVersion] = useState("");
  const [versionError, setVersionError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const regex = /^([0-9]+)(\.{1}[0-9]+){1,2}$/;

  const handleClickOpen = () => {
    loadData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeSelectedRevision = (event) => {
    setSelectedRevision(event.target.value);
  };
  const handleImport = () => {
    var detector = tableState.path.split("/")[1];
    var compName = tableState.path.split("/")[2];
    getFilesFromGit(detector,compName,version,selectedRevision.id,clickedComponent.path,setLoading,setOpen,openSnackbar)
  };

  const handleVersionChange = (e) => {
    const newValue = e.target.value;
    setVersion(newValue);
    if (regex.test(newValue)) {
      setVersionError(false);
      setHelperText("");
    } else {
      setVersionError(true);
      setHelperText("Invalid Version");
    }
  };

  const handleShowLog = () => {
    if (showLogURL != "") {
      const newWindow = window.open(
        showLogURL,
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    }
  };

  const loadData = () => {
    var detector = tableState.path.split("/")[1];
    var compName = tableState.path.split("/")[2];
    if (detector == "Framework") {
      setIsFW(true);
    }
    getRevisionsFromGit(
      detector,
      compName,
      setRevisionsList,
      setSelectedRevision,
      setLoading
    );
    getWebGITPathUsingName(detector, compName, setShowLogURL);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} variant="contained">
        import from GIT
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Import Component Files from GIT</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box
                noValidate
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <TextField
                  label="Version"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: "15px" }}
                  value={version}
                  helperText={helperText}
                  onChange={handleVersionChange}
                  error={versionError}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="revision">Revision</InputLabel>
                  <Select
                    labelId="revisionsList"
                    id="revision"
                    value={selectedRevision}
                    label="Revision"
                    onChange={handleChangeSelectedRevision}
                    sx={{
                      marginTop: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    {revisionsList.length > 0
                      ? isFW
                        ? revisionsList.map((revision) => (
                            <MenuItem
                              key={revision}
                              value={revision.url + ";" + revision.commit.id}
                            >
                              {revision.name}
                            </MenuItem>
                          ))
                        : revisionsList.map((revision) => (
                            <MenuItem key={revision} value={revision}>
                              {"r" +
                                revision.id.substring(0, 5) +
                                " - " +
                                revision.authorName +
                                " - " +
                                revision.committedDate}
                            </MenuItem>
                          ))
                      : "No Revisions found"}
                  </Select>
                  <Button
                    variant="text"
                    onClick={handleShowLog}
                    sx={{
                      marginTop: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    {showLogURL == "" ? <CircularProgress /> : "Show log"}
                  </Button>
                </FormControl>
                <>
                  <b style={{ display: "contents" }}>Last imported revision:</b>{" "}
                  {lastRevisionInfo.revision} with version number{" "}
                  {lastRevisionInfo.version}{" "}
                  {lastRevisionInfo.isActive ? " (Active) " : " (Not Active) "}{" "}
                </>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleImport}>Import</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ImportFilesFromGit;
