import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

 const Login = () => {
  const {state,dispatch} = useContext(UserContext);
  const [email,setEmail] =useState('');
  const [password,setPassword] =useState('');

  const navigate = useNavigate();

  const loginUser = async (e)=>{
    e.preventDefault();
    const res = await fetch('/login',{
       method:"POST",
       headers:{
           "Content-Type":"application/json"
       },
       body: JSON.stringify({
         email,password
       })
    });
    const data = await res.json()
     if(data.status===400 || !data){
       window.alert("Invalid Registration");
       console.log("invalid Registration");
     }else {
       dispatch({type:"USER",payload:true});
       window.alert("Login Successful");
       console.log("Login Successful");
       navigate('/');
     }
 }

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Login form</h1>
                <br />
                <form >
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit " onClick={loginUser}>
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
export default Login;