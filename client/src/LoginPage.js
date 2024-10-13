import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState(""); // For sign-up name
  const [role, setRole] = useState("user"); // Default role for sign-up
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Clear previous error messages

    try {
      if (isLogin) {
        // Handle login
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });

        console.log(res.data.role); // Debugging line

        localStorage.setItem("token", res.data.token);

        // Navigate based on user role
        if (res.data.role === 'admin') {
          navigate("/admindashboard"); // Admins go to admin dashboard
        } else {
          navigate("/userdashboard"); // Users go to user dashboard
        }
      } else {
        // Handle sign-up
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name,
            username,
            password,
            role, // Include the selected role in the sign-up request
          }
        );

        navigate("/userdashboard"); // Assuming new users go to user dashboard
      }
    } catch (err) {
      // Display error message if login or signup fails
      if (err.response && err.response.data && err.response.data.msg) {
        setErrorMessage(err.response.data.msg);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🍃</span>
          <h1 style={styles.title}>SustainSmart</h1>
        </div>
        <p style={styles.subtitle}>
          Smart Food Management for a Greener Future
        </p>
        <div style={styles.tabs}>
          <button
            onClick={() => setIsLogin(true)}
            style={{ ...styles.tab, ...(isLogin ? styles.activeTab : {}) }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{ ...styles.tab, ...(isLogin ? {} : styles.activeTab) }}
          >
            Sign up
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                style={styles.input}
              />
            </div>
            <button style={styles.button} type="submit">
              {isLoading ? "Logging in..." : "Login"}
            </button>
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            {/* <div style={styles.inputGroup}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={styles.input}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div> */}
            <div style={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                style={styles.input}
              />
            </div>
            <button style={styles.button} type="submit">
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          </form>
        )}
        <div style={styles.footer}>
          <p>
            By using SustainSmart, you're contributing to a more sustainable
            world.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom right, #d1fae5, #bbf7d0)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  icon: {
    fontSize: "24px",
    marginRight: "8px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4ade80", // Green-800
  },
  subtitle: {
    color: "#4b5563", // Gray-600
    marginBottom: "1.5rem",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  tab: {
    flex: 1,
    padding: "0.5rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#4ade80", // Green-800
  },
  activeTab: {
    borderBottom: "2px solid #4ade80", // Green-600
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #d1d5db", // Gray-300
    borderRadius: "4px",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#4ade80", // Green-600
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  footer: {
    paddingTop: "1rem",
    fontSize: "14px",
    color: "#4b5563", // Gray-600
  },
  errorMessage: {
    color: "red",
    marginTop: "0.5rem",
  },
};
