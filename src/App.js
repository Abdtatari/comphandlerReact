import * as React from 'react';
import { useContext } from "react";
import { Outlet, Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from "history";
import ComponentsTable from './pages/componentTables';
import HistoryTable from './pages/historyTable-component';
import CustomAppHeader from './components/CustomAppHeader'
import ComponentConfigurations from './pages/componentConfigurations';
import './App.css';
import EditComponent from './pages/EditPage' ;
import CreateNewSteeper from './pages/CreateNewSteeper';
import {Snackbar, Alert } from "@mui/material";
import SnackbarContext from './utils/SnackbarContext';

function App() {
  const { snackbarOpen, snackbarMessage, snackbarSeverity, closeSnackbar } = useContext(SnackbarContext);

  return (
    <>
    <Snackbar
        open={snackbarOpen}
        onClose={closeSnackbar}
        autoHideDuration={6000}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <CustomAppHeader />
      <Router>
        <Routes>
          <Route path="/webcenter/portal/CMSOnline/pages_home/dcs/componenthandler/" element={<ComponentsTable />} />
          <Route path="/webcenter/portal/CMSOnline/pages_home/dcs/componenthandler/history/:componentID" element={<HistoryTable />} />
          <Route path="/webcenter/portal/CMSOnline/pages_home/dcs/componenthandler/edit" element={<EditComponent/>} />
          <Route path="/webcenter/portal/CMSOnline/pages_home/dcs/componenthandler/createNew" element={<CreateNewSteeper/>} />
          <Route path="/webcenter/portal/CMSOnline/pages_home/dcs/componenthandler/configurations" element={<ComponentConfigurations/>} />
        </Routes>
      </Router>
    </>
  );
}


export default App;