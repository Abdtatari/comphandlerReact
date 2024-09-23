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
import Add from "@mui/icons-material/Add";
import { getProjectsTargetConf } from "../dataSource/configDAOs";
export default function ConfDialog({ isNew ,config}) {
  const [open, setOpen] = React.useState(false);
  const [loadLogicalViewChecked, setLoadLogicalViewChecked] =React.useState(false);
  const [loadHardwareChecked, setLoadHardwareChecked] = React.useState(false);
  const [forceReinstallChecked, setforceReinstallChecked] =React.useState(false);
  const [textboxName,setTextboxName] = React.useState("");
  const [textboxTagName,setTextboxTagName] = React.useState("");
  const [textboxPattern,setTextboxPattern] = React.useState("");
  const [textboxConfigDB,setTextboxConfigDB] = React.useState("");


  const handleLoadLogicalViewChange = (event) => {
    setLoadLogicalViewChecked(event.target.checked);
  };
  const handleloadHardwareChange = (event) => {
    setLoadHardwareChecked(event.target.checked);
  };
  const handleforceReinstallChange = (event) => {
    setforceReinstallChecked(event.target.checked);
  };
  const [projectsTargetConf, setProjectsTargetConf] = React.useState([
  ]);
  const [projectsTargetConfLoading, setprojectsTargetConfLoading] =
    useState(false);
  const handleClickOpen = () => {

    if (!isNew){
      config.name=="Null"?setTextboxName(null):setTextboxName(config.name)
      config.tagname=="Null"?setTextboxTagName(null):setTextboxTagName(config.tagname)
      config.pattern=="Null"?setTextboxPattern(null):setTextboxPattern(config.pattern)
      config.confdb=="Null"?setTextboxConfigDB(null):setTextboxConfigDB(config.confdb)
      config.hardware=="Null"?setLoadHardwareChecked(null):setLoadHardwareChecked(config.hardware)
      config.logical=="Null"?setLoadLogicalViewChecked(null):setLoadLogicalViewChecked(config.logical)
      config.force_reinstall=="Null"?setforceReinstallChecked(null):setforceReinstallChecked(config.force_reinstall)
      getProjectsTargetConf(config.id,setProjectsTargetConf,setprojectsTargetConfLoading)
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="newGroup"
        sx={{ marginLeft: "10px" }}
        onClick={handleClickOpen}
      >
        {isNew?(<Add sx={{ fontSize: 23 }} color="success" />):(<Edit sx={{ fontSize: 18 }}/>)}
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
        <DialogTitle>
          {isNew ? "New Configurations" : "Edit Configurations"}
        </DialogTitle>
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
            defaultValue={textboxName}
          />
          <TextField
            required
            margin="normal"
            id="tagname"
            name="tagname"
            label="Tag Name (in configurationDB)"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={textboxTagName}
          />
          <TextField
            required
            margin="normal"
            id="pattern"
            name="pattern"
            label="Pattern (load only devices that match)"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={textboxPattern}
          />
          <FormControlLabel
            sx={{ display: "block" }}
            control={
              <Switch
                checked={loadLogicalViewChecked}
                onChange={handleLoadLogicalViewChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Load Logical View"
          />

          <FormControlLabel
            control={
              <Switch
                checked={loadHardwareChecked}
                onChange={handleloadHardwareChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Load Hardware View"
          />

          <TextField
            margin="normal"
            id="configDB"
            name="configDB"
            label="Config DB To be Used (leave empty for default)"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={textboxConfigDB}
          />
          <FormControlLabel
            control={
              <Switch
                checked={forceReinstallChecked}
                onChange={handleforceReinstallChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Force Reinstall of Configuratios if it is already loaded"
          />

          {isNew ? null : (
            <>
            <div>
              <h3 sx={{ margin: "20" }}>
                Projects where this configurations is targeted
              </h3>
              <em>
                (Edit the corresponding group to change the target projects)
              </em>
            </div> <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <h4>System Name</h4>
                  </TableCell>
                  <TableCell>
                    <h4>Host Name</h4>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectsTargetConfLoading ? (
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                      {" "}
                      <CircularProgress />{" "}
                    </TableCell>
                  </TableRow>
                ) : projectsTargetConf.length <= 0 ? (
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                      <h3>no data</h3>
                    </TableCell>
                  </TableRow>
                ) : (
                  projectsTargetConf.map((projectTargetConf, index) => (
                    <TableRow key={index}>
                      <TableCell>{projectTargetConf.project_name}</TableCell>
                      <TableCell>{projectTargetConf.hostname}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          </>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="success">
            Save
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
