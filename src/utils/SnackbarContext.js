import React, { createContext, useState } from 'react';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity , setSnackbarSeverity] = useState("error")

  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity)
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        openSnackbar,
        closeSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
