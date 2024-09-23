import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { HandymanOutlined, UploadFile } from "@mui/icons-material";
import { Select, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { getComponentVersions } from "../dataSource/configDAOs";
import CircularProgress from "@mui/material/CircularProgress";
export default function ConfirmationDialog({ buttonText ,warningText,confirmButtonText,onConfirm}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Button
        sx={{ marginTop: 3 }}
        variant="outlined"
        endIcon={<UploadFile />}
        onClick={handleClickOpen}
        color="success"
      >
        {buttonText}
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
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
        <Typography>{warningText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirm} sx={{ marginTop: "20", width: "50" }}>
            {confirmButtonText}
          </Button>
          <Button onClick={handleClose} sx={{ marginTop: "20", width: "50" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
