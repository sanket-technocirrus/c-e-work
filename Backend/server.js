// // // version 7 organization CRUD i.e Tests CRUD

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios for making HTTP requests
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("./DBconfig");
const { v4: uuidv4 } = require("uuid");

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
    language_id: languageId,
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

// Fetch participants of a specific test
// app.get("/participants/:testId", (req, res) => {
//   const { testId } = req.params;

//   try {
//     const participants = db.query(
//       "SELECT * FROM participants WHERE test_id = ?",
//       [testId]
//     );

//     res.status(200).json(participants);
//   } catch (error) {
//     console.error("Error fetching participants:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Delete a participant
// app.delete("/participants/:participantId", (req, res) => {
//   const { participantId } = req.params;

//   try {
//     db.query("DELETE FROM participants WHERE participant_id = ?", [
//       participantId,
//     ]);

//     res.status(200).json({ message: "Participant deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting participant:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
