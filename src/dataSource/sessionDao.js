import { Config } from "../constants";
import { sessionModel } from "../model/sessionModel";

export function getSession (setName,setIsAdmin){
    fetch(Config.sessionUser)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setName(data.username)
      setIsAdmin(data.isAdmin)
      sessionModel=data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setName("unknown");
    });
}
      