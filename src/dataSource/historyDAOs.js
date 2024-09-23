import { Config } from "../constants";

export function getHistory (componentID,setHistory,setHistoryLoading){
    fetch(Config.getHistory + " ?id=" + componentID)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setHistory(data.map((dbFolderModel) => ({ ...dbFolderModel }))); // Set the data in state
        setHistoryLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setHistoryLoading(false); // Loading is complete, even in case of an error
      });
      
}