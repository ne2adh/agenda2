import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography } from "@mui/material";
import axios from "axios";

import * as routes from "../constants/routes";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) navigate(routes.DASHBOARD);
  }, [navigate]);

  const handleLogin = async () => {
    if (!username.trim()) return;
    try {
      await axios.post(`${API_URL}/login`, { username });
      localStorage.setItem("username", username);
      console.log("🚀 ~ handleLogin ~ username:", username)
      navigate(routes.DASHBOARD);
    } catch (error) {
      console.error("Error en login", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
      <TextField
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>Ingresar</Button>
    </Box>
  );
};

export default Login;
