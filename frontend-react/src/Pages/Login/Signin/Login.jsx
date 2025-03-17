import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from '../../../redux/action';
import api from './../../../api';
import './Login.css';
function Login(props) {
  const { title, content } = props;
  const [action, setAction] = useState('');
  const open = useSelector(state => state.backdropAction);
  const navigate = useNavigate();
  const [username,setUsername]= useState("");
  const [password, setPassword]= useState("");
  const dispatch= useDispatch();
  // const { showSnackbar } = useSnackbar();
  const [rememberMe, setRememberMe] = useState(false);
  const LoginApi = (username,password) => {
    return api.post("api/authenticate", {username,password});
  }
const handleLoginSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  if (!username || !password) {
    toast.error("Username and password are required");
    return;
  }
  try {
    const res = await LoginApi(username, password);
    console.log(res);
    if (res && res.data.status=="OK") {
      dispatch(login(res.data));
      
      const jwt = res.data.data;
      const decodedToken = jwtDecode(jwt);
      const username = decodedToken.sub;
      const role = decodedToken.role;
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      {role === "USER"? navigate('/control-device') : navigate('/dash-board')}
    } else {
      console.log(res);
      console.log(res.data.message);
      toast.error("Login failed: Invalid credentials");
    }
  } catch (error) {
    const res = await LoginApi(username, password);
    toast.error("Login failed: " + (error.res?.data?.message || error.message));
  }
};
const loginLink =() => {
    setAction('')
};
return (
  <div className="login-container">
    {/* <div className="background-overlay"></div> */}
    <div className="login-box">
      <h1>Log In to Smart Garden</h1>
      <form onSubmit={handleLoginSubmit}>
        <div className="input-box">
          <input
            type="username"
            placeholder='Username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <FaUser className='icon' />
        </div>
        <div className="input-box">
          <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>
        <div className="remember-forgot">
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
          <span className="forgotpassword" onClick={() => navigate('/forget-password')} >
                Forgot Password?
          </span>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    <div className="bottom-clip"></div>
  </div>
);
}
export default Login;
