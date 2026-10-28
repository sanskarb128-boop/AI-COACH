import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const MODES = [
  { name: "JavaScript", icon: "JS", detail: "Language fundamentals" },
  { name: "React", icon: "R", detail: "Components & hooks" },
  { name: "Node.js", icon: "N", detail: "Backend development" },
  { name: "MongoDB", icon: "DB", detail: "Data & queries" },
  { name: "HR", icon: "HR", detail: "Behavioral questions" },
];
const TYPE_SPEED_MS = 12;
const API_BASE = "https://ai-interview-coach-backend-iiyt.onrender.com";

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
  const [typingText, setTypingText] = useState(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, typingText, report]);

  useEffect(() => () => clearInterval(typingIntervalRef.current), []);

  const playTypingAnimation = (fullText) => {
    clearInterval(typingIntervalRef.current);
    typingIndexRef.current = 0;
    setTypingText("");
    typingIntervalRef.current = setInterval(() => {
      typingIndexRef.current += 1;
      setTypingText(fullText.slice(0, typingIndexRef.current));
      if (typingIndexRef.current >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setTypingText(null);
        setMessages((prev) => [...prev, { sender: "ai", text: fullText }]);
      }
    }, TYPE_SPEED_MS);
  };

  const handleError = (error) => {
    console.error(error);
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong. Please try again.";
    alert(typeof message === "string" ? message : "The request failed. Please try again.");
  };

  const startInterview = async () => {
    try {
      setLoading(true);
      setFinished(false);
      setReport(null);
      setMessages([]);
      const response = await axios.post(`${API_BASE}/start`, { interviewType });
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
    const answer = message.trim();
    const updatedHistory = [...messages, { sender: "user", text: answer }];
    setMessages(updatedHistory);
    setMessage("");
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/chat`, {
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
      const response = await axios.post(`${API_BASE}/end`, {
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
    clearInterval(typingIntervalRef.current);
    setStarted(false);
    setFinished(false);
    setReport(null);
    setMessages([]);
    setMessage("");
    setTypingText(null);
  };

  const selectedMode = MODES.find((mode) => mode.name === interviewType) || MODES[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={() => { if (started || finished) restart(); }} aria-label="AI Interview Coach home">
          <span className="brand-mark">ai<span>.</span></span>
          <span className="brand-name">interview coach</span>
        </button>
        <div className="topbar-right">
          <ThemeToggle />
          <div className="status-pill"><span className="status-dot" /> AI practice studio</div>
          {user ? (
            <div className="account-menu">
              <div className="user-avatar-small">{user.name?.charAt(0)?.toUpperCase() || "U"}</div>
              <span className="account-name">{user.name}</span>
              <button className="text-button" onClick={logout}>Sign out</button>
            </div>
          ) : (
            <div className="account-actions">
              <button className="text-button" onClick={() => navigate("/login")}>Log in</button>
              <button className="small-primary-button" onClick={() => navigate("/signup")}>Create account <span aria-hidden="true">↗</span></button>
            </div>
          )}
        </div>
      </header>

      {!started && !finished ? (
        <section className="landing-content">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-icon">✳</span> YOUR NEXT OPPORTUNITY STARTS HERE</div>
            <h1>Show up ready.<br /><span>Stand out.</span></h1>
            <p className="hero-description">Build confidence, sharpen your answers, and practice real interview scenarios with your personal AI coach.</p>
            <div className="hero-proof">
              <div className="proof-avatars"><span>S</span><span>A</span><span>+</span></div>
              <span><strong>Practice at your pace.</strong><br />Get better with every answer.</span>
            </div>
          </div>

          <section className="setup-card" aria-labelledby="setup-title">
            <div className="card-heading-row">
              <div>
                <div className="section-kicker">LET'S GET STARTED</div>
                <h2 id="setup-title">Choose your interview</h2>
                <p className="card-description">Pick a focus area to personalize your session.</p>
              </div>
              <div className="setup-step">01 <span>/ 01</span></div>
            </div>
            <div className="mode-grid">
              {MODES.map((mode) => (
                <button
                  key={mode.name}
                  className={`mode-card ${interviewType === mode.name ? "selected" : ""}`}
                  onClick={() => setInterviewType(mode.name)}
                  disabled={loading}
                  aria-pressed={interviewType === mode.name}
                >
                  <span className={`mode-icon mode-icon-${mode.name.toLowerCase().replace(".", "")}`}>{mode.icon}</span>
                  <span className="mode-copy"><strong>{mode.name === "HR" ? "HR round" : mode.name}</strong><small>{mode.detail}</small></span>
                  <span className="mode-check">{interviewType === mode.name ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <div className="selected-summary">
              <span className="summary-icon">✦</span>
              <span>Selected session <strong>{interviewType === "HR" ? "HR round" : interviewType}</strong></span>
              <span className="summary-time">~ 10–15 min</span>
            </div>
            <button className="primary-button start-button" onClick={startInterview} disabled={loading}>
              <span>{loading ? "Preparing your session…" : "Start practice session"}</span>
              <span className="button-arrow" aria-hidden="true">→</span>
            </button>
            <p className="privacy-note"><span>♧</span> Low pressure. Private practice. Real progress.</p>
          </section>

          <div className="feature-strip">
            <div className="feature-item"><span className="feature-symbol">◎</span><span><strong>Real-time practice</strong><small>Answer one question at a time</small></span></div>
            <div className="feature-item"><span className="feature-symbol">↗</span><span><strong>Useful feedback</strong><small>Understand what to improve</small></span></div>
            <div className="feature-item"><span className="feature-symbol">✧</span><span><strong>Build confidence</strong><small>Practice whenever you need</small></span></div>
          </div>
        </section>
      ) : (
        <section className="interview-workspace">
          <div className="workspace-heading">
            <div>
              <button className="back-link" onClick={restart}>← Back to setup</button>
              <div className="eyebrow">PRACTICE SESSION</div>
              <h1>{finished ? "Session complete." : `${interviewType === "HR" ? "HR round" : interviewType} interview`}</h1>
              <p>{finished ? "Review your feedback and decide what to practice next." : "Take your time. Think through your answer before sending."}</p>
            </div>
            <div className="session-meta"><span className="live-dot" /> {finished ? "Completed" : "In progress"}<span className="meta-divider" />{userAnswerCount} {userAnswerCount === 1 ? "answer" : "answers"}</div>
          </div>

          <div className="interview-layout">
            <aside className="session-sidebar">
              <div className="sidebar-label">SESSION DETAILS</div>
              <div className="sidebar-topic-icon">{selectedMode.icon}</div>
              <h3>{selectedMode.name === "HR" ? "HR round" : selectedMode.name}</h3>
              <p>{selectedMode.detail}</p>
              <div className="sidebar-divider" />
              <div className="session-stat"><span>Questions answered</span><strong>{userAnswerCount}</strong></div>
              <div className="session-stat"><span>Session status</span><strong className="stat-status">{finished ? "Complete" : "Active"}</strong></div>
              {!finished && <button className="end-session-button" onClick={endInterview} disabled={loading || userAnswerCount === 0}>Finish interview <span>↗</span></button>}
              {finished && <button className="primary-button sidebar-restart" onClick={restart}>New session <span>→</span></button>}
            </aside>

            <div className="chat-panel">
              <div className="chat-panel-header">
                <div className="coach-avatar">✳</div>
                <div><strong>Your AI coach</strong><small><span className="status-dot" /> Here to help you improve</small></div>
                <div className="chat-secure">● Private session</div>
              </div>
              <div className="chat-container">
                {messages.map((msg, index) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div key={index} className={`message-row ${isAi ? "ai-row" : "user-row"}`}>
                      {isAi && <div className="avatar ai-avatar">✳</div>}
                      <div className={`message-content ${isAi ? "ai-content" : "user-content"}`}>
                        <div className="message-label">{isAi ? "AI COACH" : "YOU"}</div>
                        <div className={`message-bubble ${isAi ? "ai-bubble" : "user-bubble"}`}><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                      </div>
                      {!isAi && <div className="avatar user-avatar">{user?.name?.charAt(0)?.toUpperCase() || "Y"}</div>}
                    </div>
                  );
                })}
                {typingText !== null && (
                  <div className="message-row ai-row">
                    <div className="avatar ai-avatar">✳</div>
                    <div className="message-content ai-content"><div className="message-label">AI COACH</div><div className="message-bubble ai-bubble"><ReactMarkdown>{typingText}</ReactMarkdown><span className="type-cursor">▍</span></div></div>
                  </div>
                )}
                {loading && typingText === null && (
                  <div className="message-row ai-row">
                    <div className="avatar ai-avatar">✳</div>
                    <div className="message-content ai-content"><div className="message-label">AI COACH</div><div className="message-bubble ai-bubble thinking"><span className="typing-dots"><span /><span /><span /></span><span className="thinking-label">Thinking through your next question…</span></div></div>
                  </div>
                )}
                {finished && report && (
                  <div className="report-card">
                    <div className="report-card-heading"><span className="report-icon">✦</span><div><div className="section-kicker">YOUR RESULTS</div><h3>Interview feedback</h3></div></div>
                    <ReactMarkdown>{report}</ReactMarkdown>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {!finished ? (
                <div className="chat-input-area">
                  <div className="input-container">
                    <input
                      type="text"
                      aria-label="Your answer"
                      placeholder="Write your answer here…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      disabled={loading}
                    />
                    <button className="send-button" onClick={sendMessage} disabled={loading || !message.trim()} aria-label="Send answer">Send <span>↑</span></button>
                  </div>
                  <div className="input-hint"><span>↵</span> Press Enter to send <span className="hint-separator">·</span> Be specific and use examples when you can</div>
                </div>
              ) : (
                <div className="completed-footer"><span>✦</span> Great work showing up for yourself. Keep practicing.</div>
              )}
            </div>
          </div>
        </section>
      )}
      <footer className="site-footer"><span>© {new Date().getFullYear()} AI Interview Coach</span><span>Practice with purpose <span className="footer-heart">✳</span></span></footer>
    </main>
  );
}

export default Home;
