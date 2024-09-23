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
export default function GroupsDialog({ isNew ,group,configurations,projectInfo}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    if (!isNew){
      setNameValue(group.name)
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
 const [nameValue,setNameValue]=React.useState("")
  return (
    <React.Fragment>
      <IconButton
        aria-label="newGroup"
        sx={{ marginLeft: "10px" }}
        onClick={handleClickOpen}
      >
        {isNew ? (
          <AddIcon sx={{ fontSize: 23 }} color="success" />
        ) : (
          <Edit sx={{ fontSize: 18 }} />
        )}
      </IconButton>
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
        <DialogTitle>{isNew ? "New Group" : "Edit Group"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={nameValue}
          />
          <div style={{ textAlign: "end" }}>
            <Button variant="contained" color="success">
              Save
            </Button>
          </div>
          {isNew ? null : (
            <div>
              <div
                className="section_header"
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                <p>Configurations in Group</p>
              </div>

              <TransferList includedData={group.includedConfigurationIds} data={configurations} ></TransferList>
              <div style={{ textAlign: "end" }}>
                <Button variant="contained" color="success">
                  Save
                </Button>
              </div>

              <div
                className="section_header"
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                <p>Project where Group is Targeted</p>
              </div>
              <TransferList includedData={group.targetedProjectIds} data={projectInfo}></TransferList>
              <div style={{ textAlign: "end", marginTop: "20px" }}>
                <Button variant="contained" color="success">
                  Target Group to Selected Projects
                </Button>
              </div>
            </div>
          )}
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
