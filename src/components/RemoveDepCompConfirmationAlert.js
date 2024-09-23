import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { CircularProgress } from "@mui/material";
import { removeDependentComp } from "../dataSource/configDAOs";
import SnackbarContext from "../utils/SnackbarContext";
import React, { useEffect, useState, useContext } from "react";

export default function RemoveDepCompConfirmationAlert({
  component,
  setReload
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { openSnackbar } = useContext(SnackbarContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function handleConfirmClicked(comp) {
    removeDependentComp(comp.id, setOpen, setLoading, openSnackbar,setReload);
    
  }
  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>
        <IconButton aria-label="remove">
          <CancelIcon color="error" />
        </IconButton>
      </div>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}
      >
        <DialogTitle>Removing from dependent list</DialogTitle>
        {loading ? (
          <CircularProgress sx={{ mx: "auto" }} />
        ) : (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to remove this component
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleConfirmClicked(component);
                }}
              >
                Remove
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
}
