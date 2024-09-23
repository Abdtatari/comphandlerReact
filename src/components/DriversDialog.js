import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from "@mui/icons-material/Add";
export default function DriverDialog({ isNew, driver }) {
  const [open, setOpen] = React.useState(false);

  React.useState(false);
  const [managerType, setManagerType] = React.useState("");
  const [startMode, setStartMode] = React.useState("");
  const [options, setOptions] = React.useState("");
  const [num, setNum] = React.useState("");
  const [managerTypeAsText,setManagerTypeAsText]=React.useState("")
  const managerNameOptions = [
    "WCCOAdip",
    "WCCOActrl",
    "WCCOAdim",
    "WCCOAopc",
    "WCCOAopcua",
    "WCCOAmod",
    "PVSS00s7",
    "WCCOAopcua",
    "WCCILdataSQLite",
    "WCCOActrl",
    "others",
  ];
  const handleManagerTypeChange = (event) => {
    setManagerType(event.target.value);
  };
  const handleStartModeChange = (event) => {
    setStartMode(event.target.value);
  };

  const handleClickOpen = () => {
    if (!isNew) {
      setOptions(driver.OPTIONS);
      setStartMode(driver.START_MODE == "Null" ? "once" : driver.START_MODE);
      setNum(driver.NUM);
      if (managerNameOptions.indexOf(driver.MANAGER_NAME)>=0) { ///contains not supported in IE browser
        setManagerType(driver.MANAGER_NAME);
      } else {
        setManagerType("others");
        setManagerTypeAsText(driver.MANAGER_NAME)
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
        maxWidth={"sm"}
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
        <DialogTitle>{isNew ? "New Driver" : "Edit Driver"}</DialogTitle>
        <DialogContent>
          <FormControl sx={{ marginTop: "20px" }} fullWidth>
            <InputLabel>Manager Name</InputLabel>
            <Select
              value={managerType}
              onChange={handleManagerTypeChange}
              displayEmpty
              fullWidth
              label="Manager Name"
              inputProps={{ "aria-label": "Without label" }}
            >
              {managerNameOptions.map((managerName,index)=>(
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
            id="num"
            name="num"
            label="Num"
            type="number"
            variant="standard"
            sx={{ display: "grid" }}
            defaultValue={num}
          />
          <TextField
            autoFocus
            margin="normal"
            id="options"
            name="options"
            label="Options"
            type="text"
            variant="standard"
            sx={{ display: "grid" }}
            defaultValue={options}
          />
          <em style={{ fontSize: "10px", fontWeight: "500", display: "block" }}>
            {" "}
            set num to 0 to use the options
          </em>

          <FormControl
            sx={{ marginTop: "20px", marginBottom: 1, minWidth: "10rem" }}
          >
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
