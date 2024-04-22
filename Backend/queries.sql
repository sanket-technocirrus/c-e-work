-- users table
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    role BOOLEAN DEFAULT false
);

-- tests table
CREATE TABLE tests (
	test_id INT PRIMARY KEY AUTO_INCREMENT,
    test_title VARCHAR(255),
    test_description VARCHAR(255),
    created_by VARCHAR(36),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- questions table (for storing all questions which are displayed on create test page)
CREATE TABLE questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    question_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sample input for questions
-- Question 1
INSERT INTO questions (question_text) VALUES ('Write a function to calculate the factorial of a number.');

-- Question 2
INSERT INTO questions (question_text) VALUES ('Write a function to check if a string is a palindrome.');

-- Question 3
INSERT INTO questions (question_text) VALUES ('Write a function to reverse a number.');

-- Question 4
INSERT INTO questions (question_text) VALUES ('Write a function to calculate the nth Fibonacci number.');

-- Question 5
INSERT INTO questions (question_text) VALUES ('Write a function to calculate the sum of elements in an array.');

-- Question 6
INSERT INTO questions (question_text) VALUES ('Write a function to calculate the nth triangular number.');

-- Question 7
INSERT INTO questions (question_text) VALUES ('Write a function to check if two strings are anagrams of each other.');

-- Question 8
INSERT INTO questions (question_text) VALUES ('Write a function to calculate the LCM of two numbers.');

-- Question 9
INSERT INTO questions (question_text) VALUES ('Write a function to find the smallest element in an array.');

-- Question 10
INSERT INTO questions (question_text) VALUES ('Write a function to find the second smallest element in an array.');


-- CREATE TABLE test_cases (
--     test_case_id VARCHAR(36) PRIMARY KEY,
--     question_id INT,
--     test_question VARCHAR(100),
--     test_answer VARCHAR(100),
--     FOREIGN KEY (question_id) REFERENCES questions(question_id)
-- );

CREATE TABLE participants (
    participant_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    email VARCHAR(50),
    test_id INT, 
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
                                                    
-- questions table for specific tests
    CREATE TABLE test_questions (
        test_id INT,
        question_id INT,
        PRIMARY KEY (test_id, question_id),
        FOREIGN KEY (test_id) REFERENCES tests(test_id),
        FOREIGN KEY (question_id) REFERENCES questions(question_id)
    );

-- 
CREATE TABLE test_cases (
    test_case_id VARCHAR(36) PRIMARY KEY,
    question_id INT,
    input VARCHAR(255),
    expected_output VARCHAR(255),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);


-- sample inputs for test cases
-- Question 1 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('1', 1, '5', '120'),
    ('2', 1, '0', '1'),
    ('3', 1, '10', '3628800');

-- Question 2 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('4', 2, '"racecar"', 'true'),
    ('5', 2, '"hello"', 'false'),
    ('6', 2, '"level"', 'true');

-- Question 3 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('7', 3, '12345', '54321'),
    ('8', 3, '987654', '456789'),
    ('9', 3, '123456789', '987654321');

-- Question 4 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('10', 4, '7', '13'),
    ('11', 4, '20', '42'),
    ('12', 4, '50', '110');

-- Question 5 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('13', 5, '[3, 5, 1, 8, 4]', '17'),
    ('14', 5, '[1, 2, 3, 4, 5]', '10'),
    ('15', 5, '[10, 20, 30, 40, 50]', '150');

-- Question 6 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('16', 6, '5', '15'),
    ('17', 6, '10', '55'),
    ('18', 6, '20', '210');

-- Question 7 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('19', 7, '"listen", "silent"', 'true'),
    ('20', 7, '"hello", "world"', 'false'),
    ('21', 7, '"race", "care"', 'true');

-- Question 8 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('22', 8, '24, 36', '72'),
    ('23', 8, '12, 8', '24'),
    ('24', 8, '100, 200', '200');

-- Question 9 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('25', 9, '[5, 2, 7, 1, 9]', '2'),
    ('26', 9, '[10, 20, 30, 40, 50]', '10'),
    ('27', 9, '[100, 200, 300, 400, 500]', '100');

-- Question 10 Test Cases
INSERT INTO test_cases (test_case_id, question_id, input, expected_output)
VALUES
    ('28', 10, '[5, 2, 7, 1, 9]', '3'),
    ('29', 10, '[10, 20, 30, 40, 50]', '10'),
    ('30', 10, '[100, 200, 300, 400, 500]', '100');





