import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import "./css/EditPage.css";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
const EditComponent = () => {
  const location = useLocation();
  const component = location.state && location.state.data;
  const level = location.state && location.state.level;
  const backID = location.state && location.state.id;

  const navigate = useNavigate();
  const [depCompIsLoading, setDepCompIsLoading] = useState(false);
  const [projectTargetIsLoading, setProjectTargetIsLoading] = useState(false);

  const [componentName, setComponentName] = useState({
    name: component.name,
    version: component.version,
    revision: component.revision,
  });
  const [versionReplaced, setVersionReplaced] = useState([
    component.version,
    "4.0.9",
    "4.1.0",
    "4.1.1",
    "4.1.2",
  ]);
  const [dependentComponent, setDependentComponent] = useState([
   
  ]);
  const [SelectedVersion, setSelectedVersion] = useState(component.version);
  const [isActive, setIsActive] = useState(component.isActive);
  const [projectTargetedComponent,setProjectTargetedComponent] = useState([]);
  const handleChange = (event) => {
    setSelectedVersion(event.target.value);
  };

  useEffect(() => {
    setDepCompIsLoading(true)
    setProjectTargetIsLoading(true)

    fetch(Config.getDepComponent +"?id="+component.id+"&takeLatestVersion="+true ) //+ component.componentID
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
       console.log(data)
       setDependentComponent(data)
       setDepCompIsLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setDepCompIsLoading(false); // Loading is complete, even in case of an error
      });
      
      fetch(Config.getProjectTagretComponent +"?id="+component.name ) //+ component.componentID
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
       setProjectTargetedComponent(data)
       setProjectTargetIsLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setProjectTargetIsLoading(false); // Loading is complete, even in case of an error
      });
      
  }, []);
  const goBack = () => {
		navigate(-1);
	}
  return (
    <div className="table-div">
      <div className="header">
        <div className="backIcon">
          <IconButton
           onClick={goBack}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        <b>{componentName.name + " "}</b>
        Version: <b style={{ color: "green" }}>{componentName.version + " "}</b>
        Rev. <b style={{ color: "green" }}>{componentName.revision}</b>
        <div className="header_buttons">
          <div>
            <Button variant="contained" style={{ margin: "15px" }}>
              Show log
            </Button>
            <Button variant="contained">Generate Configuration</Button>
          </div>
        </div>
      </div>
      <div className="section_header">
        <p>Dependent Components</p>
      </div>
      <div className="section_content">
        <div className="dependent_components_list">
          <TableContainer>
            <Table>
              <TableBody>
                {depCompIsLoading?(<TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                    {" "}
                    <CircularProgress />{" "}
                  </TableCell>
                </TableRow>):(
                dependentComponent.map((dependentComponent, index) => (
                  <TableRow key={index}>
                    <TableCell>{dependentComponent.name}</TableCell>
                    <TableCell>
                    <IconButton aria-label="delete" size="large">
                      <DeleteIcon/>
                    </IconButton>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className="section_header">
        <p>Set Active Component</p>
      </div>
      <div className="section_content">
        <p style={{ display: "inline-table" }}>
          Current Active Version to be replaced
        </p>
        <br />
        <Select
          labelId="version-label"
          id="version-select"
          value={SelectedVersion}
          label="version"
          onChange={handleChange}
        >
          {versionReplaced.map((version, index) => (
            <MenuItem value={version}>{version}</MenuItem>
          ))}
        </Select>
        <div className="checkbox-section">
          <Checkbox checked={isActive} onChange={() => setIsActive(!isActive)}>
            is Active
          </Checkbox>
        </div>
        <br />
        <div style={{ marginTop: "20px" }}>
          <Button variant="contained" style={{ marginRight: "20px" }}>
            Apply
          </Button>
          <Button variant="contained" style={{ backgroundColor: "gray" }}>
            Cancel
          </Button>
        </div>
      </div>
      <div className="section_header">
        <p>Projects where this component is targeted</p>
      </div>
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
              {projectTargetIsLoading?(<TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                    {" "}
                    <CircularProgress />{" "}
                  </TableCell>
                </TableRow>):
              projectTargetedComponent.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{project.SYSTEM_NAME}</TableCell>
                  <TableCell>{project.HOSTNAME}</TableCell>
                  <TableCell>{project.MAIN_PATH}</TableCell>
                  <TableCell>{project.OVERWRITE_FILES==1?"Yes":"No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="section_header">
        <p>Force Command</p>
      </div>
      <div className="section_content">
        <h3>Force Recreate DPL files and XML</h3>
        <h4 style={{ color: "green" }}>
          * Use this command to fix any problem with the component XML file or
          DPL list
        </h4>
        <Button variant="contained">Recreate and Download</Button>
      </div>
    </div>
  );
};

export default EditComponent;
