import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", userData);
      alert(res.data.message); // Show success message
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="text-3xl">
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={userData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={userData.password}
        onChange={handleChange}
      />
      <button onClick={registerUser}>Register</button>
    </div>
  );
}

export default App;
