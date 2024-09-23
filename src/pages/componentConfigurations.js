import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import SnackbarContext from "../utils/SnackbarContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
} from "@mui/material";
import ConfDialog from "../components/configrationsDialog";
import "./css/EditPage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Download } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import CancelIcon from "@mui/icons-material/Cancel";
import GroupsDialog from "../components/groupsDialog";
import AssociatedManagerDialog from "../components/AssociatedManagersDialog";
import DriverDialog from "../components/DriversDialog";
import AssociatedManagerTable from "../components/ManagersTable";
import DriversTable from "../components/DriversTable";
import { Config } from "../constants";
import {
  getConfAssociatedToComponent,
  getComponentId,
  getCurrentConf,
  getManagersAndDrivers,
  downloadConfigXml
} from "../dataSource/configDAOs";
import ImportConf from "../components/importConf";
export default function ComponentConfigurations() {
  const { openSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const location = useLocation();
  const component = location.state && location.state.data;

  const [componentAssociatedConf, setComponentAssociatedConf] = useState([]);
  const [associatedConfAndGroupsLoading, setAssociatedConfAndGroupsLoading] =
    useState(false);

  const [currentConfLoading, setCurrentConfLoading] = useState(false);
  const [componentFileID, setComponentID] = useState(874716);
  const [currentConf, setCurrentConf] = useState([]);
  const [groupsAssociated, setGroupsAssociated] = useState([]);

  const [managerAndDriversLoading, setManagerAndDriversLoading] =
    useState(false);
  const [managersList, setManagerList] = useState([]);
  const [driversList, setDriverList] = useState([]);
  const [projectInfo,setProjectInfo]=useState([])

  const handleDownloadConfigXml = () => {
  downloadConfigXml(componentFileID);
  };
  useEffect(() => {
    getConfAssociatedToComponent(
      component.name,
      component.version,
      false,
      setComponentAssociatedConf,
      setProjectInfo,
      setGroupsAssociated,
      setAssociatedConfAndGroupsLoading
    );
    getCurrentConf(
      component.name,
      component.version,
      setCurrentConf,
      setCurrentConfLoading
    );
    getManagersAndDrivers(
      component.name,
      component.version,
      setManagerList,
      setDriverList,
      setManagerAndDriversLoading
    );
  }, []);

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="table-div">
      <div className="header">
        <div className="backIcon">
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <b>{component.name + " "}</b>
        Version: <b style={{ color: "green" }}>{component.version + " "}</b>
        <div className="header_buttons" style={{ margin: "15px" }}>
          <div>
            <ImportConf component={component}/>
          </div>
        </div>
      </div>
      <Accordion defaultExpanded>
        <div className="section_header_conf">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p>Manager to Add / Drivers to Stop on Installation</p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <div sx={{ align: "center" }}>
              {managerAndDriversLoading ? (
                <CircularProgress sx={{ display: "flex", margin: "auto" }} />
              ) : (
                <>
                  <Grid container spacing={2}>
                    <AssociatedManagerTable managerList={managersList} />
                    <DriversTable driversList={driversList} />
                  </Grid>
                </>
              )}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <div className="section_header_conf">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p>
              Configurations associated to the component
              <ConfDialog isNew={true} />
            </p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <h3>Name</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Tag Name</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Pattern</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Logical</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Hardware</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Conf DB</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Force Reinstall</h3>
                      </TableCell>
                      <TableCell align="center">
                        <h3>Options</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {associatedConfAndGroupsLoading ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                          {" "}
                          <CircularProgress />{" "}
                        </TableCell>
                      </TableRow>
                    ) : componentAssociatedConf.length <= 0 ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                          <h3>no data</h3>
                        </TableCell>
                      </TableRow>
                    ) : (
                      componentAssociatedConf.map((associatedConf, index) => (
                        <TableRow key={index}>
                          <TableCell>{component.name}</TableCell>
                          <TableCell>
                            {associatedConf.tagname.length > 18
                              ? associatedConf.tagname.substring(0, 15) + "..."
                              : associatedConf.tagname}
                          </TableCell>
                          <TableCell>
                            {associatedConf.pattern == null
                              ? " "
                              : associatedConf.pattern.length > 13
                              ? associatedConf.pattern.substring(0, 10) + "..."
                              : associatedConf.pattern}
                          </TableCell>
                          <TableCell>
                            {associatedConf.logical ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {associatedConf.hardware ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {associatedConf.ConfDB == null
                              ? "Null"
                              : associatedConf.ConfDB}
                          </TableCell>
                          <TableCell>
                            {associatedConf.force_reinstall ? "Yes" : "No"}
                          </TableCell>
                          <TableCell align="center">
                            <ConfDialog isNew={false} config={associatedConf} />
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <div className="section_header_conf">
          <AccordionSummary
           expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
           aria-controls="panel1-content"
           id="panel1-header"
          >
            <p>
              Groups associated to the component and empty groups
              <GroupsDialog isNew={true} />
            </p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <h3>Name</h3>
                      </TableCell>
                      <TableCell align="right">
                        <h3>Options</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {associatedConfAndGroupsLoading ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                          {" "}
                          <CircularProgress />{" "}
                        </TableCell>
                      </TableRow>
                    ) : groupsAssociated.length <= 0 ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                          <h3>no data</h3>
                        </TableCell>
                      </TableRow>
                    ) : (
                      groupsAssociated.map((groupAssociated, index) => (
                        <TableRow key={index}>
                          <TableCell>{groupAssociated.name}</TableCell>
                          <TableCell align="right">
                            <GroupsDialog
                              isNew={false}
                              group={groupAssociated}
                              configurations={componentAssociatedConf}
                              projectInfo={projectInfo}
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
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <div className="section_header_conf">
          <AccordionSummary
           expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
           aria-controls="panel1-content"
           id="panel1-header"
          >
          <p>Current Configurations</p>
          <Button
          onClick={handleDownloadConfigXml}
              variant="contained"
              startIcon={<Download />}
              sx={{ marginRight: "15px",marginLeft: "15px" ,marginTop: "5px",marginBottom: "5px"}}
              color="success"
                 >
              Download Config XML
            </Button>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <h3>Name</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Tag Name</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Pattern</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Logical</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Hardware</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Conf DB</h3>
                      </TableCell>
                      <TableCell align="left">
                        <h3>Force Reinstall</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentConfLoading ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                          {" "}
                          <CircularProgress />{" "}
                        </TableCell>
                      </TableRow>
                    ) : currentConf.length <= 0 ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                          <h3>no data</h3>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentConf.map((currentConf, index, arr) => (
                        <TableRow key={index}>
                          <TableCell>
                            {index > 0 &&
                            currentConf.system_name ===
                              arr[index - 1].system_name
                              ? ""
                              : currentConf.system_name}
                          </TableCell>
                          <TableCell>{currentConf.tagname}</TableCell>
                          <TableCell>
                            {currentConf.pattern == null
                              ? " "
                              : currentConf.pattern.length > 13
                              ? currentConf.pattern.substring(0, 10) + "..."
                              : currentConf.pattern}
                          </TableCell>
                          <TableCell>
                            {currentConf.logical == "true" ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {currentConf.hardware == "true" ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {currentConf.confdb == null
                              ? "Null"
                              : currentConf.confdb}{" "}
                          </TableCell>
                          <TableCell>
                            {currentConf.force_reinstall == "true"
                              ? "Yes"
                              : "No"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
