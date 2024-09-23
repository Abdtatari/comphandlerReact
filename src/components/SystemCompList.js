import React, { useEffect, useState ,useContext} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { getSystemComponents } from "../dataSource/configDAOs";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import { editDependentComp } from "../dataSource/configDAOs";
import SnackbarContext from "../utils/SnackbarContext";
const SystemComponentList = ({componentID,dependentComps,setReload}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [componentList, setComponentList] = useState([]);
  const [filteredComponentList, setFilteredComponentList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { openSnackbar } = useContext(SnackbarContext);
  const handleClickOpen = () => {
    setCheckedItems([])
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    editDependentComp(componentID,checkedItems,setOpen,setLoading,openSnackbar,setReload)
  };
  useEffect(() => {
      getSystemComponents(setComponentList, setFilteredComponentList,setLoading);
  }, []);
  useEffect(()=>{
      const idsToRemove = new Set(dependentComps.map(item => item.id));
      const newArray = componentList.filter(item => !idsToRemove.has(item.id));
        setFilteredComponentList(newArray);
  },[dependentComps,componentList,filteredComponentList])

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setCheckedItems((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch();
  };

  const handleSearch = () => {
    const filtered = componentList.filter(comp => 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComponentList(filtered);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>Browse Components</Button>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Component List</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose Dependent Component</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <TextField 
              label="Search Components"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              margin="normal"
            />
            {loading ? (
              <CircularProgress sx={{ mx: 'auto' }}/>
            ) : filteredComponentList.length === 0 ? (
              "No Result"
            ) : (
              <FormGroup>
                {filteredComponentList.map((comp, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox 
                        value={comp.id}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={comp.name}
                  />
                ))}
              </FormGroup>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default SystemComponentList;
