import React, { useState ,useEffect} from 'react';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Config } from '../constants';
import { getSession } from '../dataSource/sessionDao';


function CustomAppHeader(props) { 
  const [name,setName]=useState("") 
  const [isAdmin,setIsAdmin]=useState(false) 
  useEffect(() => {
  getSession(setName,setIsAdmin)
  }, []);
  return (
    <header style={{textAlign:"center",margin:'10px'}}> 
        <FontAwesomeIcon icon={faUser}/>
        <em>Welcome <b>{name}</b> <em style={{color:"green"}}>{isAdmin?"Admin":""}</em></em>
    </header> 
    )
}
export default CustomAppHeader;
