import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';
import { login } from '../Sourcing/SourcingAPI';
import { Oval } from 'react-loader-spinner';

function Login() {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const [errorField, setErrorField] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  const handleLogin = async (event) => {
    event.preventDefault();
    // Add your login logic here
    console.log('Username:', userName);
    console.log('Password:', passWord);
    try {
      let result = await login(userName.trim(), passWord.trim());

      console.log('user===============', result.message);
      if (result && result.message === "Logged In") {
        // alert("Logged in successfully");
        setErrorField(false)
        setIsLoading(true)
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (error) {
      setErrorField(true)
      console.log("Error during login:", error);
      // alert("Login failed. Please check your credentials.");
    }

  };

  return (
    <div className="login-container">
      {isLoading ? (

        <Oval
          height={80}
          width={80}
          color="#00BFFF"
          ariaLabel='loading'
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-logo">
            <img src="https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg" alt="Logo" />
          </div>
          {errorField &&
            <div>
              <h3 style={{ color: 'red' }}>Login failed. Please check your credentials.</h3>
            </div>
          }

          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={{ background: errorField ? 'red' : '' }}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
              required
              style={{ background: errorField ? 'red' : '' }}
            />
          </div>
          <button type="submit" className="login-button">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Login;
