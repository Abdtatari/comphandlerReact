import React, { useEffect, useState, version, useContext } from "react";
import { Config } from "../constants";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  AccordionDetails,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./css/EditPage.css";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  getDepComponent,
  getProjectTagretComponent,
  getcomponentActiveVersion,
} from "../dataSource/componentDAOs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SystemComponentList from "../components/SystemCompList";
import {
  changeActiveVersion,
  generateConfig,
  getWebGITPath,
  recreateAndDownload,
} from "../dataSource/configDAOs";
import FormControl from "@mui/material/FormControl";
import { tableState } from "../model/componentTableModel";
import SnackbarContext from "../utils/SnackbarContext";
import RemoveDepCompConfirmationAlert from "../components/RemoveDepCompConfirmationAlert";
import ConfirmationDialog from "../components/confirmationDialog";
import { sessionModel } from "../model/sessionModel";

const EditComponent = () => {
  const location = useLocation();
  const component = location.state && location.state.data;
  const level = location.state && location.state.level;
  const backID = location.state && location.state.id;
  const { openSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const [depCompIsLoading, setDepCompIsLoading] = useState(false);
  const [projectTargetIsLoading, setProjectTargetIsLoading] = useState(false);
  const [activeVersiosLoading, setActiveVersiosLoading] = useState(false);
  const [showActiveVersions, setShowActiveVersions] = useState(false);
  const [componentName, setComponentName] = useState({
    name: component.name,
    version: component.version,
    revision: component.revision,
  });
  const [activeVersios, setActiveVersios] = useState([]);

  const [dependentComponents, setDependentComponents] = useState([]);
  const [SelectedVersion, setSelectedVersion] = useState(component.version);
  const [isActive, setIsActive] = useState(component.isActive);
  const [projectTargetedComponent, setProjectTargetedComponent] = useState([]);
  const [canEdit, setCanEdit] = useState(false);

  const [reload, setReload] = useState(true);

  const handleChange = (event) => {
    setSelectedVersion(event.target.value);
  };
  const handleRecreateAndDownload = async () => {
    recreateAndDownload(component.id, openSnackbar);
  };

  useEffect(() => {
    if (sessionModel.isAdmin) {
      setCanEdit(true);
    }
    if (reload) {
      getDepComponent(
        component.id,
        setDependentComponents,
        setDepCompIsLoading
      );
      getProjectTagretComponent(
        component.name,
        component.version,
        setProjectTargetedComponent,
        setProjectTargetIsLoading
      );
      getcomponentActiveVersion(
        component.name,
        setActiveVersios,
        setActiveVersiosLoading
      );
      if (!isActive) {
        setShowActiveVersions(true);
      }
      setReload(false);
    }
  }, [reload]);

  const goBack = () => {
    navigate(-1);
  };
  const handleGenerateConf = async () => {
    generateConfig(component.id, openSnackbar);
  };
  const handleChangeActive=()=>{
    if (activeVersios.length==0){
      /// do smth
    }
    else if (activeVersios.length==1)
    changeActiveVersion(component,activeVersios[0],isActive,setActiveVersiosLoading,openSnackbar)
  else {
    changeActiveVersion(component,SelectedVersion,isActive,setActiveVersiosLoading,openSnackbar)

  }
  }
  const handleShowLog = async () => {
    getWebGITPath(tableState.path, component.fullRevision);
  };
  return (
    <div className="table-div">
      <div className="header">
        <div className="backIcon">
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <b>{componentName.name + " "}</b>
        Version: <b style={{ color: "green" }}>{componentName.version + " "}</b>
        Rev. <b style={{ color: "green" }}>{componentName.revision}</b>
        <div className="header_buttons">
          <div>
            <Button
              variant="contained"
              style={{ margin: "15px" }}
              onClick={handleShowLog}
            >
              Show log
            </Button>
            <Button variant="contained" onClick={handleGenerateConf}>
              Generate Configuration
            </Button>
          </div>
        </div>
      </div>
      <Accordion defaultExpanded>
        <div className="section_header">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p>Dependent Components</p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <SystemComponentList
              componentID={component.id}
              dependentComps={dependentComponents}
              setReload={setReload}
            />

            <div className="dependent_components_list">
              <TableContainer>
                <Table>
                  <TableBody>
                    {depCompIsLoading ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                          {" "}
                          <CircularProgress />{" "}
                        </TableCell>
                      </TableRow>
                    ) : (
                      dependentComponents.map((dependentComp, index) => (
                        <TableRow key={index}>
                          <TableCell>{dependentComp.name}</TableCell>
                          <TableCell>
                            <RemoveDepCompConfirmationAlert
                              component={dependentComp}
                              setReload={setReload}
                            />
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
        <div className="section_header">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p>Set Active Component</p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            {showActiveVersions ? (
              activeVersiosLoading ? (
                <CircularProgress />
              ) : activeVersios.length == 0 ? (
                <p>(no version)</p>
              ) : activeVersios.length == 1 ? (
                <>
                  <p style={{ display: "inline-table" }}>
                    Current Active Version to be replaced
                    <b style={{ color: "green" }}>
                      {" " + activeVersios[0].version}
                    </b>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ display: "inline-table" }}>
                    Current Active Version to be replaced
                  </p>
                  <br />
                  {canEdit ? (
                    <Select
                      labelId="version-label"
                      id="version-select"
                      value={SelectedVersion}
                      label="version"
                      onChange={handleChange}
                    >
                      {activeVersios.map((version, index) => (
                        <MenuItem value={version.version}>
                          {version.version}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <FormControl sx={{ m: 1, minWidth: 120 }} disabled>
                      <Select
                        labelId="version-label"
                        id="version-select"
                        value={SelectedVersion}
                        label="version"
                      >
                        {activeVersios.map((version, index) => (
                          <MenuItem value={version.version}>
                            {version.version}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )
            ) : null}
            <div className="checkbox-section">
              <FormGroup>
                <FormControlLabel
                  control={
                    canEdit ? (
                      <Checkbox
                        label="is Active"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                      ></Checkbox>
                    ) : (
                      <Checkbox
                        disabled
                        label="is Active"
                        checked={isActive}
                      ></Checkbox>
                    )
                  }
                  label="is Active"
                />
              </FormGroup>
            </div>
            <br />
            <div style={{ marginTop: "20px" }}>
              {canEdit ? (
                <Button variant="contained" style={{ marginRight: "20px" }} onClick={handleChangeActive}>
                  Apply
                </Button>
              ) : (
                <Button
                  disabled
                  variant="contained"
                  style={{ marginRight: "20px" }}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <div className="section_header">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p>Projects where this component is targeted</p>
          </AccordionSummary>
        </div>
        <AccordionDetails>
          <div className="section_content">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>System Name</TableCell>
                    <TableCell>Host Name</TableCell>
                    <TableCell>Main Path</TableCell>
                    <TableCell>Over Write files</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectTargetIsLoading ? (
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                        {" "}
                        <CircularProgress />{" "}
                      </TableCell>
                    </TableRow>
                  ) : projectTargetedComponent.length == 0 ? (
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                        {" "}
                        No Projects found{" "}
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectTargetedComponent.map((project, index) => (
                      <TableRow key={index}>
                        <TableCell>{project.SYSTEM_NAME}</TableCell>
                        <TableCell>{project.HOSTNAME}</TableCell>
                        <TableCell>{project.MAIN_PATH}</TableCell>
                        <TableCell>
                          {project.OVERWRITE_FILES == 1 ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </AccordionDetails>
      </Accordion>

      <div className="section_header">
        <p>Force Command</p>
      </div>
      <div className="section_content">
        <h3>Force Recreate DPL files and XML</h3>
        <h4 style={{ color: "green" }}>
          * Use this command to fix any problem with the component XML file or
          DPL list
        </h4>
        <Button variant="contained" onClick={handleRecreateAndDownload}>
          Recreate and Download
        </Button>
      </div>
    </div>
  );
};

export default EditComponent;
