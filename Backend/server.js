// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Import axios for making HTTP requests
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const db = require("./DBconfig");
// const { v4: uuidv4 } = require("uuid");

// require("dotenv").config();
// const port = process.env.PORT || 3000;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Define the Judge0 API endpoints
// const compileEndpoint = "http://localhost:2358/submissions";
// const resultsEndpoint = "http://localhost:2358/submissions";

// //further enhanced verifyToken middleware
// // Function to verify JWT token
// function verifyToken(req, res, next) {
//   // Check if Authorization header is present
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   // Extract token from Authorization header
//   const token = authHeader.split(" ")[1];

//   // Verify token
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         return res
//           .status(401)
//           .json({ error: "Token expired. Please login again." });
//       }
//       return res.status(401).json({ error: "Invalid token." });
//     }
//     // Token is valid, attach decoded user information to req.user
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
//           { expiresIn: "12h" }
//         );
//         res.json({
//           message: "Login successful",
//           token,
//           user_id: user.user_id,
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

// app.get("/questions", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Question Page!" });
// });

// // // Landing Page Endpoint -----------------------------------------------------------------
// // previous code
// // // Compilation endpoint
// // app.post("/compile", (req, res) => {
// //   // Extract code and input from request body
// //   const { code, customInput, languageId } = req.body;

// //   console.log("received language id", languageId);
// //   // Prepare data for compilation request
// //   const requestData = {
// //     source_code: code,
// //     language_id: languageId,
// //     stdin: customInput,
// //   };

// //   // Make a POST request to the Judge0 API compilation endpoint
// //   axios
// //     .post(compileEndpoint, requestData)
// //     .then((response) => {
// //       console.log("Compilation request sent to Judge0:", response.data);
// //       // Extract jobId from response and send it back to the client
// //       const jobId = response.data.token;
// //       res.json({ jobId });
// //     })
// //     .catch((error) => {
// //       console.error("Error compiling code:", error);
// //       res.status(500).json({ error: "Error compiling code" });
// //     });
// // });

// // //for test case functionality
// //working for 1 test case------------------
// // Route to fetch input from test_cases table based on questionId
// app.get("/test_cases/:questionId", (req, res) => {
//   const { questionId } = req.params;
//   const sql = "SELECT input FROM test_cases WHERE question_id = ?";
//   db.query(sql, [questionId], (err, result) => {
//     if (err) {
//       console.error("Error fetching input:", err);
//       return res.status(500).json({ error: "Error fetching input" });
//     }
//     if (result.length === 0) {
//       return res.status(404).json({ error: "No input found for the question" });
//     }
//     const input = result[0].input;
//     res.json({ input });
//   });
// });

// // // Route for fetching test cases
// // app.get("/test_cases/:questionId", (req, res) => {
// //   const { questionId } = req.params;
// //   const sql =
// //     "SELECT input, expected_output FROM test_cases WHERE question_id = ?";
// //   db.query(sql, [questionId], (err, result) => {
// //     if (err) {
// //       console.error("Error fetching test cases:", err);
// //       return res.status(500).json({ error: "Error fetching test cases" });
// //     }
// //     if (result.length === 0) {
// //       return res
// //         .status(404)
// //         .json({ error: "No test cases found for the question" });
// //     }
// //     const testCases = result.map((testCase) => ({
// //       input: testCase.input,
// //       expected_output: testCase.expected_output,
// //     }));
// //     res.json({ testCases });
// //   });
// // });

// // Route to handle compilation and execution
// app.post("/compile", (req, res) => {
//   // Extract code, customInput, languageId, and questionId from request body
//   const { code, customInput, languageId, questionId } = req.body;

//   // Fetch input from test_cases table based on questionId
//   // (This part is handled in the frontend)

//   // Prepare data for compilation request
//   const requestData = {
//     source_code: code,
//     language_id: languageId,
//     stdin: customInput,
//   };

//   // Make a POST request to the Judge0 API compilation endpoint
//   // (Assuming you're using Judge0 API for compilation)
//   // Replace compileEndpoint with your actual Judge0 API endpoint
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

// // //for comparing output------------
// // // Route to handle compilation and execution
// // app.post("/compile", (req, res) => {
// //   // Extract code, customInput, languageId, and questionId from request body
// //   const { code, customInput, languageId, questionId } = req.body;

// //   // Fetch input from test_cases table based on questionId
// //   // (This part is handled in the frontend)

// //   // Prepare data for compilation request
// //   const requestData = {
// //     source_code: code,
// //     language_id: languageId,
// //     stdin: customInput,
// //   };

// //   // Make a POST request to the Judge0 API compilation endpoint
// //   // (Assuming you're using Judge0 API for compilation)
// //   // Replace compileEndpoint with your actual Judge0 API endpoint
// //   axios
// //     .post(compileEndpoint, requestData)
// //     .then((response) => {
// //       console.log("Compilation request sent to Judge0:", response.data);
// //       // Extract jobId from response and send it back to the client
// //       const jobId = response.data.token;
// //       res.json({ jobId });
// //     })
// //     .catch((error) => {
// //       console.error("Error compiling code:", error);
// //       res.status(500).json({ error: "Error compiling code" });
// //     });
// // });

// // // Result retrieval endpoint
// // app.get("/results/:jobId", (req, res) => {
// //   // Extract jobId from request params
// //   const { jobId } = req.params;
// //   console.log(jobId);

// //   const questionId = req.query.questionId;
// //   console.log(questionId);
// //   // Make a GET request to the Judge0 API results endpoint
// //   axios
// //     .get(`${resultsEndpoint}/${jobId}`)
// //     .then((response) => {
// //       console.log("Result retrieved from Judge0:", response.data);
// //       // Send the result back to the client
// //       const output = response.data.stdout; // Assuming the output is received in stdout

// //       // Now fetch the expected output from the test cases table
// //       const sql =
// //         "SELECT expected_output FROM test_cases WHERE question_id = ?";
// //       db.query(sql, [questionId], (err, result) => {
// //         if (err) {
// //           console.error("Error fetching expected output:", err);
// //           res.status(500).json({ error: "Error fetching expected output" });
// //           return;
// //         }
// //         if (result.length === 0) {
// //           res
// //             .status(404)
// //             .json({ error: "No test cases found for the question" });
// //           return;
// //         }

// //         const expectedOutput = result[0].expected_output;

// //         // Compare output with expected output
// //         if (output.trim() === expectedOutput.trim()) {
// //           res.json({ status: "Test case passed" });
// //         } else {
// //           res.json({ status: "Test case failed" });
// //         }
// //       });
// //     })
// //     .catch((error) => {
// //       console.error("Error retrieving result:", error);
// //       res.status(500).json({ error: "Error retrieving result" });
// //     });
// // });

// // Fetch users with role false endpoint
// app.get("/users", verifyToken, (req, res) => {
//   db.query(
//     "SELECT user_id, email, name, username FROM users WHERE role = false",
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching users:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.json(results);
//     }
//   );
// });

// // Delete user endpoint
// app.delete("/users/:userId", verifyToken, (req, res) => {
//   const userId = req.params.userId;
//   db.query("DELETE FROM users WHERE user_id = ?", [userId], (err, result) => {
//     if (err) {
//       console.error("Error deleting user:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   });
// });

// // User Dashboard Endpoint
// app.get("/user/dashboard/:user_id", verifyToken, (req, res) => {
//   const { user_id } = req.params;
//   // Extract user_id from request parameters
//   console.log("USER Id: ", req.user.user_id);
//   // You can perform actions related to the user dashboard here
//   res.json({ message: `Welcome to User Dashboard, user ${user_id}!` });
// });

// // Assuming you have a route to fetch tests for a specific user in your backend
// // //user dashboard apis----------------------------------------------------------------------------------------------
// // Fetch tests for a specific user endpoint (shows test on userdashboard of that specific loggged in user)
// app.get("/tests/user/:user_id", verifyToken, (req, res) => {
//   const { user_id } = req.params;
//   db.query(
//     "SELECT test_id, test_title, test_description FROM tests WHERE created_by = ?",
//     [user_id],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching tests:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.json(results);
//     }
//   );
// });

// // //create test page------------------------------------------------------------------------
// // Backend API to fetch questions on create test page
// app.get("/api/questions", (req, res) => {
//   // Query the database to fetch all questions
//   db.query("SELECT * FROM questions", (err, results) => {
//     if (err) {
//       console.error("Error fetching questions:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//     res.json(results);
//   });
// });

// // Update the route to create a test with selected questions
// app.post("/tests/:test_id/create", async (req, res) => {
//   const { test_id } = req.params;
//   const { test_title, test_description, created_by, questions } = req.body;

//   try {
//     // Check if the test already exists
//     const testExists = await new Promise((resolve, reject) => {
//       db.query(
//         "SELECT * FROM tests WHERE test_id = ?",
//         [test_id],
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results.length > 0);
//           }
//         }
//       );
//     });

//     // If the test doesn't exist, create it
//     if (!testExists) {
//       await new Promise((resolve, reject) => {
//         db.query(
//           "INSERT INTO tests (test_id, test_title, test_description, created_by) VALUES (?, ?, ?, ?)",
//           [test_id, test_title, test_description, created_by],
//           (err, result) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve();
//             }
//           }
//         );
//       });
//     }

//     // Insert the test-question associations into the database
//     for (const question_id of questions) {
//       await new Promise((resolve, reject) => {
//         db.query(
//           "INSERT INTO test_questions (test_id, question_id) VALUES (?, ?)",
//           [test_id, question_id],
//           (err, result) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve();
//             }
//           }
//         );
//       });
//     }

//     console.log("Test created successfully");
//     res.status(201).json({ message: "Test created successfully" });
//   } catch (error) {
//     console.error("Error creating test:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // //--------------------------------------------------------------------------------------------
// // Update the route to generate a unique test ID
// app.post("/tests-user/generate-id", verifyToken, (req, res) => {
//   // Generate a unique test ID
//   let test_id;
//   const generateTestID = () => Math.floor(Math.random() * 1000000);

//   const checkTestID = () => {
//     // Generate a test ID
//     test_id = generateTestID();
//     // Check if the generated test ID already exists in the database
//     const sql = "SELECT * FROM tests WHERE test_id = ?";
//     db.query(sql, [test_id], (err, results) => {
//       if (err) {
//         console.error("Error checking test ID:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       // If the test ID doesn't exist in the database, return it
//       if (results.length === 0) {
//         return res.status(200).json({ test_id });
//       }
//       // If the test ID already exists, generate a new one
//       checkTestID();
//     });
//   };

//   // Call the function to start generating a test ID
//   checkTestID();
// });

// // Add a new DELETE endpoint to delete a test when clicked delete button on user dashboard page
// app.delete("/tests/:test_id", verifyToken, (req, res) => {
//   const testId = req.params.test_id;
//   // Delete associated records from the test_questions table first
//   db.query(
//     "DELETE FROM test_questions WHERE test_id = ?",
//     [testId],
//     (err, result) => {
//       if (err) {
//         console.error("Error deleting associated test questions:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       // Once associated records are deleted, delete the test from the tests table
//       db.query(
//         "DELETE FROM tests WHERE test_id = ?",
//         [testId],
//         (err, result) => {
//           if (err) {
//             console.error("Error deleting test:", err);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }
//           res.status(200).json({ message: "Test deleted successfully" });
//         }
//       );
//     }
//   );
// });

// // Backend API to fetch questions for a specific test (view test button click)
// app.get("/tests/:test_id/questions", verifyToken, (req, res) => {
//   const { test_id } = req.params;
//   // Fetch questions for the specified test_id from the database
//   db.query(
//     "SELECT question_id, question_text FROM questions WHERE question_id IN (SELECT question_id FROM test_questions WHERE test_id = ?)",
//     [test_id],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching questions for test:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.json(results);
//     }
//   );
// });

// // //apis for edit test component------------------------------------------------------------

// // Get test details by test ID
// app.get("/tests/:testId", (req, res) => {
//   const testId = req.params.testId;
//   const query = "SELECT * FROM tests WHERE test_id = ?";
//   db.query(query, [testId], (err, result) => {
//     if (err) {
//       console.error("Error fetching test details:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     if (result.length === 0) {
//       res.status(404).json({ error: "Test not found" });
//       return;
//     }
//     res.status(200).json(result[0]);
//   });
// });

// // Get questions by test ID
// app.get("/tests/:testId/questions", (req, res) => {
//   const testId = req.params.testId;
//   const query =
//     "SELECT questions.question_id, questions.question_text FROM questions INNER JOIN test_questions ON questions.question_id = test_questions.question_id WHERE test_questions.test_id = ?";
//   db.query(query, [testId], (err, result) => {
//     if (err) {
//       console.error("Error fetching test questions:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     res.status(200).json(result);
//   });
// });

// // Delete question from test by question ID
// app.delete("/tests/:testId/questions/:questionId", (req, res) => {
//   const testId = req.params.testId;
//   const questionId = req.params.questionId;
//   const query =
//     "DELETE FROM test_questions WHERE test_id = ? AND question_id = ?";
//   db.query(query, [testId, questionId], (err, result) => {
//     if (err) {
//       console.error("Error deleting question from test:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     if (result.affectedRows === 0) {
//       res.status(404).json({ error: "Question not found in the test" });
//       return;
//     }
//     res
//       .status(200)
//       .json({ message: "Question deleted from test successfully" });
//   });
// });

// // Update test details by test ID
// app.put("/tests/:testId", (req, res) => {
//   const testId = req.params.testId;
//   const { test_title, test_description } = req.body;
//   const query =
//     "UPDATE tests SET test_title = ?, test_description = ? WHERE test_id = ?";
//   db.query(query, [test_title, test_description, testId], (err, result) => {
//     if (err) {
//       console.error("Error updating test details:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     if (result.affectedRows === 0) {
//       res.status(404).json({ error: "Test not found" });
//       return;
//     }
//     res.status(200).json({ message: "Test details updated successfully" });
//   });
// });

// // Add question to test by question ID
// app.post("/tests/:testId/questions/:questionId", (req, res) => {
//   const testId = req.params.testId;
//   const questionId = req.params.questionId;
//   const query =
//     "INSERT INTO test_questions (test_id, question_id) VALUES (?, ?)";
//   db.query(query, [testId, questionId], (err, result) => {
//     if (err) {
//       console.error("Error adding question to test:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     res.status(200).json({ message: "Question added to test successfully" });
//   });
// });

// // Get all questions
// app.get("/api/all-questions", (req, res) => {
//   const query = "SELECT * FROM questions";
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error("Error fetching questions:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     res.status(200).json(result);
//   });
// });

// // //apis for manage participant page ---------------------------------------------------------------------

// const validateEmail = (email) => {
//   // Regular expression for email validation
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// // Add Participant route
// app.post("/add-participant", (req, res) => {
//   const { user_id, email, test_id } = req.body;

//   // Validate email format
//   if (!validateEmail(email)) {
//     return res
//       .status(400)
//       .json({ error: "Please enter a valid email address" });
//   }

//   // Check if the email is already associated with the testId
//   db.query(
//     "SELECT * FROM participants WHERE test_id = ? AND email = ?",
//     [test_id, email],
//     (error, results) => {
//       if (error) {
//         console.error("Error checking existing participant:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (results.length > 0) {
//         return res
//           .status(400)
//           .json({ error: "Email is already associated with this test" });
//       }

//       const participantId = uuidv4(); // Generate participant ID using uuid library

//       // Insert the participant into the database
//       db.query(
//         "INSERT INTO participants (participant_id, user_id, email, test_id) VALUES (?, ?, ?, ?)",
//         [participantId, user_id, email, test_id],
//         (insertError) => {
//           if (insertError) {
//             console.error("Error adding participant:", insertError);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           res.status(201).json({ message: "Participant added successfully" });
//         }
//       );
//     }
//   );
// });

// // Fetch participants of a specific test
// // app.get("/participants/:testId", (req, res) => {
// //   const { testId } = req.params;

// //   try {
// //     const participants = db.query(
// //       "SELECT * FROM participants WHERE test_id = ?",
// //       [testId]
// //     );

// //     res.status(200).json(participants);
// //   } catch (error) {
// //     console.error("Error fetching participants:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // // Delete a participant
// // app.delete("/participants/:participantId", (req, res) => {
// //   const { participantId } = req.params;

// //   try {
// //     db.query("DELETE FROM participants WHERE participant_id = ?", [
// //       participantId,
// //     ]);

// //     res.status(200).json({ message: "Participant deleted successfully" });
// //   } catch (error) {
// //     console.error("Error deleting participant:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// app.get("/participants/:testId", (req, res) => {
//   const { testId } = req.params;

//   // Fetch participants of a specific test
//   db.query(
//     "SELECT * FROM participants WHERE test_id = ?",
//     [testId],
//     (error, participants) => {
//       if (error) {
//         console.error("Error fetching participants:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       res.status(200).json(participants);
//     }
//   );
// });

// // Delete a participant
// app.delete("/participants/:participantId", (req, res) => {
//   const { participantId } = req.params;

//   // Delete participant from the database
//   db.query(
//     "DELETE FROM participants WHERE participant_id = ?",
//     [participantId],
//     (error) => {
//       if (error) {
//         console.error("Error deleting participant:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       res.status(200).json({ message: "Participant deleted successfully" });
//     }
//   );
// });

// // //attempt test apis---------------------------------------------------------

// app.post("/attempt-test", (req, res) => {
//   const { email, testId } = req.body;

//   // Check if the email exists for the given test ID
//   db.query(
//     "SELECT * FROM participants WHERE email = ? AND test_id = ?",
//     [email, testId],
//     (err, results) => {
//       if (err) {
//         console.error("Error checking participant:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       const isValid = results.length > 0;
//       res.json({ isValid: isValid });
//     }
//   );
// });

// // //question ui api-----------------------------------------------------------------------
// // Endpoint to fetch questions by test ID

// app.get("/questions/:testId", (req, res) => {
//   const { testId } = req.params;

//   try {
//     db.query(
//       "SELECT questions.question_id, questions.question_text FROM questions INNER JOIN test_questions ON questions.question_id = test_questions.question_id WHERE test_questions.test_id = ?",
//       [testId],
//       (err, results) => {
//         if (err) {
//           console.error("Error fetching questions:", err);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }
//         res.status(200).json(results);
//       }
//     );
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // //api for test cases----------------------------------------------------------------------
// // Endpoint to compile and run code and execute test cases

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// // above code working for 1 test case
// //-----------------------------------------------------------------------------------------------------
// //below code for comparing output
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios for making HTTP requests
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("./DBconfig");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define the Judge0 API endpoints
const compileEndpoint = "http://localhost:2358/submissions";
const resultsEndpoint = "http://localhost:2358/submissions";

//further enhanced verifyToken middleware
// Function to verify JWT token
function verifyToken(req, res, next) {
  // Check if Authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Extract token from Authorization header
  const token = authHeader.split(" ")[1];

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Token expired. Please login again." });
      }
      return res.status(401).json({ error: "Invalid token." });
    }
    // Token is valid, attach decoded user information to req.user
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
          { expiresIn: "12h" }
        );
        res.json({
          message: "Login successful",
          token,
          user_id: user.user_id,
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

app.get("/questions", verifyToken, (req, res) => {
  res.json({ message: "Welcome to Question Page!" });
});

// // Landing Page Endpoint -----------------------------------------------------------------
//working for 1 test case------------------
// Route to fetch input from test_cases table based on questionId
app.get("/test_cases/:questionId", (req, res) => {
  const { questionId } = req.params;
  const sql = "SELECT input FROM test_cases WHERE question_id = ?";
  db.query(sql, [questionId], (err, result) => {
    if (err) {
      console.error("Error fetching input:", err);
      return res.status(500).json({ error: "Error fetching input" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "No input found for the question" });
    }
    const input = result[0].input;
    res.json({ input });
  });
});

// Route to handle compilation and execution
app.post("/compile", (req, res) => {
  // Extract code, customInput, languageId, and questionId from request body
  const { code, customInput, languageId, questionId } = req.body;

  // Fetch input from test_cases table based on questionId
  // (This part is handled in the frontend)

  // Prepare data for compilation request
  const requestData = {
    source_code: code,
    language_id: languageId,
    stdin: customInput,
  };

  // Make a POST request to the Judge0 API compilation endpoint
  // (Assuming you're using Judge0 API for compilation)
  // Replace compileEndpoint with your actual Judge0 API endpoint
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

// Fetch users with role false endpoint
app.get("/users", verifyToken, (req, res) => {
  db.query(
    "SELECT user_id, email, name, username FROM users WHERE role = false",
    (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});

// Delete user endpoint
app.delete("/users/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  db.query("DELETE FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
});

// User Dashboard Endpoint
app.get("/user/dashboard/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  // Extract user_id from request parameters
  console.log("USER Id: ", req.user.user_id);
  // You can perform actions related to the user dashboard here
  res.json({ message: `Welcome to User Dashboard, user ${user_id}!` });
});

// Assuming you have a route to fetch tests for a specific user in your backend
// //user dashboard apis----------------------------------------------------------------------------------------------
// Fetch tests for a specific user endpoint (shows test on userdashboard of that specific loggged in user)
app.get("/tests/user/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  db.query(
    "SELECT test_id, test_title, test_description FROM tests WHERE created_by = ?",
    [user_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching tests:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});

// //create test page------------------------------------------------------------------------
// Backend API to fetch questions on create test page
app.get("/api/questions", (req, res) => {
  // Query the database to fetch all questions
  db.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Update the route to create a test with selected questions
app.post("/tests/:test_id/create", async (req, res) => {
  const { test_id } = req.params;
  const { test_title, test_description, created_by, questions } = req.body;

  try {
    // Check if the test already exists
    const testExists = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM tests WHERE test_id = ?",
        [test_id],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.length > 0);
          }
        }
      );
    });

    // If the test doesn't exist, create it
    if (!testExists) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO tests (test_id, test_title, test_description, created_by) VALUES (?, ?, ?, ?)",
          [test_id, test_title, test_description, created_by],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    // Insert the test-question associations into the database
    for (const question_id of questions) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO test_questions (test_id, question_id) VALUES (?, ?)",
          [test_id, question_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    console.log("Test created successfully");
    res.status(201).json({ message: "Test created successfully" });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// //--------------------------------------------------------------------------------------------
// Update the route to generate a unique test ID
app.post("/tests-user/generate-id", verifyToken, (req, res) => {
  // Generate a unique test ID
  let test_id;
  const generateTestID = () => Math.floor(Math.random() * 1000000);

  const checkTestID = () => {
    // Generate a test ID
    test_id = generateTestID();
    // Check if the generated test ID already exists in the database
    const sql = "SELECT * FROM tests WHERE test_id = ?";
    db.query(sql, [test_id], (err, results) => {
      if (err) {
        console.error("Error checking test ID:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // If the test ID doesn't exist in the database, return it
      if (results.length === 0) {
        return res.status(200).json({ test_id });
      }
      // If the test ID already exists, generate a new one
      checkTestID();
    });
  };

  // Call the function to start generating a test ID
  checkTestID();
});

// Add a new DELETE endpoint to delete a test when clicked delete button on user dashboard page
app.delete("/tests/:test_id", verifyToken, (req, res) => {
  const testId = req.params.test_id;
  // Delete associated records from the test_questions table first
  db.query(
    "DELETE FROM test_questions WHERE test_id = ?",
    [testId],
    (err, result) => {
      if (err) {
        console.error("Error deleting associated test questions:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // Once associated records are deleted, delete the test from the tests table
      db.query(
        "DELETE FROM tests WHERE test_id = ?",
        [testId],
        (err, result) => {
          if (err) {
            console.error("Error deleting test:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(200).json({ message: "Test deleted successfully" });
        }
      );
    }
  );
});

// Backend API to fetch questions for a specific test (view test button click)
app.get("/tests/:test_id/questions", verifyToken, (req, res) => {
  const { test_id } = req.params;
  // Fetch questions for the specified test_id from the database
  db.query(
    "SELECT question_id, question_text FROM questions WHERE question_id IN (SELECT question_id FROM test_questions WHERE test_id = ?)",
    [test_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching questions for test:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});

// //apis for edit test component------------------------------------------------------------

// Get test details by test ID
app.get("/tests/:testId", (req, res) => {
  const testId = req.params.testId;
  const query = "SELECT * FROM tests WHERE test_id = ?";
  db.query(query, [testId], (err, result) => {
    if (err) {
      console.error("Error fetching test details:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Test not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
});

// Get questions by test ID
app.get("/tests/:testId/questions", (req, res) => {
  const testId = req.params.testId;
  const query =
    "SELECT questions.question_id, questions.question_text FROM questions INNER JOIN test_questions ON questions.question_id = test_questions.question_id WHERE test_questions.test_id = ?";
  db.query(query, [testId], (err, result) => {
    if (err) {
      console.error("Error fetching test questions:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(result);
  });
});

// Delete question from test by question ID
app.delete("/tests/:testId/questions/:questionId", (req, res) => {
  const testId = req.params.testId;
  const questionId = req.params.questionId;
  const query =
    "DELETE FROM test_questions WHERE test_id = ? AND question_id = ?";
  db.query(query, [testId, questionId], (err, result) => {
    if (err) {
      console.error("Error deleting question from test:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Question not found in the test" });
      return;
    }
    res
      .status(200)
      .json({ message: "Question deleted from test successfully" });
  });
});

// Update test details by test ID
app.put("/tests/:testId", (req, res) => {
  const testId = req.params.testId;
  const { test_title, test_description } = req.body;
  const query =
    "UPDATE tests SET test_title = ?, test_description = ? WHERE test_id = ?";
  db.query(query, [test_title, test_description, testId], (err, result) => {
    if (err) {
      console.error("Error updating test details:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Test not found" });
      return;
    }
    res.status(200).json({ message: "Test details updated successfully" });
  });
});

// Add question to test by question ID
app.post("/tests/:testId/questions/:questionId", (req, res) => {
  const testId = req.params.testId;
  const questionId = req.params.questionId;
  const query =
    "INSERT INTO test_questions (test_id, question_id) VALUES (?, ?)";
  db.query(query, [testId, questionId], (err, result) => {
    if (err) {
      console.error("Error adding question to test:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json({ message: "Question added to test successfully" });
  });
});

// Get all questions
app.get("/api/all-questions", (req, res) => {
  const query = "SELECT * FROM questions";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching questions:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(result);
  });
});

// //apis for manage participant page ---------------------------------------------------------------------

const validateEmail = (email) => {
  // Regular expression for email validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Add Participant route
app.post("/add-participant", (req, res) => {
  const { user_id, email, test_id } = req.body;

  // Validate email format
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });
  }

  // Check if the email is already associated with the testId
  db.query(
    "SELECT * FROM participants WHERE test_id = ? AND email = ?",
    [test_id, email],
    (error, results) => {
      if (error) {
        console.error("Error checking existing participant:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Email is already associated with this test" });
      }

      const participantId = uuidv4(); // Generate participant ID using uuid library

      // Insert the participant into the database
      db.query(
        "INSERT INTO participants (participant_id, user_id, email, test_id) VALUES (?, ?, ?, ?)",
        [participantId, user_id, email, test_id],
        (insertError) => {
          if (insertError) {
            console.error("Error adding participant:", insertError);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.status(201).json({ message: "Participant added successfully" });
        }
      );
    }
  );
});

app.get("/participants/:testId", (req, res) => {
  const { testId } = req.params;

  // Fetch participants of a specific test
  db.query(
    "SELECT * FROM participants WHERE test_id = ?",
    [testId],
    (error, participants) => {
      if (error) {
        console.error("Error fetching participants:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json(participants);
    }
  );
});

// Delete a participant
app.delete("/participants/:participantId", (req, res) => {
  const { participantId } = req.params;

  // Delete participant from the database
  db.query(
    "DELETE FROM participants WHERE participant_id = ?",
    [participantId],
    (error) => {
      if (error) {
        console.error("Error deleting participant:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({ message: "Participant deleted successfully" });
    }
  );
});

// //attempt test apis---------------------------------------------------------

app.post("/attempt-test", (req, res) => {
  const { email, testId } = req.body;

  // Check if the email exists for the given test ID
  db.query(
    "SELECT * FROM participants WHERE email = ? AND test_id = ?",
    [email, testId],
    (err, results) => {
      if (err) {
        console.error("Error checking participant:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const isValid = results.length > 0;
      res.json({ isValid: isValid });
    }
  );
});

// //question ui api-----------------------------------------------------------------------
// Endpoint to fetch questions by test ID

app.get("/questions/:testId", (req, res) => {
  const { testId } = req.params;

  try {
    db.query(
      "SELECT questions.question_id, questions.question_text FROM questions INNER JOIN test_questions ON questions.question_id = test_questions.question_id WHERE test_questions.test_id = ?",
      [testId],
      (err, results) => {
        if (err) {
          console.error("Error fetching questions:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// //api for questions crud----------------------------------------------------------------------
// according to new workflow
// Endpoint to handle creation of a new question
app.post("/create-question", (req, res) => {
  try {
    const { questionContent } = req.body;

    // Generate UUID for question ID
    const questionId = uuidv4();

    // Insert question ID into MySQL database
    const sql = "INSERT INTO questions_tbl (question_id) VALUES (?)";
    db.query(sql, [questionId], (err, result) => {
      if (err) {
        console.error("Error inserting question ID into database:", err);
        res.status(500).send("Error creating question");
        return; // no further code is executed in the try block after handling the error.
      }
      console.log("Question ID inserted into database", questionId);

      // Create directory for the question if it doesn't exist
      const questionDir = path.join(__dirname, "questions", questionId); //__dirname gives absolute path of folder(full path from origin) where the code is run, in this case it is absolute path to the folder where server.js file is present
      // if we want to use custom path -> const customPath = "C:\\Users\\Admin\\Desktop\\MY_SPACE";here '\\' is used instead of '\' beacuse it is escape sequence character, so to treat it as '\' we have to use '\\'
      //                                  const questionDir = path.join(customPath, questionId);
      if (!fs.existsSync(questionDir)) {
        fs.mkdirSync(questionDir, { recursive: true }); // recursive : true -> creates parent directories if not exist, here if 'questions','questionId' directory does't exist it will create them
      }

      // Write question content to question.html file
      const questionFilePath = path.join(questionDir, "question.html");
      fs.writeFileSync(questionFilePath, questionContent); //if file not present will create it first then will write content into it
      // if file already exists, it will overwrite content in it

      res.status(201).send("Question created successfully");
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).send("Error creating question");
  }
});

// Endpoint to retrieve a question by ID
app.get("/get-question/:id", (req, res) => {
  const questionId = req.params.id;

  // Check if the question directory exists
  const questionDir = path.join(__dirname, "questions", questionId);
  if (fs.existsSync(questionDir)) {
    // Read question content from question.html file
    const questionFilePath = path.join(questionDir, "question.html");
    const questionContent = fs.readFileSync(questionFilePath, "utf8");

    res.status(200).json({ id: questionId, content: questionContent });
  } else {
    res.status(404).send("Question not found");
  }
});

// Endpoint to update a question by ID
app.put("/update-question/:id", (req, res) => {
  const questionId = req.params.id;
  const { questionContent } = req.body;

  // Check if the question directory exists
  const questionDir = path.join(__dirname, "questions", questionId);
  if (fs.existsSync(questionDir)) {
    // Write updated question content to question.html file
    const questionFilePath = path.join(questionDir, "question.html");
    fs.writeFileSync(questionFilePath, questionContent);

    console.log("question updated successfully", questionId);
    res.status(200).send("Question updated successfully");
  } else {
    res.status(404).send("Question not found");
  }
});

// Endpoint to delete a question by ID
app.delete("/delete-question/:id", (req, res) => {
  const questionId = req.params.id;

  // Check if the question directory exists
  const questionDir = path.join(__dirname, "questions", questionId);
  if (fs.existsSync(questionDir)) {
    fs.rmdirSync(questionDir, { recursive: true });
    console.log("question deleted successfully from disk", questionId);

    const sql = "DELETE FROM questions_tbl WHERE question_id = ?";
    db.query(sql, [questionId], (err, result) => {
      if (err) {
        console.error("error deleting question_id", err);
        res.status(500).send("error deleting question_id from db");
        return;
      } else {
        console.log("question_id deleted from db", questionId);
        res.status(200).send("question deleted");
      }
    });
  } else {
    res.status(404).send("Question not found");
  }
});

// // api for test cases crud-----------------------------------------------------------------------------------
// according to new workflow

// Endpoint to handle creation of a new test case -> here questionId is taken from user
// app.post("/create-testcase", (req, res) => {
//   try {
//     const { questionId, input, output, points } = req.body;

//     // Generate UUID for test case ID
//     const testCaseId = uuidv4();

//     // Insert test case ID into test_cases_tbl table
//     // Assuming you have already established a database connection
//     db.query(
//       "INSERT INTO test_cases_tbl (test_case_id, question_id, points) VALUES (?, ?, ?)",
//       [testCaseId, questionId, points],
//       (err, result) => {
//         if (err) {
//           console.error("Error inserting test case ID into database:", err);
//           res.status(500).send("Error creating test case");
//           return;
//         }
//         console.log("Test case ID inserted into database");

//         // Create directory for test cases if it doesn't exist
//         const testCasesDir = path.join(
//           __dirname,
//           "questions",
//           questionId,
//           "testcases"
//         );
//         if (!fs.existsSync(testCasesDir)) {
//           fs.mkdirSync(testCasesDir, { recursive: true });
//         }

//         // Create directory for the new test case
//         const testCaseDir = path.join(testCasesDir, testCaseId);
//         fs.mkdirSync(testCaseDir);

//         // Write input and output to files
//         fs.writeFileSync(path.join(testCaseDir, "input.txt"), input);
//         fs.writeFileSync(path.join(testCaseDir, "output.txt"), output);

//         res.status(201).send("Test case created successfully");
//       }
//     );
//   } catch (error) {
//     console.error("Error creating test case:", error);
//     res.status(500).send("Error creating test case");
//   }
// });

// api for creating testcase -> here questionId is taken from url
app.post("/create-testcase/:id", (req, res) => {
  try {
    const questionId = req.params.id;
    const { input, output, points } = req.body;
    const testcaseId = uuidv4();

    const sql =
      "INSERT INTO test_cases_tbl (test_case_id, question_id, points) VALUES (?,?,?)";
    db.query(sql, [testcaseId, questionId, points], (err, result) => {
      if (err) {
        console.error("error inserting values in db", err);
        res.status(500).send("question_id not found in db");
        return;
      }
      console.log("testcase inserted into db successfully", testcaseId);
      const testcaseDir = path.join(
        __dirname,
        "questions",
        questionId,
        "testcases",
        testcaseId
      );
      if (!fs.existsSync(testcaseDir)) {
        fs.mkdirSync(testcaseDir, { recursive: true });
      }

      fs.writeFileSync(path.join(testcaseDir, "input.txt"), input);
      fs.writeFileSync(path.join(testcaseDir, "output.txt"), output);

      console.log("created testcase");
      res.status(201).send("test case created");
    });
  } catch (error) {
    console.error("error creating testcase", error);
    res.status(500).send("problem creating testcase");
  }
});

// Endpoint to retrieve a test case by ID
app.get("/get-testcase/:id", (req, res) => {
  try {
    const testcaseId = req.params.id;

    const sql = "SELECT * FROM test_cases_tbl WHERE test_case_id = ?";
    db.query(sql, [testcaseId], (err, result) => {
      if (err) {
        console.error("error getting testcase data from db");
        res.status(500).send("problem getting testcase data from db");
        return;
      }

      if (result.length === 0) {
        res.status(404).send("testcase not found");
      }

      const testcaseData = result[0]; // testcaseData object is assigned with values obtained from db query used above

      const inputFilePath = path.join(
        __dirname,
        "questions",
        testcaseData.question_id, // as we have stored result of that query in testcaseData it consists question_id also so that is used here
        "testcases",
        testcaseId,
        "input.txt"
      );
      const outputFilePath = path.join(
        __dirname,
        "questions",
        testcaseData.question_id,
        "testcases",
        testcaseId,
        "output.txt"
      );

      fs.readFile(inputFilePath, "utf8", (err, inputContent) => {
        if (err) {
          console.error("error reading inpt.txt");
          res.status(500).send("error retrieving testcase");
          return;
        }

        fs.readFile(outputFilePath, "utf8", (err, outputContent) => {
          if (err) {
            console.error("error reading output.txt");
            res.status(500).send("error retrieving testcase");
          }
          // testcaseData object is assigned data of input.txt and output.txt
          testcaseData.inputContent = inputContent;
          testcaseData.outputContent = outputContent;

          res.status(200).json(testcaseData);
        });
      });
    });
  } catch (error) {
    console.error("error getting testcase", error);
    res.status(500).send("error getting test from db");
  }
});

// PUT Endpoint: Update a Test Case -> here questionId is taken from user
// app.put("/update-testcase/:id", (req, res) => {
//   try {
//     const testCaseId = req.params.id;
//     const { input, output, points } = req.body;

//     // Construct file paths with the correct question ID
//     const questionId = req.body.questionId; // Assuming question ID is provided in the request body
//     const inputFilePath = path.join(
//       __dirname,
//       "questions",
//       questionId,
//       "testcases",
//       testCaseId,
//       "input.txt"
//     );
//     const outputFilePath = path.join(
//       __dirname,
//       "questions",
//       questionId,
//       "testcases",
//       testCaseId,
//       "output.txt"
//     );

//     // Write updated input and output to files
//     fs.writeFileSync(inputFilePath, input);
//     fs.writeFileSync(outputFilePath, output);

//     // Update points in the database
//     db.query(
//       "UPDATE test_cases_tbl SET points = ? WHERE test_case_id = ?",
//       [points, testCaseId],
//       (err, result) => {
//         if (err) {
//           console.error("Error updating points in database:", err);
//           res.status(500).send("Error updating points");
//           return;
//         }

//         // Send success response
//         res.status(200).send("Test case updated successfully");
//       }
//     );
//   } catch (error) {
//     console.error("Error updating test case:", error);
//     res.status(500).send("Error updating test case");
//   }
// });

// here questionId is taken from db
app.put("/update-testcase/:id", (req, res) => {
  try {
    const testcaseId = req.params.id;
    const { input, output, points } = req.body;

    const sql = "SELECT question_id FROM test_cases_tbl WHERE test_case_id = ?";
    db.query(sql, [testcaseId], (err, result) => {
      if (err) {
        console.error("error getting question_id from db", err);
        res.status(500).send("error updating testcase");
        return;
      }

      if (result.length === 0) {
        res.status(404).send("testcase not found with testcaseId provided");
        return;
      }

      const questionId = result[0].question_id;

      const inputFilePath = path.join(
        __dirname,
        "questions",
        questionId,
        "testcases",
        testcaseId,
        "input.txt"
      );
      const outputFilePath = path.join(
        __dirname,
        "questions",
        questionId,
        "testcases",
        testcaseId,
        "output.txt"
      );

      fs.writeFileSync(inputFilePath, input);
      fs.writeFileSync(outputFilePath, output);

      const sql = "UPDATE test_cases_tbl SET points = ? WHERE test_case_id = ?";
      db.query(sql, [points, testcaseId], (err, result) => {
        if (err) {
          console.error("error updating points", err);
          res.status(500).send("error updating points in db");
          return;
        }
        res.status(200).send("testcase updated");
      });
    });
  } catch (error) {
    console.error("error updating testcase", error);
    res.status(500).send("error updating testcase..");
  }
});

// Endpoint to delete a test case by ID -> here questionId is taken from user
// app.delete("/delete-testcase/:id", (req, res) => {
//   const testCaseId = req.params.id;

//   // Assuming you have a database connection established
//   db.query(
//     "DELETE FROM test_cases_tbl WHERE test_case_id = ?",
//     [testCaseId],
//     (err, result) => {
//       if (err) {
//         console.error("Error deleting test case from database:", err);
//         res.status(500).send("Error deleting test case");
//         return;
//       }

//       if (result.affectedRows === 0) {
//         res.status(404).send("Test case not found");
//         return;
//       }

//       // Delete the entire test case directory from the file system
//       const questionId = req.body.questionId; // Assuming question ID is provided in the request body
//       const testCaseDir = path.join(
//         __dirname,
//         "questions",
//         questionId,
//         "testcases",
//         testCaseId
//       );

//       if (fs.existsSync(testCaseDir)) {
//         fs.rmdirSync(testCaseDir, { recursive: true });
//         res
//           .status(200)
//           .send("Test case and associated files deleted successfully");
//       } else {
//         res.status(404).send("Test case directory not found");
//       }
//     }
//   );
// });

// here question id is taken from db
app.delete("/delete-testcase/:id", (req, res) => {
  const testcaseId = req.params.id;

  const sql = "SELECT question_id FROM test_cases_tbl WHERE test_case_id = ?";
  db.query(sql, [testcaseId], (err, result) => {
    if (err) {
      console.error("error getting question_id from db", err);
      res.status(500).send("testcaseId not present in db");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("testcaseId not found");
      return;
    }

    const questionId = result[0].question_id;

    const sql = "DELETE FROM test_cases_tbl WHERE test_case_id = ?";
    db.query(sql, [testcaseId], (err, result) => {
      if (err) {
        console.error("error deleting testcase", err);
        res.status(500).send("error deleting testcase");
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send("testcase not found");
        return;
      }

      if (result.affectedRows !== 0) {
        console.log("deleted testcase from db", testcaseId);
      }

      const testcaseDir = path.join(
        __dirname,
        "questions",
        questionId,
        "testcases",
        testcaseId
      );

      if (fs.existsSync(testcaseDir)) {
        fs.rmdirSync(testcaseDir, { recursive: true });
        res.status(200).send("testcase deleted successfully from disk");
      } else {
        res.status(404).send("testcase folder not found");
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
