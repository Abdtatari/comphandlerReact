import { Config } from "../constants";

export function getDepComponent(id,setDependentComponent,setDepCompIsLoading){
    setDepCompIsLoading(true)
    fetch(Config.getDepComponent +"?id="+id+"&takeLatestVersion="+false ) //+ component.componentID
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
     setDependentComponent(data)
     setDepCompIsLoading(false); // Loading is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setDepCompIsLoading(false); // Loading is complete, even in case of an error
    });
}

export function getProjectTagretComponent(name,version,setProjectTargetedComponent,setProjectTargetIsLoading){
  setProjectTargetIsLoading(true)
  fetch(Config.getProjectTagretComponent +"?srcName="+name+"&version="+version ) 
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
      
}
export function getcomponentActiveVersion(name,componentActiveVersion,componentActiveVersionLoading){
  componentActiveVersionLoading(true)
  fetch(Config.myComponentActiveVersions +"?name="+name ) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        componentActiveVersion(data)
       componentActiveVersionLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        componentActiveVersionLoading(false); // Loading is complete, even in case of an error
      });
      
}

export function getLastCompRevisionAndIfActive(path,setIsGitActive,setLastCompRevision,setLoading){
  setLoading(true)
  setLastCompRevision("...")
  fetch(Config.getLastCompRevision +"?path="+path ) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsGitActive(data["isGITActive"])
        setLastCompRevision(data["lastCompRevision"])
       setLoading(false)
      })
      .catch((error) => {
      console.log(error)
      setLoading(false)
      });
      

}