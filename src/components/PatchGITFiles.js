import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableHead,
  Switch,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState, useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import TransferList from "./TransferList";
import AddIcon from "@mui/icons-material/Add";
import { tableState } from "../model/componentTableModel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
    getFilesFromGit,
    getRevisionsFromGit,
    getWebGITPathUsingName,
    patchFilesFromGit,
  } from "../dataSource/GITDAO.js";
  import SnackbarContext from "../utils/SnackbarContext";

export default function PatchGITFiles({clickedComponent}) {
  const { openSnackbar } = useContext(SnackbarContext);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [revisionsList, setRevisionsList] = useState([]);
  const [selectedRevision, setSelectedRevision] = useState();
  const [showLogURL, setShowLogURL] = useState("");
  const [textboxVersion,setTextboxVersion] = React.useState("");

  const handlePatch = () => {
    var detector = tableState.path.split("/")[1];
    var compName = tableState.path.split("/")[2];
    patchFilesFromGit(detector,compName,clickedComponent.version,selectedRevision.id,setLoading,setOpen,openSnackbar)
  };

  const handleClickOpen = () => {
    setTextboxVersion(clickedComponent.version)
    loadData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
  const handleChangeSelectedRevision = (event) => {
    setSelectedRevision(event.target.value);
  };
  const loadData = () => {
    var detector = tableState.path.split("/")[1];
    var compName = tableState.path.split("/")[2];
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
      <Button
        aria-label="newGroup"
        onClick={handleClickOpen}
        variant="contained"
      >
        Patch Files From GIT
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Patch Files From Git</DialogTitle>
        <DialogContent>
          {loading?(<CircularProgress/>):(
            <>
            <h3>{clickedComponent.name}</h3>
            <TextField
            autoFocus
            required
            margin="normal"
            name="version"
            label="Version"
            id="version"
            type="text"
            fullWidth
            variant="standard"
            disabled="true"
            defaultValue={textboxVersion}
          />
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
              ? revisionsList.map((revision) => (
                  <MenuItem key={revision} value={revision}>
                    {"r" +
                      revision.id +
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePatch} variant="contained" color="success">
            Patch
          </Button>
          <Button onClick={handleClose} sx={{ marginTop: "20", width: "50" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
