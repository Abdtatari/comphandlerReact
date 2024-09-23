import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import { ScaleText } from "react-scale-text";
import {
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Grid
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AssociatedManagerDialog from "./AssociatedManagersDialog";
export default function AssociatedManagerTable({ managerList }) {
  const [open, setOpen] = React.useState(false);

  React.useState(false);
  const [associatedManagersLoading, setAssociatedManagersLoading] =
    useState(false);

  const [associatedManagers, setAssociatedManagers] = useState(managerList);
  return (
    <React.Fragment>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          <b>Associated Managers</b>
          <AssociatedManagerDialog isNew={true} />
        </Typography>
        <div>
          <>
            {/* <Resizable 
            className="item"
            width={320}
            height={200}
            > */}
              <div >
                <TableContainer component={Paper}>
                  <Table aria-label="a dense table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <h4>Manager Type</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Num</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Command Line</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Start mode</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>is Driver</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Restart</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Options</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {associatedManagersLoading ? (
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                            {" "}
                            <CircularProgress />{" "}
                          </TableCell>
                        </TableRow>
                      ) : associatedManagers.length <= 0 ? (
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                            <h3>No Managers</h3>
                          </TableCell>
                        </TableRow>
                      ) : (
                        associatedManagers.map((associatedManager, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {associatedManager.MANAGER_TYPE}
                            </TableCell>
                            <TableCell>{associatedManager.NUM}</TableCell>
                            <TableCell>
                              <p>
                              {associatedManager.COMMAND_LINE}
                              </p>
                            </TableCell>
                            <TableCell>
                              {associatedManager.START_MODE}
                            </TableCell>
                            <TableCell>{associatedManager.IS_DRIVER}</TableCell>
                            <TableCell>{associatedManager.RESTART}</TableCell>
                            <TableCell align="center">
                              <AssociatedManagerDialog
                                isNew={false}
                                manager={associatedManager}
                              />
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
            {/* </Resizable> */}
          </>
        </div>
      </Grid>
    </React.Fragment>
  );
}
