import { Config } from "../constants";
import { sessionModel } from "../model/sessionModel";
export function getConfAssociatedToComponent(
  name,
  version,
  otherVersions,
  setComponentAssociatedConf,
  setProjectInfo,
  setGroupsAssociated,
  setAssociatedConfAndGroupsLoading
) {
  setAssociatedConfAndGroupsLoading(true);
  fetch(
    Config.getConfAssociatedToComponent +
      "?name=" +
      name +
      "&version=" +
      version +
      "&otherVersions=" +
      otherVersions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setComponentAssociatedConf(data["configurations"]); // Set the data in state
      setProjectInfo(data["projectInfo"]);
      setGroupsAssociated(data["groups"]);
      setAssociatedConfAndGroupsLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setAssociatedConfAndGroupsLoading(false); // Loading is complete, even in case of an error
    });
}

export function getComponentId(setPageLoading, setComponentID, name, version) {
  setPageLoading(true);
  fetch(Config.getComponentID + " ?name=" + name + "&version=" + version)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setComponentID(data); // Set the data in state
      setPageLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setPageLoading(false); // Loading is complete, even in case of an error
    });
}

export function getSystemComponents(
  setComponentList,
  setFilteredComponentList,
  setLoading
) {
  setLoading(true);
  fetch(Config.systemComponent)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setComponentList(data); // Set the data in state
      setFilteredComponentList(data);
      setLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false); // Loading is complete, even in case of an error
    });
}

export function getWebGITPath(path, revision) {
  fetch(Config.getWebGITPath + "?path=" + path + "&revision=" + revision)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      const cleanedData = data.replace(/\s+/g, "");
      const newWindow = window.open(
        cleanedData,
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

export function getCurrentConf(
  name,
  version,
  setCurrentConf,
  setCurrentConfLoading
) {
  setCurrentConfLoading(true);
  fetch(Config.getCurrentConf + "?name=" + name + "&version=" + version)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setCurrentConf(data); // Set the data in state
      setCurrentConfLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setCurrentConfLoading(false);
    });
}
export function getManagersAndDrivers(
  name,
  version,
  setManagerList,
  setDriverList,
  setManagerAndDriversLoading
) {
  setManagerAndDriversLoading(true);
  fetch(Config.getManagersAndDrivers + "?name=" + name + "&version=" + version)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setManagerList(data["managers"]);
      setDriverList(data["drivers"]);
      setManagerAndDriversLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setManagerAndDriversLoading(false);
    });
}
export function getProjectsTargetConf(
  id,
  setProjectsTargetConf,
  setprojectsTargetConfLoading
) {
  setprojectsTargetConfLoading(true);
  fetch(Config.projectTargetConf + "?id=" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setProjectsTargetConf(data);
      setprojectsTargetConfLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setprojectsTargetConfLoading(false);
    });
}

export async function downloadConfigXml(id) {
  const link = document.createElement("a");
  try {
    const response = await fetch(`/downloadConfig?id=${id}`, {
      method: "GET",
      responseType: "blob", // Specify blob type for download
    });

    if (!response.ok) {
      throw new Error(`Error downloading file: ${response.status}`);
    }

    const filename = response.headers
      .get("content-disposition")
      .split("filename=")[1];
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error downloading file:", error);
  } finally {
    if (link) {
      document.body.removeChild(link);
    }
  }
}

export function getComponentVersions(
  name,
  version,
  setVersions,
  setSelectedVersion,
  setVersionsLoading
) {
  setVersionsLoading(true);
  fetch(Config.getComponentVersion + "?name=" + name+"&versions="+version)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setVersions(data);
      if (data.length > 0) {
        setSelectedVersion(data[0]);
      }
      setVersionsLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setVersionsLoading(false);
    });
}

export function generateConfig (compID ,openSnackbar){
  fetch(Config.generateConf, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      componentID: compID,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status=="success"){
      openSnackbar("Patched Successfully", "success");
    }
    else {
      openSnackbar("Something wrong happend from the backend"+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    console.error('Error:', error);
  });
}
export function recreateAndDownload(compID,openSnackbar){
  fetch(Config.recreateAndDownloadConf, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      componentID: compID,
      force:"1",
      username:sessionModel.username
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status=="success"){
      downloadComp(compID,openSnackbar)
    }
    else {
      openSnackbar("Something wrong happend from the backend "+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    console.error('Error:', error);
  });
}
export function downloadComp(compID,openSnackbar){
  fetch(Config.downloadComp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      componentID: compID,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status=="success"){
      openSnackbar("Patched Successfully", "success");
    }
    else {
      openSnackbar("Something wrong happend from the backend "+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    console.error('Error:', error);
  });
}
export function removeDependentComp(compID,setOpen,setLoading,openSnackbar,setReload){
  setLoading(true)
  fetch(Config.RemoveDepComp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      compID: compID,
    })})
   .then(response => response.json())
  .then(data => {
    setLoading(false)
    if (data.status=="success"){
      setOpen(false)
      setReload(true)
      openSnackbar("Patched Successfully", "success");
    }
    else {
      openSnackbar("Something wrong happend from the backend "+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    setLoading(false)
    console.error('Error:', error);
  })
  
}
export function editDependentComp(compID,dependentComps,setOpen,setLoading,openSnackbar,setReload){
  setLoading(true)
  fetch(Config.updateDependentComp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      componentID: compID,
      compList:dependentComps
    })})
   .then(response => response.json())
  .then(data => {
    setLoading(false)
    if (data.status=="success"){
      setOpen(false)
      openSnackbar("Added Successfully", "success");
      setReload(true)
    }
    else {
      openSnackbar("Something wrong happend from the backend "+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    setLoading(false)
    console.error('Error:', error);
  })
  
}

export function changeActiveVersion(component,activeVersios,isActiveChecked,setLoading,openSnackbar){
  setLoading(true)
  fetch(Config.SetCompVersionActive, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      compID: component.id,
      oldActiveCompId:activeVersios.id,
      CompVersion:component.version,
      isActiveComp:isActiveChecked
    })})
   .then(response => response.json())
  .then(data => {
    setLoading(false)
    if (data.status=="success"){
      openSnackbar("Activated Successfully", "success");
    }
    else {
      openSnackbar("Something wrong happend from the backend "+data.message, "error");
    }
  })
  .catch((error) => {
    openSnackbar("Something wrong happend : "+error, "error");
    setLoading(false)
    console.error('Error:', error);
  })
}