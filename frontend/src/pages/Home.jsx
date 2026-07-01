import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MODES = ["JavaScript", "React", "Node.js", "MongoDB", "HR"];
const TYPE_SPEED_MS = 12; // ms per character for the typing animation

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewType, setInterviewType] = useState("JavaScript");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Typing animation state: the AI text currently being revealed char-by-char
  const [typingText, setTypingText] = useState(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typingText]);

  // Clean up any running typing interval on unmount
  useEffect(() => {
    return () => clearInterval(typingIntervalRef.current);
  }, []);

  // Reveals fullText into the chat one character at a time, then commits
  // it as a normal message once done.
  const playTypingAnimation = (fullText) => {
    clearInterval(typingIntervalRef.current);
    typingIndexRef.current = 0;
    setTypingText("");

    typingIntervalRef.current = setInterval(() => {
      typingIndexRef.current += 1;
      const next = fullText.slice(0, typingIndexRef.current);
      setTypingText(next);

      if (typingIndexRef.current >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setTypingText(null);
        setMessages((prev) => [...prev, { sender: "ai", text: fullText }]);
      }
    }, TYPE_SPEED_MS);
  };

  const startInterview = async () => {
    try {
      setLoading(true);
      setFinished(false);
      setReport(null);
      setMessages([]);

      const response = await axios.post("https://ai-interview-coach-backend-iiyt.onrender.com/start", {
        interviewType,
      });

      setStarted(true);
      setLoading(false);
      playTypingAnimation(response.data.reply);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const updatedHistory = [...messages, { sender: "user", text: message }];
    setMessages(updatedHistory);
    setMessage("");

    try {
      setLoading(true);

      const response = await axios.post("https://ai-interview-coach-backend-iiyt.onrender.com/chat", {
        history: updatedHistory,
        interviewType,
      });

      setLoading(false);
      playTypingAnimation(response.data.reply);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const userAnswerCount = messages.filter((m) => m.sender === "user").length;

  const endInterview = async () => {
    if (userAnswerCount === 0) {
      alert("Answer at least one question before ending the interview.");
      return;
    }
    try {
      setLoading(true);

      const response = await axios.post("https://ai-interview-coach-backend-iiyt.onrender.com/end", {
        history: messages,
        interviewType,
      });

      setLoading(false);
      setFinished(true);
      setReport(response.data.reply);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setReport(null);
    setMessages([]);
    setMessage("");
  };

  const handleError = (error) => {
    console.error(error);
    if (error.response) {
      alert(error.response.data.error);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
  <h1 className="title">AI Interview Coach</h1>

  <p className="subtitle">
    Practice for Web Development Interviews
  </p>

  <div
    style={{
      marginTop: "15px",
      display: "flex",
      gap: "10px",
      justifyContent: "center",
    }}
  >
    {user ? (
      <>
        <div className="user-info">
          <span><h3>👋 Welcome, {user.name}</h3></span>

          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </>
    ) : (
      <>
        <button className="logout-btn" onClick={() => navigate("/login")}>
          Login
        </button>

        <button className="logout-btn" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </>
    )}
  </div>
</header>

      <div className="mode-container">
        {MODES.map((mode) => (
          <button
            key={mode}
            className={`mode-button ${interviewType === mode ? "active" : ""}`}
            onClick={() => setInterviewType(mode)}
            disabled={started && !finished}
          >
            {mode === "HR" ? "HR Round" : mode}
          </button>
        ))}
      </div>

      {!started && !finished && (
        <div className="start-screen">
          <p className="start-text">
            Selected round: <span className="start-mode">{interviewType}</span>
          </p>
          <button className="primary-button" onClick={startInterview} disabled={loading}>
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      )}

      {(started || finished) && (
        <>
          <div className="chat-container">
            {messages.map((msg, index) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={index} className={`message-row ${isAi ? "ai-row" : "user-row"}`}>
                  {isAi && <div className="avatar ai-avatar">AI</div>}
                  <div className={`message-bubble ${isAi ? "ai-bubble" : "user-bubble"}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {!isAi && <div className="avatar user-avatar">{user.name.charAt(0)}</div>}
                </div>
              );
            })}

            {typingText !== null && (
              <div className="message-row ai-row">
                <div className="avatar ai-avatar">AI</div>
                <div className="message-bubble ai-bubble">
                  <ReactMarkdown>{typingText}</ReactMarkdown>
                  <span className="type-cursor">▍</span>
                </div>
              </div>
            )}

            {loading && typingText === null && (
              <div className="message-row ai-row">
                <div className="avatar ai-avatar">AI</div>
                <div className="message-bubble ai-bubble thinking">
                  <span className="typing-dots">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}

            {finished && report && (
              <div className="report-card">
                <h3 className="report-title">Final Score Report</h3>
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {!finished ? (
            <div className="input-container">
              <input
                type="text"
                placeholder="Type your answer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading}>
                Send
              </button>
              <button className="end-button" onClick={endInterview} disabled={loading || userAnswerCount === 0}>
                End Interview
              </button>
            </div>
          ) : (
            <div className="input-container">
              <button className="primary-button full-width" onClick={restart}>
                Start a New Interview
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;