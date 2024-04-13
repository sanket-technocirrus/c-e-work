// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token)
//     return res.status(401).json({ error: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token." });
//     req.user = decoded;
//     next();
//   });
// }

// // Signup endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("Signup request received:", req.body); //for logging purpose
//     const { email, name, password, username } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuid.v4();
//     const newUser = {
//       user_id: userId,
//       email,
//       name,
//       password: hashedPassword,
//       username,
//       role: false,
//     };
//     console.log("New user data:", newUser); //log data to be inserted into db
//     db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//       if (err) throw err;
//       res
//         .status(200)
//         .json({ message: "User registered successfully", error: null });
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;
//         if (results.length === 0) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           role: user.role,
//           error: null,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Protected Admin Dashboard Endpoint
// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   if (!req.user || !req.user.role) {
//     return res.status(403).json({
//       error: "Access denied. You are not authorized to access this resource.",
//     });
//   }
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });

// // Landing Page Endpoint
// app.get("/landing", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Landing Page!" });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// //--------------------------------------------------
// //version 3 request flow changed code

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Import axios for making HTTP requests
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Define the Judge0 API endpoints
// const compileEndpoint = "http://localhost:2358/submissions";
// const resultsEndpoint = "http://localhost:2358/submissions";

// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token)
//     return res.status(401).json({ error: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token." });
//     req.user = decoded;
//     next();
//   });
// }

// // Signup endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("Signup request received:", req.body); //for logging purpose
//     const { email, name, password, username } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuid.v4();
//     const newUser = {
//       user_id: userId,
//       email,
//       name,
//       password: hashedPassword,
//       username,
//       role: false,
//     };
//     console.log("New user data:", newUser); //log data to be inserted into db
//     db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//       if (err) throw err;
//       res
//         .status(200)
//         .json({ message: "User registered successfully", error: null });
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;
//         if (results.length === 0) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           role: user.role,
//           error: null,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Protected Admin Dashboard Endpoint
// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   if (!req.user || !req.user.role) {
//     return res.status(403).json({
//       error: "Access denied. You are not authorized to access this resource.",
//     });
//   }
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });

// // Landing Page Endpoint
// app.get("/landing", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Landing Page!" });
// });

// // Compilation endpoint
// app.post("/compile", (req, res) => {
//   // Extract code and input from request body
//   const { code, customInput } = req.body;

//   // Prepare data for compilation request
//   const requestData = {
//     source_code: code,
//     language_id: 71, // python 3.8.1 language ID
//     stdin: customInput,
//   };

//   // Make a POST request to the Judge0 API compilation endpoint
//   axios
//     .post(compileEndpoint, requestData)
//     .then((response) => {
//       console.log("Compilation request sent to Judge0:", response.data);
//       // Extract jobId from response and send it back to the client
//       const jobId = response.data.token;
//       res.json({ jobId });
//     })
//     .catch((error) => {
//       console.error("Error compiling code:", error);
//       res.status(500).json({ error: "Error compiling code" });
//     });
// });

// // Result retrieval endpoint
// app.get("/results/:jobId", (req, res) => {
//   // Extract jobId from request params
//   const { jobId } = req.params;

//   // Make a GET request to the Judge0 API results endpoint
//   axios
//     .get(`${resultsEndpoint}/${jobId}`)
//     .then((response) => {
//       console.log("Result retrieved from Judge0:", response.data);
//       // Send the result back to the client
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.error("Error retrieving result:", error);
//       res.status(500).json({ error: "Error retrieving result" });
//     });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// //----------------------------------------------------------------------
// // version 4 changing ui like hackerrank

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Import axios for making HTTP requests
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Define the Judge0 API endpoints
// const compileEndpoint = "http://localhost:2358/submissions";
// const resultsEndpoint = "http://localhost:2358/submissions";

// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token)
//     return res.status(401).json({ error: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token." });
//     req.user = decoded;
//     next();
//   });
// }

// // Signup endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("Signup request received:", req.body); //for logging purpose
//     const { email, name, password, username } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuid.v4();
//     const newUser = {
//       user_id: userId,
//       email,
//       name,
//       password: hashedPassword,
//       username,
//       role: false,
//     };
//     console.log("New user data:", newUser); //log data to be inserted into db
//     db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//       if (err) throw err;
//       res
//         .status(200)
//         .json({ message: "User registered successfully", error: null });
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;
//         if (results.length === 0) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           role: user.role,
//           error: null,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Protected Admin Dashboard Endpoint
// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   if (!req.user || !req.user.role) {
//     return res.status(403).json({
//       error: "Access denied. You are not authorized to access this resource.",
//     });
//   }
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });

// // Landing Page Endpoint
// app.get("/landing", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Landing Page!" });
// });

// // Compilation endpoint
// app.post("/compile", (req, res) => {
//   // Extract code and input from request body
//   const { code, customInput } = req.body;

//   // Prepare data for compilation request
//   const requestData = {
//     source_code: code,
//     language_id: 71, // python 3.8.1 language ID
//     stdin: customInput,
//   };

//   // Make a POST request to the Judge0 API compilation endpoint
//   axios
//     .post(compileEndpoint, requestData)
//     .then((response) => {
//       console.log("Compilation request sent to Judge0:", response.data);
//       // Extract jobId from response and send it back to the client
//       const jobId = response.data.token;
//       res.json({ jobId });
//     })
//     .catch((error) => {
//       console.error("Error compiling code:", error);
//       res.status(500).json({ error: "Error compiling code" });
//     });
// });

// // Result retrieval endpoint
// app.get("/results/:jobId", (req, res) => {
//   // Extract jobId from request params
//   const { jobId } = req.params;

//   // Make a GET request to the Judge0 API results endpoint
//   axios
//     .get(`${resultsEndpoint}/${jobId}`)
//     .then((response) => {
//       console.log("Result retrieved from Judge0:", response.data);
//       // Send the result back to the client
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.error("Error retrieving result:", error);
//       res.status(500).json({ error: "Error retrieving result" });
//     });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// //----------------------------------------------------------------------
// // version 5 creating parent ui which shows questions, after clicking question it will open landing page, after compile and execute check if the result is matching to the expected output

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Import axios for making HTTP requests
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Define the Judge0 API endpoints
// const compileEndpoint = "http://localhost:2358/submissions";
// const resultsEndpoint = "http://localhost:2358/submissions";

// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token)
//     return res.status(401).json({ error: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token." });
//     req.user = decoded;
//     next();
//   });
// }

// // Signup endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("Signup request received:", req.body); //for logging purpose
//     const { email, name, password, username } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuid.v4();
//     const newUser = {
//       user_id: userId,
//       email,
//       name,
//       password: hashedPassword,
//       username,
//       role: false,
//     };
//     console.log("New user data:", newUser); //log data to be inserted into db
//     db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//       if (err) throw err;
//       res
//         .status(200)
//         .json({ message: "User registered successfully", error: null });
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;
//         if (results.length === 0) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           role: user.role,
//           error: null,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Protected Admin Dashboard Endpoint
// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   if (!req.user || !req.user.role) {
//     return res.status(403).json({
//       error: "Access denied. You are not authorized to access this resource.",
//     });
//   }
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });

// // Landing Page Endpoint
// app.get("/questions", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Question Page!" });
// });

// // Compilation endpoint
// app.post("/compile", (req, res) => {
//   // Extract code and input from request body
//   const { code, customInput } = req.body;

//   // Prepare data for compilation request
//   const requestData = {
//     source_code: code,
//     language_id: 71, // python 3.8.1 language ID
//     stdin: customInput,
//   };

//   // Make a POST request to the Judge0 API compilation endpoint
//   axios
//     .post(compileEndpoint, requestData)
//     .then((response) => {
//       console.log("Compilation request sent to Judge0:", response.data);
//       // Extract jobId from response and send it back to the client
//       const jobId = response.data.token;
//       res.json({ jobId });
//     })
//     .catch((error) => {
//       console.error("Error compiling code:", error);
//       res.status(500).json({ error: "Error compiling code" });
//     });
// });

// // Result retrieval endpoint
// app.get("/results/:jobId", (req, res) => {
//   // Extract jobId from request params
//   const { jobId } = req.params;

//   // Make a GET request to the Judge0 API results endpoint
//   axios
//     .get(`${resultsEndpoint}/${jobId}`)
//     .then((response) => {
//       console.log("Result retrieved from Judge0:", response.data);
//       // Send the result back to the client
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.error("Error retrieving result:", error);
//       res.status(500).json({ error: "Error retrieving result" });
//     });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// //v5 p2 -----------------------for language_id hardcoded to dynamic

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Import axios for making HTTP requests
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Define the Judge0 API endpoints
// const compileEndpoint = "http://localhost:2358/submissions";
// const resultsEndpoint = "http://localhost:2358/submissions";

// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token)
//     return res.status(401).json({ error: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token." });
//     req.user = decoded;
//     next();
//   });
// }

// // Signup endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("Signup request received:", req.body); //for logging purpose
//     const { email, name, password, username } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuid.v4();
//     const newUser = {
//       user_id: userId,
//       email,
//       name,
//       password: hashedPassword,
//       username,
//       role: false,
//     };
//     console.log("New user data:", newUser); //log data to be inserted into db
//     db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//       if (err) throw err;
//       res
//         .status(200)
//         .json({ message: "User registered successfully", error: null });
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;
//         if (results.length === 0) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//           return res.status(401).json({ error: "Invalid email or password" });
//         }
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           role: user.role,
//           error: null,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Protected Admin Dashboard Endpoint
// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   if (!req.user || !req.user.role) {
//     return res.status(403).json({
//       error: "Access denied. You are not authorized to access this resource.",
//     });
//   }
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });

// // Landing Page Endpoint
// app.get("/questions", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Question Page!" });
// });

// // Compilation endpoint
// app.post("/compile", (req, res) => {
//   // Extract code and input from request body
//   const { code, customInput, languageId } = req.body;

//   console.log("received language id", languageId);
//   // Prepare data for compilation request
//   const requestData = {
//     source_code: code,
//     language_id: languageId, // python 3.8.1 language ID
//     stdin: customInput,
//   };

//   // Make a POST request to the Judge0 API compilation endpoint
//   axios
//     .post(compileEndpoint, requestData)
//     .then((response) => {
//       console.log("Compilation request sent to Judge0:", response.data);
//       // Extract jobId from response and send it back to the client
//       const jobId = response.data.token;
//       res.json({ jobId });
//     })
//     .catch((error) => {
//       console.error("Error compiling code:", error);
//       res.status(500).json({ error: "Error compiling code" });
//     });
// });

// // Result retrieval endpoint
// app.get("/results/:jobId", (req, res) => {
//   // Extract jobId from request params
//   const { jobId } = req.params;

//   // Make a GET request to the Judge0 API results endpoint
//   axios
//     .get(`${resultsEndpoint}/${jobId}`)
//     .then((response) => {
//       console.log("Result retrieved from Judge0:", response.data);
//       // Send the result back to the client
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.error("Error retrieving result:", error);
//       res.status(500).json({ error: "Error retrieving result" });
//     });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// //-----------------------------------------------------------------------------------
// // version 6 admin api's admin can see which organizations has signed up, can delete organizations

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios for making HTTP requests
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("./DBconfig");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define the Judge0 API endpoints
const compileEndpoint = "http://localhost:2358/submissions";
const resultsEndpoint = "http://localhost:2358/submissions";

// Function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token." });
    req.user = decoded;
    next();
  });
}

// Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body); //for logging purpose
    const { email, name, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuid.v4();
    const newUser = {
      user_id: userId,
      email,
      name,
      password: hashedPassword,
      username,
      role: false,
    };
    console.log("New user data:", newUser); //log data to be inserted into db
    db.query("INSERT INTO users SET ?", newUser, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json({ message: "User registered successfully", error: null });
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({
          message: "Login successful",
          token,
          role: user.role,
          error: null,
        });
      }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Protected Admin Dashboard Endpoint
app.get("/admin/dashboard", verifyToken, (req, res) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      error: "Access denied. You are not authorized to access this resource.",
    });
  }
  res.json({ message: "Welcome to Admin Dashboard!" });
});

// Landing Page Endpoint
app.get("/questions", verifyToken, (req, res) => {
  res.json({ message: "Welcome to Question Page!" });
});

// Compilation endpoint
app.post("/compile", (req, res) => {
  // Extract code and input from request body
  const { code, customInput, languageId } = req.body;

  console.log("received language id", languageId);
  // Prepare data for compilation request
  const requestData = {
    source_code: code,
    language_id: languageId, // python 3.8.1 language ID
    stdin: customInput,
  };

  // Make a POST request to the Judge0 API compilation endpoint
  axios
    .post(compileEndpoint, requestData)
    .then((response) => {
      console.log("Compilation request sent to Judge0:", response.data);
      // Extract jobId from response and send it back to the client
      const jobId = response.data.token;
      res.json({ jobId });
    })
    .catch((error) => {
      console.error("Error compiling code:", error);
      res.status(500).json({ error: "Error compiling code" });
    });
});

// Result retrieval endpoint
app.get("/results/:jobId", (req, res) => {
  // Extract jobId from request params
  const { jobId } = req.params;

  // Make a GET request to the Judge0 API results endpoint
  axios
    .get(`${resultsEndpoint}/${jobId}`)
    .then((response) => {
      console.log("Result retrieved from Judge0:", response.data);
      // Send the result back to the client
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error retrieving result:", error);
      res.status(500).json({ error: "Error retrieving result" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
