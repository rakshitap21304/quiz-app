// App.js
import React, { useState, useEffect } from 'react';
import SubjectSelector from './SubjectSelector';
import TopicSelector from './TopicSelector';
import QuestionDisplay from './QuestionDisplay';
import ScoreDisplay from './ScoreDisplay';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Fetch subjects from the database
  const fetchSubjects = async () => {
    // Replace with actual endpoint for fetching subjects
    const response = await fetch('/ords/api/subjects');
    setSubjects(response.data);
  };

  // Fetch topics based on the selected subject
  const fetchTopics = async (subjectId) => {
    // Replace with actual endpoint for fetching topics
    const response = await fetch(`/ords/api/topics?subjectId=${subjectId}`);
    setTopics(response.data);
  };

  // Fetch questions based on the selected topic
  const fetchQuestions = async (topicId) => {
    // Replace with actual endpoint for fetching questions
    const response = await fetch(`/ords/api/questions?topicId=${topicId}`);
    setQuestions(response.data);
  };

  // Use useEffect to fetch subjects when the component mounts
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    // Fetch topics based on the selected subject
    fetchTopics(subject.id);
  };

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    // Fetch questions based on the selected topic
    fetchQuestions(topic.id);
  };

  // Handle user answer selection
  const handleAnswerSelect = (answerId) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentQuestionIndex].id]: answerId,
    });
  };

  // Handle next question or calculate the score
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  // Calculate the score based on user answers
  const calculateScore = () => {
    // Replace with logic to calculate the score
    // This is a simplified example, adjust based on your scoring logic
    const correctAnswers = questions.filter(
      (question) =>
        question.correct_option_id === userAnswers[question.id]
    );
    const userScore = (correctAnswers.length / questions.length) * 100;
    setScore(userScore);
  };

  return (
    <div className="app-container">
      <h1>Quiz App</h1>
      <SubjectSelector subjects={subjects} onSelect={handleSubjectSelect} />
      {selectedSubject && (
        <TopicSelector topics={topics} onSelect={handleTopicSelect} />
      )}
      {selectedTopic && questions.length > 0 && (
        <>
          <QuestionDisplay
            question={questions[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />
          <button onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1
              ? 'Next Question'
              : 'Finish Quiz'}
          </button>
        </>
      )}
      {score !== null && <ScoreDisplay score={score} />}
    </div>
  );
}

export default App;
