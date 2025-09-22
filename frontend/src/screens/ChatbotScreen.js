import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatbotScreen.css';

export default function ChatbotScreen() {
  const { askFashionChatbot } = useAuth();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👗 Hi! Ask me anything about fashion, style, or outfits.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setLoading(true);
    const res = await askFashionChatbot(input);
    setMessages(prev => [...prev, { sender: 'bot', text: res.reply }]);
    setLoading(false);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🧑‍💼 Fashion Chatbot</h2>
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chatbot-msg bot">Typing...</div>}
      </div>
      <div className="chatbot-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about fashion..."
          className="chatbot-input"
          disabled={loading}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="chatbot-btn" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}