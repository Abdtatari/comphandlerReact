import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Config } from "../constants";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// search component is the component used to search through the CERN LDAP database
export default function SearchComponent({ handleOptionSelected,typeValues,selectedType,handleOnChange }) {
  let [searchTerm, setSearchTerm] = useState("");
  let [options, setOptions] = useState([]);
  let [loading, setLoading] = useState(false);
  let [open, setOpen] = useState(false);
  let [isGroup,setIsGroup]=useState(false)
  useEffect(() => {
    let active = true;
    let timeoutId;

    if (!searchTerm) {
      setOptions([]);
      handleOptionSelected("");
      return;
    }
    setLoading(true);

    function search() {
      if (selectedType == "Groups") {
        setIsGroup(true);
      }
      else{
        setIsGroup(false)
      }
      fetch(
        Config.search + "?search_filter=" + searchTerm + "&isGroup=" + isGroup
      )
        .then((res) => res.json())
        .then((data) => {
          if (active) {
            setOptions(data);
            setLoading(false);
          }
        })
        .catch((error) => {});
    }

    // this is used to make sure we do not send multiple requests at a time and only do it once the user stops typing
    // it calls the search function when the typing is finished
    function handleTypingFinished() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(search, 500);
    }

    handleTypingFinished();
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchTerm,selectedType]);

  return (
    <>
      <Autocomplete
        sx={{
          width: "30%",
        }}
        isOptionEqualToValue={(option, value) => {
          return (
            option.displayName === value.displayName ||
            option.username === value.username
          );
        }}
        open={open}
        options={options}
        fullWidth
        getOptionLabel={(option) =>
          option.displayName + " " + option.username
        }
        onChange={(event, option) => {
          if (option) {
            handleOptionSelected(option);
          }
        }}
        noOptionsText={"CERN Search Center"}
        onOpen={() => {
          setOptions([]);
          setOpen(true);
        }}
        onClose={() => {
          setOptions([]);
          setLoading(false);
          setOpen(false);
        }}
        loading={loading}
        renderOption={(props, option, { selected }) => (
          <ListItem {...props}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Typography alignItems={"start"} variant="body2">
                {option.displayName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {option.username}
              </Typography>
            </Box>
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            id="search-component"
            {...params}
            label={selectedType=="Groups" ? "Groups" : "Personal"}
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
         <FormControl
        sx={{
          marginLeft: "15px",
        }}
      >
        <FormLabel id="demo-row-radio-buttons-group-label">
          Type
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selectedType}
          onChange={handleOnChange}
        >
          <FormControlLabel
            value={typeValues[0]}
            control={<Radio />}
            label={typeValues[0]}
          />
          <FormControlLabel
            value={typeValues[1]}
            control={<Radio />}
            label={typeValues[1]}
          />
        </RadioGroup>
      </FormControl>
    </>
  );
}
