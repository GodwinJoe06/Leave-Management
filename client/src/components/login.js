import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, password };

    try {
      const response = await axios.post('http://localhost:5001/login', user);
      setSuccess(response.data.message);
      setError("");
      navigate('/employee'); // Navigate to the Employee component on success
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Error logging in. Please try again.');
      }
      setSuccess("");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default Login;
