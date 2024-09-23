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
import { Box, Paper, Tab } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SnackbarContext from "../utils/SnackbarContext";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Config } from "../constants";
import SearchComponent from "./searchComponent";
import { tableState } from "../model/componentTableModel";

function AccessManger(compAccessToEdit) {
  const { openSnackbar } = useContext(SnackbarContext);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [loading, setLoading] = useState(true);
  const [accessList, setAccessList] = useState([]);
  const [inherited,setInherited]=useState(false)
  const [name, setName] = useState("");

  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("User");
  const [allowSetActive, setAllowSetActive] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const HandleRemoveAccess = (id) => {
    setLoading(true);
    fetch(Config.removeAccess + "?id=" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data[0].result) {
          openSnackbar("Addess Successfully", "success");
        } else {
          openSnackbar("something wrong happened", "error");
        }
        getAccess();
        setLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        openSnackbar("something wrong happened : " + error, "error");
        setLoading(false);
      })
  };

  const HandleAddAccess = () => {
    if (username != "") {
      setLoading(true);
      let allowIsActive = "false";
      let isGroup = "false";
      if (userType == "Groups") {
        isGroup = "true";
      }
      if (allowSetActive) {
        allowIsActive = "true";
      }
      fetch(
        Config.addAccess +
          "?id=" +
          compAccessToEdit.compAccessToEdit[
            compAccessToEdit.compAccessToEdit.length - 1
          ].id +
          "&name=" +
          username +
          "&type=" +
          isGroup +
          "&setIsActive=" +
          allowIsActive
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data[0].result) {
            openSnackbar("Addess Successfully", "success");
          } else {
            openSnackbar("something wrong happened", "error");
          }
          getAccess();
          setLoading(false); // Loading is complete
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          openSnackbar("something wrong happened : " + error, "error");
          setLoading(false);
        });
    } else {
      openSnackbar("Username is Empty", "error");
    }
  };

  function getAccess() {
    if (open) {
      setLoading(true);
      if (compAccessToEdit.compAccessToEdit.length == 0) {
        compAccessToEdit = { id: -1, name: "All" };
        setName(compAccessToEdit.name);
      } else {
        compAccessToEdit = {
          id: compAccessToEdit.compAccessToEdit[
            compAccessToEdit.compAccessToEdit.length - 1
          ].id,
          name: compAccessToEdit.compAccessToEdit[
            compAccessToEdit.compAccessToEdit.length - 1
          ].name,
        };
        setName(compAccessToEdit.name);
      }
      fetch(Config.getAccessGrant + "?id=" + compAccessToEdit.id)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAccessList(data['accessList']); // Set the data in state
          setInherited(data['inherited'])
          setLoading(false); // Loading is complete
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false); // Loading is complete, even in case of an error
        });
    }
  }

  useEffect(() => {
    getAccess();
  }, [open]);

  return (
    <React.Fragment>
      <IconButton aria-label="access" onClick={handleClickOpen}>
        <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
      </IconButton>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            individuals and e-groups who have access to <b>{name}</b>
          </DialogContentText>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
                  marginTop: "30px",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Grantee Name</TableCell>
                    <TableCell>Grantee Type</TableCell>
                    <TableCell>Granted Component/Detector</TableCell>
                    <TableCell>Allow set active</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                        {" "}
                        <CircularProgress />{" "}
                      </TableCell>
                    </TableRow>
                  ) : (
                    accessList.map((value) => {
                      let row = value;
                      return (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{row.GRANTEE_NAME}</TableCell>
                          <TableCell>{row.Type==0?"User":"Group"}</TableCell>
                          <TableCell>{row.DIR_META_NAME}</TableCell>
                          <TableCell>
                            {row.SET_FILE_ACTIVE.toString()}
                          </TableCell>
                          {inherited? (
                            <TableCell>inherited</TableCell>
                          ) :  <TableCell>
                          <IconButton
                            aria-label="removeAceess"
                            onClick={() => HandleRemoveAccess(row.id)}
                          >
                            <FontAwesomeIcon
                              icon={faUserXmark}
                              color="error"
                            />
                          </IconButton>
                        </TableCell>}

                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <br />
          {name != "All" ? (
            <>
              <h3>Add Access</h3>
              <Box
                sx={{
                  display: "flex",
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
                <SearchComponent
                  handleOptionSelected={(e) => {
                    setUsername(e.username);
                  }}
                  typeValues={["User", "Groups"]}
                  selectedType={userType}
                  handleOnChange={(e) => {
                    setUserType(e.target.value);
                    setUsername("");
                  }}
                ></SearchComponent>
              </Box>
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowSetActive}
                    onChange={() => setAllowSetActive(!allowSetActive)}
                  />
                }
                label="Allow set active component"
              />

              <br />
              <Button
                onClick={HandleAddAccess}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginTop: "20px",
                }}
              >
                Add
              </Button>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AccessManger;
