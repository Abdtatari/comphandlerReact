import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { HandymanOutlined, UploadFile } from "@mui/icons-material";
import { Select, MenuItem } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { getComponentVersions } from "../dataSource/configDAOs";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationDialog from "./confirmationDialog";
export default function ImportConf({ component }) {
  const [open, setOpen] = React.useState(false);
  const [versions, setVersions] = React.useState([]);
  const [versionsLoading, setVersionsLoading] = React.useState(true);
  const [selectedVersion, setSelectedVersion] = React.useState();
  const handleClickOpen = () => {
    getComponentVersions(
      component.name,
      component.version,
      setVersions,
      setSelectedVersion,
      setVersionsLoading
    );
    setOpen(true);
  };

  const handleImportClicked = () => {
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleselectedVersionChange = (event) => {
    setSelectedVersion(event.target.value);
  };
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        endIcon={<UploadFile />}
        onClick={handleClickOpen}
      >
        Import Config from another version
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle>Import Configurations from another version</DialogTitle>
        <DialogContent>
          {versionsLoading ? (
            <CircularProgress />
          ) : (
            <>
              <p>
                Copy configuration to{" "}
                <b>
                  {component.name} v. {component.version}
                </b>{" "}
                from version:
              </p>
              <Select
                value={selectedVersion}
                onChange={handleselectedVersionChange}
                displayEmpty
                inputProps={{ "aria-label": "Start Mode" }}
                fullWidth
                label="version"
              >
                {versions.map((version, index) => (
                  <MenuItem value={version}>
                    {version.component_version}
                  </MenuItem>
                ))}
              </Select>

              <div style={{ textAlign: "end" }}>
                <ConfirmationDialog
                  buttonText={"Import"}
                  warningText={
                    "Are you sure you want to copy the configuration of version " +
                    selectedVersion.component_version+
                    " to " +
                    component.name +
                    " v. " +
                    component.version
                  }
                  confirmButtonText={"Confirm"}
                  onConfirm={handleImportClicked}
                />
              </div>
            </>
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
