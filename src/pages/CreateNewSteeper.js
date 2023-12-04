import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState,useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from '@mui/material';
import SnackbarContext from "../utils/SnackbarContext";

const steps = ['Select First Step', 'Create Second', 'Generate third'];

export default function CreateNewSteeper() {
  const { openSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const location = useLocation();
  const createNew = location.state && location.state.data;

  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDone = () => {
    openSnackbar(createNew + " Generated Successfully", "success");
    navigate(-1);
  };
  const goBack = () => {
		navigate(-1);
	}
  return (

    <Box sx={{ width: '100%' }}>
       <div>
          <IconButton
           onClick={goBack}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
      <h2>Create New {createNew}</h2>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleDone}>Done</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
