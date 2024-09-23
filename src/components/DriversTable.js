import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import ScaleText from "react-scale-text";
import {
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Grid,
} from "@mui/material";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState, useContext } from "react";
import DriverDialog from "./DriversDialog";
export default function DriversTable({ driversList }) {
  const [open, setOpen] = React.useState(false);

  React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [driversLoading, setDriversLoading] = useState(false);

  const [drivers, setDrivers] = useState(driversList);

  return (
    <React.Fragment>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          <b>Drivers to stop</b>
          <DriverDialog isNew={true} />
        </Typography>
        <div>
          <>
            <div>
              <div component={Paper}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <h4>Manager Type</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Num</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Options</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Start Mode</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Options</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {driversLoading ? (
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                            {" "}
                            <CircularProgress />{" "}
                          </TableCell>
                        </TableRow>
                      ) : drivers.length <= 0 ? (
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                            <h3>No Drivers</h3>
                          </TableCell>
                        </TableRow>
                      ) : (
                        drivers.map((driver, index) => (
                          <TableRow key={index}>
                            <TableCell>{driver.MANAGER_NAME}</TableCell>
                            <TableCell>{driver.NUM}</TableCell>
                            <TableCell><p>{driver.OPTIONS}</p></TableCell>
                            <TableCell>{driver.START_MODE}</TableCell>
                            <TableCell align="center">
                              <DriverDialog isNew={false} driver={driver} />
                              <IconButton aria-label="remove">
                                <CancelIcon color="error" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </>
        </div>
      </Grid>
    </React.Fragment>
  );
}
