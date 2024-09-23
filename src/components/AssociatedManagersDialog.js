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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableHead,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState, useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import TransferList from "./TransferList";
import AddIcon from "@mui/icons-material/Add";
export default function AssociatedManagerDialog({ isNew, manager }) {
  const managerNameOptions = [
    "WCCOAdip",
    "WCCOActrl",
    "WCCOAdim",
    "WCCOAopc",
    "WCCOAopcua",
    "WCCOAmod",
    "PVSS00s7",
    "WCCOAopcua",
    "WCCOActrl",
    "others",
  ];
  const [open, setOpen] = React.useState(false);

  const [isDriverChecked, setIsDriverChecked] = React.useState(true);
  const [restartManagerIfPresentChecked, setRestartManagerIfPresentChecked] =
    React.useState(false);
  const [managerType, setManagerType] = React.useState("");
  const [startMode, setStartMode] = React.useState("");
  const [managerTypeAsText, setManagerTypeAsText] = React.useState("");

  const [commandLine, setCommandLine] = React.useState("");
  const [num, setNum] = React.useState("");
  const [restartCount, setRestartCount] = React.useState("");
  const [resetMin, setResetMin] = React.useState("");
  const [secKill, setSecKill] = React.useState("");
  const [position, setPosition] = React.useState("");

  const handleManagerTypeChange = (event) => {
    setManagerType(event.target.value);
  };
  const handleStartModeChange = (event) => {
    setStartMode(event.target.value);
  };

  const handleIsDriverChange = (event) => {
    setIsDriverChecked(event.target.checked);
  };
  const handleRestartManagerIfPresentChange = (event) => {
    setRestartManagerIfPresentChecked(event.target.checked);
  };

  const handleClickOpen = () => {
    if (!isNew) {
      setRestartManagerIfPresentChecked(manager.RESTART);
      setIsDriverChecked(manager.IS_DRIVER);
      setCommandLine(manager.COMMAND_LINE);
      setNum(manager.NUM);
      setRestartCount(manager.RESTART_COUNT);
      setResetMin(manager.RESET_MIN);
      setSecKill(manager.SEC_KILL);
      setPosition(manager.POS);
      setStartMode(manager.START_MODE == "Null" ? "once" : manager.START_MODE);

      if (managerNameOptions.indexOf(manager.MANAGER_TYPE) >= 0) {
        ///contains not supported in IE browser
        setManagerType(manager.MANAGER_TYPE);
      } else {
        setManagerType("others");
        setManagerTypeAsText(manager.MANAGER_TYPE);
      }
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {isNew ? (
       <IconButton
       sx={{ fontSize: "12px" }}
       color="success"
       onClick={handleClickOpen}
     >
       <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
     </IconButton>
      ) : (
        <IconButton
          aria-label="newGroup"
          sx={{ marginLeft: "10px" }}
          onClick={handleClickOpen}
        >
          <Edit sx={{ fontSize: 18 }} />
        </IconButton>
      )}
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
            handleClose();
          },
        }}
      >
        <DialogTitle>{isNew ? "New Manager" : "Edit Manager"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginTop: "15px" }}>
            <InputLabel>Manager Type</InputLabel>
            <Select
              value={managerType}
              onChange={handleManagerTypeChange}
              displayEmpty
              inputProps={{ "aria-label": "Start Mode" }}
              fullWidth
              label="Manager Type"
            >
              {managerNameOptions.map((managerName, index) => (
                <MenuItem value={managerName}>{managerName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {managerType=="others"?(
             <TextField
             autoFocus
             required
             margin="normal"
             id="managerType"
             name="managerType"
             label="managerType"
             type="text"
             variant="standard"
             sx={{ display: "grid" }}
             defaultValue={managerTypeAsText}
           />
          ):null}
          <TextField
            autoFocus
            required
            margin="normal"
            id="commandLine"
            name="commandLine"
            label="Command Line"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={commandLine}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="num"
            name="num"
            label="Num"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={num}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="restartCount"
            name="restartCount"
            label="Restart Count"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={restartCount}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="resetMin"
            name="resetMin"
            label="Reset Min"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={resetMin}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="secKill"
            name="secKill"
            label="Sec Kill"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={secKill}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="position"
            name="position"
            label="Position (-1 to insert at the end)"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={position}
          />
          <FormControl sx={{ marginTop: "15px", minWidth: "10rem" }}>
            <InputLabel>Start Mode</InputLabel>
            <Select
              value={startMode}
              onChange={handleStartModeChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              label="Start Mode"
            >
              <MenuItem value={"once"}>once</MenuItem>
              <MenuItem value={"always"}>Always</MenuItem>
              <MenuItem value={"manual"}>Manual</MenuItem>
              <MenuItem value={"delayed"}>Delayed</MenuItem>
            </Select>
          </FormControl>
          <div style={{ display: "block", marginTop: "20px" }}>
            <InputLabel sx={{ display: "contents" }}>Is Driver</InputLabel>
            <FormControl sx={{ m: 2, display: "contents", width: "20em" }}>
              <Switch
                checked={isDriverChecked}
                onChange={handleIsDriverChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </FormControl>
          </div>

          <div style={{ display: "block" }}>
            <InputLabel sx={{ m: 1, display: "contents" }}>
              Restart Manager if Already Present
            </InputLabel>
            <FormControl sx={{ m: 1, display: "contents", width: "20em" }}>
              <Switch
                checked={restartManagerIfPresentChecked}
                onChange={handleRestartManagerIfPresentChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </FormControl>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="contained" color="success">
              {isNew ? "Create" : "Save"}
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ marginTop: "20", width: "50" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
