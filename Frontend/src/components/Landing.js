// import React, { useEffect, useState } from "react";
// import CodeEditorWindow from "./CodeEditorWindow";
// import axios from "axios";
// import { classnames } from "../utils/general";
// import { languageOptions } from "../constants/languageOptions";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { defineTheme } from "../lib/defineTheme";
// import useKeyPress from "../hooks/useKeyPress";
// import Footer from "./Footer";
// import OutputWindow from "./OutputWindow";
// import CustomInput from "./CustomInput";
// import OutputDetails from "./OutputDetails";
// import ThemeDropdown from "./ThemeDropdown";
// import LanguagesDropdown from "./LanguagesDropdown";
// import QuestionSection from "./QuestionSection";
// import { useLocation, useParams } from "react-router-dom";

// const pythonDefault = `#write code here
// num = int(input())

// def factorial(n):
//     if n == 0 or n == 1:
//         return 1
//     else:
//         return n * factorial(n - 1)

// result = factorial(num)
// print("faactorial of", num, "is:", result)
// `;

// const Landing = () => {
//   const [code, setCode] = useState(pythonDefault);
//   const [customInput, setCustomInput] = useState("");
//   const [outputDetails, setOutputDetails] = useState(null);
//   const [processing, setProcessing] = useState(null);
//   const [theme, setTheme] = useState("cobalt");
//   const [language, setLanguage] = useState(languageOptions[0]);
//   const [leftWidth, setLeftWidth] = useState("30%"); // Initial width for the left section

//   const location = useLocation();

//   // for showing question passed from question ui on landing page
//   const questionContent = location.state && location.state.questionContent;
//   console.log("Question Content:", questionContent);
//   console.log(location["state"]);

//   const { questionId } = useParams();

//   const enterPress = useKeyPress("Enter");
//   const ctrlPress = useKeyPress("Control");

//   const onSelectChange = (sl) => {
//     console.log("selected Option...", sl);
//     setLanguage(sl);
//   };

//   useEffect(() => {
//     if (enterPress && ctrlPress) {
//       console.log("enterPress", enterPress);
//       console.log("ctrlPress", ctrlPress);
//       handleCompile();
//     }
//   }, [ctrlPress, enterPress]);

//   const onChange = (action, data) => {
//     switch (action) {
//       case "code": {
//         setCode(data);
//         break;
//       }
//       default: {
//         console.warn("case not handled!", action, data);
//       }
//     }
//   };

//   const handleCompile = () => {
//     setProcessing(true);
//     const formData = {
//       code,
//       customInput,
//       languageId: language.id,
//     };

//     axios
//       .post("http://localhost:5000/compile", formData)
//       .then(function (response) {
//         console.log("Compilation request sent to backend:", response.data);
//         const jobId = response.data.jobId;
//         pollForResult(jobId);
//       })
//       .catch((err) => {
//         console.error("Error compiling code:", err);
//         setProcessing(false);
//         showErrorToast();
//       });
//   };

//   const pollForResult = (jobId) => {
//     axios
//       .get(`http://localhost:5000/results/${jobId}`)
//       .then(function (response) {
//         console.log("Polling response:", response.data);
//         if (response.data.status.description === "In Queue") {
//           setTimeout(() => {
//             pollForResult(jobId);
//           }, 2000);
//         } else {
//           setProcessing(false);
//           setOutputDetails(response.data);
//           showSuccessToast(`Compiled Successfully!`);
//         }
//       })
//       .catch((err) => {
//         console.error("Error polling for result:", err);
//         setProcessing(false);
//         showErrorToast();
//       });
//   };

//   function handleThemeChange(th) {
//     const theme = th;
//     console.log("theme...", theme);

//     if (["light", "vs-dark"].includes(theme.value)) {
//       setTheme(theme);
//     } else {
//       defineTheme(theme.value).then((_) => setTheme(theme));
//     }
//   }
//   useEffect(() => {
//     defineTheme("oceanic-next").then((_) =>
//       setTheme({ value: "oceanic-next", label: "Oceanic Next" })
//     );
//   }, []);

//   const showSuccessToast = (msg) => {
//     toast.success(msg || `Compiled Successfully!`, {
//       position: "top-right",
//       autoClose: 1000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const showErrorToast = (msg, timer) => {
//     toast.error(msg || `Something went wrong! Please try again.`, {
//       position: "top-right",
//       autoClose: timer ? timer : 1000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const handleMouseMove = (e) => {
//     setLeftWidth(`${e.clientX}px`);
//   };

//   const handleMouseUp = () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseDown = () => {
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <a
//         href="https://github.com/manuarora700/react-code-editor"
//         title="Fork me on GitHub"
//         className="github-corner"
//         target="_blank"
//         rel="noreferrer"
//       >
//         <svg
//           width="50"
//           height="50"
//           viewBox="0 0 250 250"
//           className="relative z-20 h-20 w-20"
//         >
//           <title>Fork me on GitHub</title>
//           <path d="M0 0h250v250"></path>
//           <path
//             d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
//             fill="currentColor"
//             style={{ transformOrigin: "130px 110px" }}
//             className="octo-arm"
//           ></path>
//           <path
//             d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
//             fill="currentColor"
//             className="octo-body"
//           ></path>
//         </svg>
//       </a>

//       <div className="h-screen overflow-hidden">
//         <div className="h-full flex flex-row">
//           <div
//             className="px-4 py-2 relative"
//             style={{ width: leftWidth, minWidth: "200px", maxWidth: "50%" }}
//           >
//             {/* Left Section (Question Section) */}
//             <div
//               className="resize-handle"
//               onMouseDown={handleMouseDown}
//               style={{ cursor: "col-resize" }}
//             ></div>
//             <div
//               className="question-section overflow-y-auto"
//               style={{ maxHeight: "calc(100vh - 80px)" }}
//             >
//               {/* for showing question passed from question ui on landing page */}

//               <QuestionSection questionContent={questionContent} />
//             </div>
//           </div>
//           <div className="px-4 py-2 w-full">
//             {/* Right Section (Code Editor, Output Window, etc.) */}
//             <div className="flex flex-row space-x-4 items-start">
//               <div className="flex flex-col w-full h-full justify-start items-end">
//                 <div className="flex space-x-4 items-center">
//                   <LanguagesDropdown onSelectChange={onSelectChange} />
//                   <ThemeDropdown
//                     handleThemeChange={handleThemeChange}
//                     theme={theme}
//                   />
//                 </div>
//                 <CodeEditorWindow
//                   code={code}
//                   onChange={onChange}
//                   language={language?.value}
//                   theme={theme.value}
//                 />
//               </div>

//               <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
//                 <OutputWindow outputDetails={outputDetails} />
//                 <div className="flex flex-col items-end">
//                   <CustomInput
//                     customInput={customInput}
//                     setCustomInput={setCustomInput}
//                   />
//                   <button
//                     onClick={handleCompile}
//                     disabled={!code}
//                     className={classnames(
//                       "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
//                       !code ? "opacity-50" : ""
//                     )}
//                   >
//                     {processing ? "Processing..." : "Compile and Execute"}
//                   </button>
//                 </div>
//                 {outputDetails && (
//                   <OutputDetails outputDetails={outputDetails} />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       <style jsx>{`
//         .resize-handle {
//           width: 8px;
//           height: 100%;
//           background-color: #ddd;
//           position: absolute;
//           right: -4px;
//           top: 0;
//           z-index: 1;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Landing;
// //---------------------------------------
// // for implementing testcases
// // this code is working for multiple testcases when user dont give custom input
// import React, { useEffect, useState } from "react";
// import CodeEditorWindow from "./CodeEditorWindow";
// import axios from "axios";
// import { classnames } from "../utils/general";
// import { languageOptions } from "../constants/languageOptions";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { defineTheme } from "../lib/defineTheme";
// import useKeyPress from "../hooks/useKeyPress";
// import Footer from "./Footer";
// import OutputWindow from "./OutputWindow";
// import CustomInput from "./CustomInput";
// import OutputDetails from "./OutputDetails";
// import ThemeDropdown from "./ThemeDropdown";
// import LanguagesDropdown from "./LanguagesDropdown";
// import QuestionSection from "./QuestionSection";
// import { useLocation, useParams } from "react-router-dom";

// const pythonDefault = `#write code here
// num = int(input())

// def factorial(n):
//     if n == 0 or n == 1:
//         return 1
//     else:
//         return n * factorial(n - 1)

// result = factorial(num)
// print(result)
// `;

// const Landing = () => {
//   const [code, setCode] = useState(pythonDefault);
//   const [customInput, setCustomInput] = useState("");
//   const [outputDetails, setOutputDetails] = useState(null);
//   const [processing, setProcessing] = useState(null);
//   const [theme, setTheme] = useState("cobalt");
//   const [language, setLanguage] = useState(languageOptions[0]);
//   const [leftWidth, setLeftWidth] = useState("30%"); // Initial width for the left section

//   const { questionId } = useParams();

//   const location = useLocation();

//   // for showing question passed from question ui on landing page
//   const questionContent = location.state && location.state.questionContent;
//   // console.log("Question Content:", questionContent);
//   // console.log(location["state"]);

//   const enterPress = useKeyPress("Enter");
//   const ctrlPress = useKeyPress("Control");

//   const onSelectChange = (sl) => {
//     console.log("selected Option...", sl);
//     setLanguage(sl);
//   };

//   useEffect(() => {
//     if (enterPress && ctrlPress) {
//       console.log("enterPress", enterPress);
//       console.log("ctrlPress", ctrlPress);
//       handleCompile();
//     }
//   }, [ctrlPress, enterPress]);

//   const onChange = (action, data) => {
//     switch (action) {
//       case "code": {
//         setCode(data);
//         break;
//       }
//       default: {
//         console.warn("case not handled!", action, data);
//       }
//     }
//   };

//   const handleCompile = () => {
//     setProcessing(true);
//     const formData = {
//       code,
//       customInput,
//       languageId: language.id, // Example language ID
//       questionId: questionId, // Pass question ID to backend
//     };

//     axios
//       .post("http://localhost:5000/compile", formData)
//       .then(function (response) {
//         console.log("Compilation request sent to backend:", response.data);
//         const jobId = response.data.jobId;
//         // Once compilation is successful, fetch test cases
//         fetchTestCases(questionId, jobId);
//       })
//       .catch((err) => {
//         console.error("Error compiling code:", err);
//         setProcessing(false);
//         showErrorToast();
//       });
//   };

//   const fetchTestCases = (questionId, jobId) => {
//     axios
//       .get(`http://localhost:5000/get-all-testcases/${questionId}`)
//       .then((response) => {
//         console.log("Test cases retrieved:", response.data);
//         const testCases = response.data;
//         // Run user's code against each test case
//         runUserCode(jobId, testCases);
//       })
//       .catch((err) => {
//         console.error("Error fetching test cases:", err);
//         setProcessing(false);
//         showErrorToast();
//       });
//   };

//   const runUserCode = (jobId, testCases) => {
//     // Iterate over each test case
//     testCases.forEach((testCase) => {
//       let inputToUse = customInput; // Initialize input to use

//       // If custom input is not provided, use test case input
//       if (!customInput) {
//         inputToUse = testCase.inputContent;
//       }

//       const formData = {
//         code,
//         customInput: inputToUse, // Use custom input or test case input
//         languageId: language.id, // Example language ID
//       };

//       axios
//         .post("http://localhost:5000/compile", formData)
//         .then(function (response) {
//           console.log("Compilation request sent to backend:", response.data);
//           const resultJobId = response.data.jobId;
//           // Poll for result of user's code against current test case
//           pollForResult(resultJobId, testCase);
//         })
//         .catch((err) => {
//           console.error("Error compiling code for test case:", err);
//           showErrorToast(
//             `Error compiling code for test case ${testCase.test_case_id}`
//           );
//         });
//     });
//   };

//   const pollForResult = (jobId, testCase) => {
//     axios
//       .get(`http://localhost:5000/results/${jobId}`)
//       .then((response) => {
//         console.log("Polling response:", response.data);
//         if (response.data.status.description === "In Queue") {
//           setTimeout(() => {
//             pollForResult(jobId, testCase);
//           }, 5000);
//         } else {
//           setProcessing(false);
//           const outputDetails = response.data;
//           // Compare output with expected output for current test case
//           compareOutput(outputDetails, testCase);
//         }
//       })
//       .catch((err) => {
//         console.error("Error polling for result:", err);
//         setProcessing(false);
//         showErrorToast();
//       });
//   };

//   const compareOutput = (outputDetails, testCase) => {
//     // Compare output with expected output
//     const userOutput = outputDetails.stdout.trim();
//     const expectedOutput = testCase.outputContent.trim();

//     console.log("User Output:", userOutput);
//     console.log("Expected Output:", expectedOutput);

//     if (userOutput === expectedOutput) {
//       console.log(`Test case ${testCase.test_case_id} passed`);
//     } else {
//       console.log(`Test case ${testCase.test_case_id} failed`);
//     }
//   };

//   function handleThemeChange(th) {
//     const theme = th;
//     console.log("theme...", theme);

//     if (["light", "vs-dark"].includes(theme.value)) {
//       setTheme(theme);
//     } else {
//       defineTheme(theme.value).then((_) => setTheme(theme));
//     }
//   }
//   useEffect(() => {
//     defineTheme("oceanic-next").then((_) =>
//       setTheme({ value: "oceanic-next", label: "Oceanic Next" })
//     );
//   }, []);

//   const showSuccessToast = (msg) => {
//     toast.success(msg || `Compiled Successfully!`, {
//       position: "top-right",
//       autoClose: 1000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const showErrorToast = (msg, timer) => {
//     toast.error(msg || `Something went wrong! Please try again.`, {
//       position: "top-right",
//       autoClose: timer ? timer : 1000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const handleMouseMove = (e) => {
//     setLeftWidth(`${e.clientX}px`);
//   };

//   const handleMouseUp = () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseDown = () => {
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <a
//         href="https://github.com/manuarora700/react-code-editor"
//         title="Fork me on GitHub"
//         className="github-corner"
//         target="_blank"
//         rel="noreferrer"
//       >
//         <svg
//           width="50"
//           height="50"
//           viewBox="0 0 250 250"
//           className="relative z-20 h-20 w-20"
//         >
//           <title>Fork me on GitHub</title>
//           <path d="M0 0h250v250"></path>
//           <path
//             d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
//             fill="currentColor"
//             style={{ transformOrigin: "130px 110px" }}
//             className="octo-arm"
//           ></path>
//           <path
//             d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
//             fill="currentColor"
//             className="octo-body"
//           ></path>
//         </svg>
//       </a>

//       <div className="h-screen overflow-hidden">
//         <div className="h-full flex flex-row">
//           <div
//             className="px-4 py-2 relative"
//             style={{ width: leftWidth, minWidth: "200px", maxWidth: "50%" }}
//           >
//             {/* Left Section (Question Section) */}
//             <div
//               className="resize-handle"
//               onMouseDown={handleMouseDown}
//               style={{ cursor: "col-resize" }}
//             ></div>
//             <div
//               className="question-section overflow-y-auto"
//               style={{ maxHeight: "calc(100vh - 80px)" }}
//             >
//               {/* for showing question passed from question ui on landing page */}

//               <QuestionSection questionContent={questionContent} />
//             </div>
//           </div>
//           <div className="px-4 py-2 w-full">
//             {/* Right Section (Code Editor, Output Window, etc.) */}
//             <div className="flex flex-row space-x-4 items-start">
//               <div className="flex flex-col w-full h-full justify-start items-end">
//                 <div className="flex space-x-4 items-center">
//                   <LanguagesDropdown onSelectChange={onSelectChange} />
//                   <ThemeDropdown
//                     handleThemeChange={handleThemeChange}
//                     theme={theme}
//                   />
//                 </div>
//                 <CodeEditorWindow
//                   code={code}
//                   onChange={onChange}
//                   language={language?.value}
//                   theme={theme.value}
//                 />
//               </div>

//               <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
//                 <OutputWindow outputDetails={outputDetails} />
//                 <div className="flex flex-col items-end">
//                   <CustomInput
//                     customInput={customInput}
//                     setCustomInput={setCustomInput}
//                   />
//                   <button
//                     onClick={handleCompile}
//                     disabled={!code}
//                     className={classnames(
//                       "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
//                       !code ? "opacity-50" : ""
//                     )}
//                   >
//                     {processing ? "Processing..." : "Compile and Execute"}
//                   </button>
//                 </div>
//                 {outputDetails && (
//                   <OutputDetails outputDetails={outputDetails} />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       <style jsx>{`
//         .resize-handle {
//           width: 8px;
//           height: 100%;
//           background-color: #ddd;
//           position: absolute;
//           right: -4px;
//           top: 0;
//           z-index: 1;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Landing;
// //----------------------------------------------------------
// // v3 for user giving custom input then testcases should not run

import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import QuestionSection from "./QuestionSection";
import { useLocation, useParams } from "react-router-dom";

const pythonDefault = `#write code here
num = int(input())

def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

result = factorial(num)
print(result)
`;

const Landing = () => {
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [leftWidth, setLeftWidth] = useState("30%"); // Initial width for the left section

  const { questionId } = useParams();

  const location = useLocation();

  // for showing question passed from question ui on landing page
  const questionContent = location.state && location.state.questionContent;
  // console.log("Question Content:", questionContent);
  // console.log(location["state"]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      code,
      customInput,
      languageId: language.id,
      questionId: questionId,
    };

    axios
      .post("http://localhost:5000/compile", formData) // with this call if there is custom input provided, the code is compiled once with the custom input. If there is no custom input, the code is compiled once, and then the test cases are fetched to run the code against them.
      .then(function (response) {
        console.log("Compilation request sent to backend:", response.data);
        const jobId = response.data.jobId;
        // Check if custom input is provided
        if (customInput) {
          // If custom input is provided, run the code against it only
          runUserCode(jobId, []);
        } else {
          // If custom input is not provided, fetch test cases and run the code against all test cases
          fetchTestCases(questionId, jobId);
        }
      })
      .catch((err) => {
        console.error("Error compiling code:", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  const fetchTestCases = (questionId, jobId) => {
    axios
      .get(`http://localhost:5000/get-all-testcases/${questionId}`)
      .then((response) => {
        console.log("Test cases retrieved:", response.data);
        const testCases = response.data;
        // Run user's code against each test case
        runUserCode(jobId, testCases);
      })
      .catch((err) => {
        console.error("Error fetching test cases:", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  const runUserCode = (jobId, testCases) => {
    // If testCases array is empty, it means custom input was provided, so just run once
    if (testCases.length === 0) {
      // Run user's code once against the provided custom input
      const formData = {
        code,
        customInput,
        languageId: language.id,
      };

      axios
        .post("http://localhost:5000/compile", formData) // After the initial compilation, if there are test cases to be run against the code, additional compilation requests are made for each test case. For each test case, the code is compiled again with the specific test case input provided.
        .then(function (response) {
          console.log("Compilation request sent to backend:", response.data);
          const resultJobId = response.data.jobId;
          // Poll for result of user's code against custom input
          pollForResult(resultJobId, null);
        })
        .catch((err) => {
          console.error("Error compiling code for custom input:", err);
          showErrorToast("Error compiling code for custom input");
        });
    } else {
      // Run user's code against each test case
      testCases.forEach((testCase) => {
        const inputToUse = testCase.inputContent;

        const formData = {
          code,
          customInput: inputToUse,
          languageId: language.id,
        };

        axios
          .post("http://localhost:5000/compile", formData)
          .then(function (response) {
            console.log("Compilation request sent to backend:", response.data);
            const resultJobId = response.data.jobId;
            // Poll for result of user's code against current test case
            pollForResult(resultJobId, testCase);
          })
          .catch((err) => {
            console.error("Error compiling code for test case:", err);
            showErrorToast(
              `Error compiling code for test case ${testCase.test_case_id}`
            );
          });
      });
    }
  };

  const pollForResult = (jobId, testCase) => {
    axios
      .get(`http://localhost:5000/results/${jobId}`)
      .then((response) => {
        console.log("Polling response:", response.data);
        if (response.data.status.description === "In Queue") {
          setTimeout(() => {
            pollForResult(jobId, testCase);
          }, 2000);
        } else {
          setProcessing(false);
          const outputDetails = response.data;
          // Compare output with expected output for current test case
          compareOutput(outputDetails, testCase);
        }
      })
      .catch((err) => {
        console.error("Error polling for result:", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  const compareOutput = (outputDetails, testCase) => {
    console.log(outputDetails);
    console.log(testCase);

    // Check if outputDetails and testCase are not null
    if (outputDetails && testCase) {
      // Compare output with expected output
      const userOutput = outputDetails.stdout.trim();
      const expectedOutput = testCase.outputContent.trim();

      console.log("User Output:", userOutput);
      console.log("Expected Output:", expectedOutput);

      if (userOutput === expectedOutput) {
        console.log(`Test case ${testCase.test_case_id} passed`);
      } else {
        console.log(`Test case ${testCase.test_case_id} failed`);
      }
    } else {
      console.log("result => ", outputDetails.stdout.trim());
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleMouseMove = (e) => {
    setLeftWidth(`${e.clientX}px`);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <a
        href="https://github.com/manuarora700/react-code-editor"
        title="Fork me on GitHub"
        className="github-corner"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 250 250"
          className="relative z-20 h-20 w-20"
        >
          <title>Fork me on GitHub</title>
          <path d="M0 0h250v250"></path>
          <path
            d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
            fill="currentColor"
            style={{ transformOrigin: "130px 110px" }}
            className="octo-arm"
          ></path>
          <path
            d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a>

      <div className="h-screen overflow-hidden">
        <div className="h-full flex flex-row">
          <div
            className="px-4 py-2 relative"
            style={{ width: leftWidth, minWidth: "200px", maxWidth: "50%" }}
          >
            {/* Left Section (Question Section) */}
            <div
              className="resize-handle"
              onMouseDown={handleMouseDown}
              style={{ cursor: "col-resize" }}
            ></div>
            <div
              className="question-section overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 80px)" }}
            >
              {/* for showing question passed from question ui on landing page */}

              <QuestionSection questionContent={questionContent} />
            </div>
          </div>
          <div className="px-4 py-2 w-full">
            {/* Right Section (Code Editor, Output Window, etc.) */}
            <div className="flex flex-row space-x-4 items-start">
              <div className="flex flex-col w-full h-full justify-start items-end">
                <div className="flex space-x-4 items-center">
                  <LanguagesDropdown onSelectChange={onSelectChange} />
                  <ThemeDropdown
                    handleThemeChange={handleThemeChange}
                    theme={theme}
                  />
                </div>
                <CodeEditorWindow
                  code={code}
                  onChange={onChange}
                  language={language?.value}
                  theme={theme.value}
                />
              </div>

              <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
                <OutputWindow outputDetails={outputDetails} />
                <div className="flex flex-col items-end">
                  <CustomInput
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                  />
                  <button
                    onClick={handleCompile}
                    disabled={!code}
                    className={classnames(
                      "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                      !code ? "opacity-50" : ""
                    )}
                  >
                    {processing ? "Processing..." : "Compile and Execute"}
                  </button>
                </div>
                {outputDetails && (
                  <OutputDetails outputDetails={outputDetails} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .resize-handle {
          width: 8px;
          height: 100%;
          background-color: #ddd;
          position: absolute;
          right: -4px;
          top: 0;
          z-index: 1;
        }
      `}</style>
    </>
  );
};

export default Landing;
