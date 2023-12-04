import React, { useState ,useEffect} from 'react';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Config } from '../constants';


function CustomAppHeader(props) { 
  const [name,setName]=useState("") 
  const [isAdmin,setIsAdmin]=useState(false) 
  useEffect(() => {
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
       console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setName("unknown");
      });
  }, []);
  return (
    <header style={{textAlign:"center",margin:'10px'}}> 
        <FontAwesomeIcon icon={faUser}/>
        <em>Welcome <b>{name}</b> <em style={{color:"green"}}>{isAdmin?"Admin":""}</em></em>
    </header> 
    )
}
export default CustomAppHeader;
