import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
// import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import QuestionSection from "./QuestionSection";
import { useParams, useNavigate } from "react-router-dom";
import TimeUpModal from "./TimeUpModal";

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
  const [questionContent, setQuestionContent] = useState(null);
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [leftWidth, setLeftWidth] = useState("30%"); // initial width for the left section
  const [testCaseResults, setTestCaseResults] = useState({});
  const [duration, setDuration] = useState(0); // duration of the test in minutes
  const [remainingTime, setRemainingTime] = useState(0); // remaining time in seconds
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const testId = localStorage.getItem("test id");
  const { questionId } = useParams();

  // here im fetching test duration from the backend
  useEffect(() => {
    axios
      .get(`http://localhost:5000/tests/${testId}`)
      .then((response) => {
        setDuration(response.data.duration);
        const savedRemainingTime = localStorage.getItem("remainingTime");
        if (savedRemainingTime) {
          setRemainingTime(parseInt(savedRemainingTime));
        } else {
          setRemainingTime(response.data.duration * 60); // convert duration to seconds
        }
      })
      .catch((error) => {
        console.error("Error fetching test duration:", error);
      });
  }, [testId]);

  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // stop the timer when remaining time reaches 0
          submitTest(); // automatically submit the test when time is over
          return 0;
        } else {
          const updatedTime = prevTime - 1;
          localStorage.setItem("remainingTime", updatedTime); // store updated time in local storage
          return updatedTime;
        }
      });
    }, 1000); // update every second

    // cleanup function to clear the timer
    return () => clearInterval(timer);
  }, []);

  const submitTest = () => {
    console.log("Test submitted automatically");
    localStorage.clear();
    setShowModal(true);
  };

  // convert remaining time to minutes and seconds
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const closeModal = () => {
    setShowModal(false);
    navigate("/thank-you");
  };

  //----------------------------------------------------------

  useEffect(() => {
    fetchQuestionContent(questionId);
  }, [questionId]);

  const fetchQuestionContent = (questionId) => {
    axios
      .get(`http://localhost:5000/get-question/${questionId}`)
      .then((response) => {
        setQuestionContent(response.data.content);
      })
      .catch((err) => {
        console.error("Error fetching question content:", err);
        showErrorToast("Error fetching question content");
      });
  };

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
      .post("http://localhost:5000/compile", formData)
      .then(function (response) {
        console.log("Compilation request sent to backend:", response.data);
        const jobId = response.data.jobId;
        if (customInput) {
          runUserCode(jobId, []);
        } else {
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
        runUserCode(jobId, testCases);
      })
      .catch((err) => {
        console.error("Error fetching test cases:", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  const runUserCode = (jobId, testCases) => {
    if (testCases.length === 0) {
      const formData = {
        code,
        customInput,
        languageId: language.id,
      };

      axios
        .post("http://localhost:5000/compile", formData)
        .then(function (response) {
          console.log("Compilation request sent to backend:", response.data);
          const resultJobId = response.data.jobId;
          pollForResult(resultJobId, null);
        })
        .catch((err) => {
          console.error("Error compiling code for custom input:", err);
          showErrorToast("Error compiling code for custom input");
        });
    } else {
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

  let errorToastShown = false; // flag to track if error toast has been shown

  const pollForResult = (jobId, testCase) => {
    axios
      .get(`http://localhost:5000/results/${jobId}`, {
        params: {
          email: localStorage.getItem("email"),
          testcaseId: testCase ? testCase.test_case_id : null,
          questionId: testCase ? testCase.question_id : null,
          points: testCase ? testCase.points : null,
          inputContent: testCase ? testCase.inputContent : customInput,
        },
      })
      .then((response) => {
        console.log("Polling response:", response.data);
        if (response.data.status.description === "In Queue") {
          setTimeout(() => {
            pollForResult(jobId, testCase);
          }, 2000);
        } else {
          setProcessing(false);
          console.log(response.data);
          const outputDetails = response.data;
          compareOutput(outputDetails, testCase);
        }
      })
      .catch((err) => {
        console.error("Error polling for result:", err);
        if (!errorToastShown) {
          showErrorToast("provided code has errors");
          errorToastShown = true;
        }
        setProcessing(false);
      });
  };

  const compareOutput = (outputDetails, testCase) => {
    if (outputDetails && testCase) {
      const userOutput = outputDetails.stdout.trim();
      const expectedOutput = testCase.outputContent.trim();

      console.log("User Output:", userOutput);
      console.log("Expected Output:", expectedOutput);

      const testCaseResult = {
        id: testCase.test_case_id,
        passed: userOutput === expectedOutput,
      };

      setTestCaseResults((prevResults) => ({
        ...prevResults,
        [testCase.test_case_id]: testCaseResult,
      }));
    } else {
      setOutputDetails(outputDetails);
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
      {showModal && <TimeUpModal onClose={closeModal} />}

      <div
        className="h-screen overflow-hidden"
        style={{ display: showModal ? "none" : "block" }}
      >
        <div className="h-full flex flex-row">
          <div
            className="px-4 py-2 relative"
            style={{ width: leftWidth, minWidth: "200px", maxWidth: "50%" }}
          >
            {/* left Section (Question Section) */}
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
            {/* right Section (Code Editor, Output Window..) */}
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
                <div>
                  <h2>
                    {" "}
                    Remaining Time: {minutes} minutes {seconds} seconds
                  </h2>
                </div>
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
                  {/* to render test case results */}
                  {Object.keys(testCaseResults).length > 0 && (
                    <div className="mt-4">
                      {Object.values(testCaseResults).map((result, index) => (
                        <p key={index}>
                          Testcase {index + 1}:{" "}
                          {result.passed ? "Passed" : "Failed"}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                {/* {outputDetails && (
                  <OutputDetails outputDetails={outputDetails} />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
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
