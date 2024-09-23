import { Config } from "../constants";
import { sessionModel } from "../model/sessionModel";

export function getRevisionsFromGit (detector,componentName,setRevisions,setSelectedRevision,setLoading){
    setLoading(true)
    fetch(Config.getRevisions + " ?detectorName=" + detector+"&compName="+componentName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRevisions(data)
        setSelectedRevision(data[0])
        setLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Loading is complete, even in case of an error
      });    
}

export function getWebGITPathUsingName(detector,componentName,setShowLogURL){
    fetch(Config.getWebGITPathUsingName + " ?detectorName=" + detector+"&compName="+componentName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        const cleanedData = data.replace(/\s+/g, "");
        setShowLogURL(cleanedData)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });   
}

export function getFilesFromGit(detectorname,compname,Version,revision,tagpath,setLoading,setOpen,openSnackbar){
  setLoading(true)
    fetch(Config.gitFilesImportService, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compName: compname,
        compVersion: Version,
        detectorName: detectorname,
        gitRev: revision,
        gitTag: tagpath,
        userName:sessionModel.username
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status=="success"){
        openSnackbar("Imported Successfully", "success");
        setOpen(false)
      }
      else {
        openSnackbar("Something wrong happend from the backend", "error");
      }
      setLoading(false)
    })
    .catch((error) => {
      openSnackbar("Something wrong happend : "+error, "error");
      console.error('Error:', error);
      setLoading(false)
    });
  }
  export function patchFilesFromGit(detectorname,compname,Version,revision,setLoading,setOpen,openSnackbar){
    setLoading(true)
      fetch(Config.patchGitFileService, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compName: compname,
          compVersion: Version,
          detectorName: detectorname,
          gitRev: revision,
          userName:sessionModel.username
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status=="success"){
          openSnackbar("Patched Successfully", "success");
          setOpen(false)
        }
        else {
          openSnackbar("Something wrong happend from the backend "+data.message, "error");
        }
        setLoading(false)
      })
      .catch((error) => {
        openSnackbar("Something wrong happend : "+error, "error");
        console.error('Error:', error);
        setLoading(false)
      });
    }
  

