import { red } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import React, { useState, useEffect, useContext } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { faKey, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { Box, Tab } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SnackbarContext from "../utils/SnackbarContext";

function AccessManger(compAccessToEdit) {
  const { openSnackbar } = useContext(SnackbarContext);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const HandleAddAccess = () => {
    openSnackbar("Added Successfully", "success");
  };
  return (
        <React.Fragment>
            <IconButton aria-label="access" onClick={handleClickOpen}>
        <FontAwesomeIcon icon={faKey}></FontAwesomeIcon></IconButton>
          <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Access</DialogTitle>
            <DialogContent>
              <DialogContentText>
              individuals and e-groups who have access to{" "}
            <b>{compAccessToEdit.compAccessToEdit}</b>
              </DialogContentText>
              <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>
                  <h2>Username</h2>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <h3>aaltatar</h3>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="removeAceess"
                    onClick={() => {
                      openSnackbar("Removed", "success");
                    }}
                  >
                    <FontAwesomeIcon icon={faUserXmark} color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: "30px",
            }}
          >
            <AccountCircle
              sx={{
                color: "action.active",
                mr: 1,
                my: 0.5,
                fontSize: "30px",
              }}
            />
            <TextField
              id="input-with-sx"
              label="Username OR e-group"
              variant="standard"
            />
            <Button
              onClick={HandleAddAccess}
              style={{
                backgroundColor: "green",
                color: "white",
                marginLeft: "10px",
              }}
            >
              Add
            </Button>
          </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
  );
}

export default AccessManger;
