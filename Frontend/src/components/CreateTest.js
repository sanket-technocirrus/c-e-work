// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const CreateTest = () => {
//   const [testTitle, setTestTitle] = useState("");
//   const [testDescription, setTestDescription] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [addedQuestions, setAddedQuestions] = useState([]);

//   const navigate = useNavigate();
//   const { test_id } = useParams();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/questions");
//         setQuestions(response.data);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   const handleAddQuestion = (questionId) => {
//     setSelectedQuestions((prevSelectedQuestions) => [
//       ...prevSelectedQuestions,
//       questionId,
//     ]);
//     setAddedQuestions((prevAddedQuestions) => [
//       ...prevAddedQuestions,
//       questionId,
//     ]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const createdBy = localStorage.getItem("user_id");
//       await axios.post(`http://localhost:5000/tests/${test_id}/create`, {
//         test_title: testTitle,
//         test_description: testDescription,
//         created_by: createdBy,
//         questions: selectedQuestions,
//       });
//       // Redirect to user dashboard after test creation
//       navigate(`/user/dashboard/${createdBy}`);
//     } catch (error) {
//       console.error("Error creating test:", error);
//     }
//   };

//   const isQuestionAdded = (questionId) => addedQuestions.includes(questionId);

//   return (
//     <div className="container">
//       <h1>Create New Test</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="testTitle">Test Title</label>
//           <input
//             type="text"
//             id="testTitle"
//             value={testTitle}
//             onChange={(e) => setTestTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="testDescription">Test Description</label>
//           <textarea
//             id="testDescription"
//             value={testDescription}
//             onChange={(e) => setTestDescription(e.target.value)}
//             required
//           />
//         </div>
//         <h2>Available Questions</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Question Text</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {questions.map((question) => (
//               <tr key={question.question_id}>
//                 <td>{question.question_text}</td>
//                 <td>
//                   <button
//                     type="button"
//                     onClick={() => handleAddQuestion(question.question_id)}
//                     disabled={isQuestionAdded(question.question_id)}
//                   >
//                     {isQuestionAdded(question.question_id) ? "Added" : "Add"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button type="submit">Create Test</button>
//       </form>
//     </div>
//   );
// };

// export default CreateTest;
// //---------------------------------------------------------------
// // with css
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateTest.css"; // Import the CSS file

const CreateTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [addedQuestions, setAddedQuestions] = useState([]);

  const navigate = useNavigate();
  const { test_id } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAddQuestion = (questionId) => {
    setSelectedQuestions((prevSelectedQuestions) => [
      ...prevSelectedQuestions,
      questionId,
    ]);
    setAddedQuestions((prevAddedQuestions) => [
      ...prevAddedQuestions,
      questionId,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdBy = localStorage.getItem("user_id");
      await axios.post(`http://localhost:5000/tests/${test_id}/create`, {
        test_title: testTitle,
        test_description: testDescription,
        created_by: createdBy,
        questions: selectedQuestions,
      });
      // Redirect to user dashboard after test creation
      navigate(`/user/dashboard/${createdBy}`);
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const isQuestionAdded = (questionId) => addedQuestions.includes(questionId);

  return (
    <div className="create-test-container">
      <h1>Create New Test</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="testTitle">Test Title</label>
          <input
            type="text"
            id="testTitle"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="testDescription">Test Description</label>
          <textarea
            id="testDescription"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            required
          />
        </div>
        <h2>Available Questions</h2>
        <table>
          <thead>
            <tr>
              <th>Question Text</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.question_id}>
                <td>{question.question_text}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleAddQuestion(question.question_id)}
                    disabled={isQuestionAdded(question.question_id)}
                  >
                    {isQuestionAdded(question.question_id) ? "Added" : "Add"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Create Test</button>
      </form>
    </div>
  );
};

export default CreateTest;
