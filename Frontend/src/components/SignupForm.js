// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SignupForm.css";
// import axios from "axios";

// const SignupForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/signup", {
//         email: email,
//         name: name,
//         password: password,
//         username: username,
//       });
//       if (response.data.error === null) {
//         navigate("/login");
//       }
//     } catch (error) {
//       window.alert("Some Error Occured");
//       window.location.reload();
//     }
//     // Perform signup logic, e.g., API call
//     // After successful signup, redirect to login page
//   };

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <button type="submit">Signup</button>
//       </form>
//       <button onClick={handleLoginClick}>Already a User? Click Here</button>
//     </div>
//   );
// };

// export default SignupForm;

// //------------------------------------------------------------------
// //code with css applied
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupForm.css"; // Import the CSS file

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email: email,
        name: name,
        password: password,
        username: username,
      });
      if (response.data.error === null) {
        navigate("/login");
      }
    } catch (error) {
      window.alert("Some Error Occured");
      window.location.reload();
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      {" "}
      {/* Apply class to main container */}
      <h1 className="signup-header">Signup</h1> {/* Apply class to header */}
      <form onSubmit={handleSubmit} className="signup-form">
        {" "}
        {/* Apply class to form */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="signup-button">
          Signup
        </button>{" "}
        {/* Apply class to button */}
      </form>
      <button onClick={handleLoginClick} className="login-button">
        Already a User? Click Here
      </button>{" "}
      {/* Apply class to button */}
    </div>
  );
};

export default SignupForm;
