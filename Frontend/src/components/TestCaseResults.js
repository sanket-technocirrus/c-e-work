import React from "react";

const TestCaseResults = ({ testCases }) => {
  return (
    <div className="test-case-results">
      {testCases.map((testCase, index) => (
        <div
          key={index}
          className={`test-case ${testCase.passed ? "passed" : "failed"}`}
        >
          {`Testcase ${index + 1}: ${testCase.passed ? "Passed" : "Failed"}`}
        </div>
      ))}
    </div>
  );
};

export default TestCaseResults;
