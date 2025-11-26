import { useState, useRef, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: inputValue
      })

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.message,
        queryIntent: response.data.queryIntent,
        pdfAvailable: response.data.pdfAvailable,
        pdfDownloadUrl: response.data.pdfDownloadUrl,
        agentsUsed: response.data.agentsUsed,
        originalMessage: inputValue,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `Error: ${error.response?.data?.error || error.message || 'Failed to get response'}`,
        isError: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/pdf`, {
        message: message.originalMessage
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sales-${message.queryIntent}-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF')
    }
  }

  return (
    <div className="app">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="header-title">
              <div className="ai-icon">🤖</div>
              <h1>Multi-AI Agent Assistant</h1>
            </div>
            <div className="header-subtitle">
              Sales • Reports • Analytics
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">👋</div>
              <h2>Welcome to Multi-AI Agent Assistant!</h2>
              <p>Ask me about sales data, reports, or summaries</p>
              <div className="example-queries">
                <div className="example-query">💼 "What were the sales in October?"</div>
                <div className="example-query">📊 "Give me the October report"</div>
                <div className="example-query">📝 "Summarize October sales"</div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}-message`}>
              <div className="message-avatar">
                {message.type === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.text}
                </div>
                {message.type === 'bot' && !message.isError && (
                  <div className="message-metadata">
                    {message.agentsUsed && (
                      <div className="agents-badge">
                        {message.agentsUsed.map(agent => (
                          <span key={agent} className="agent-tag">{agent}</span>
                        ))}
                      </div>
                    )}
                    {message.pdfAvailable && (
                      <button
                        className="pdf-download-btn"
                        onClick={() => handleDownloadPDF(message)}
                      >
                        <span className="pdf-icon">📄</span>
                        Download PDF
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-container">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about sales, reports, or summaries..."
              className="message-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2 10L18 2L11 18L9 11L2 10Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App