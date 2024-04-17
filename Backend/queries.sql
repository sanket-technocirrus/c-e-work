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

-- questions table for specific tests
CREATE TABLE test_questions (
    test_id INT,
    question_id INT,
    PRIMARY KEY (test_id, question_id),
    FOREIGN KEY (test_id) REFERENCES tests(test_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);




