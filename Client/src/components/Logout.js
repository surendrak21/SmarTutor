import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Logout =() =>{
  const navigate = useNavigate();
  const {dispatch} = useContext(UserContext);

  useEffect(()=> {
    fetch('/logout',{
      method:"POST",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      credentials:"include"
    })
    .then((res) =>{
      dispatch({type:"USER",payload:false});
      navigate('/login',{replace:true});
      if(res.status!==200){
        throw new Error('Logout failed');
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  },[dispatch,navigate]);

  return null;
}
export default Logout;
