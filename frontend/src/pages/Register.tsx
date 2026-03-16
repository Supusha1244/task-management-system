import React, { useState } from "react";
import API from "../services/api";

const Login: React.FC = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const login = async () => {
try {
const res = await API.post("/auth/login", { email, password });

  localStorage.setItem("token", res.data.token);
  window.location.href = "/dashboard";
} catch {
  alert("Login failed");
}

};

return ( <div className="container d-flex justify-content-center align-items-center vh-100">

  <div className="card shadow-lg p-4" style={{ width: "400px", background:"#f8f9fa" }}>

    <h3 className="text-center mb-4 text-primary">Login</h3>

    <input
      className="form-control mb-3"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      className="form-control mb-3"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      className="btn btn-primary w-100"
      onClick={login}
    >
      Login
    </button>

    <p className="text-center mt-3">
      Don't have an account?
      <a href="/register" className="ms-2">Register</a>
    </p>

  </div>

</div>

);
};

export default Login;
