import { useState, useRef, useEffect } from 'react';

export default function VideoChat({ videoId }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I've fully parsed this lecture. Ask me anything about formulas, core definitions, or specific concepts mentioned in the video!",
      sender: 'bot'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scrolls the chat window to the newest message tokens as they stream in
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendChat = async () => {
    if (!query.trim() || !videoId) return;

    const userMsg = { text: query, sender: 'user' };
    
    // Optimistically add user query, clear input layout, and append an empty bot bubble for streaming
    setMessages((prev) => [...prev, userMsg, { text: '', sender: 'bot' }]);
    setQuery('');
    setIsTyping(true);

    let accruedBotReply = '';

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, question: userMsg.text }),
      });

      if (!response.ok) throw new Error("Network response broke down");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accruedBotReply += textChunk;

        // Target and modify the absolute last element in state (our active bot stream bubble)
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: accruedBotReply, sender: 'bot' };
          return updated;
        });
      }
    } catch (err) {
      console.error("Streaming error breakdown:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          text: "⚠️ Sorry, I ran into an issue connecting to the core server. Please verify your FastAPI setup.", 
          sender: 'bot' 
        };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
      
      {/* LEFT PANE: Embedded YouTube Lecture Video Player */}
      <div className="lg:col-span-7 bg-slate-900 rounded-xl overflow-hidden shadow-md flex items-center justify-center border border-slate-800">
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="StudyBuddy Lecture Viewer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* RIGHT PANE: Contextual Vector Q&A Panel */}
      <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Chat Workspace Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Active Video AI Copilot</h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Connected to ChromaDB Context Index
            </p>
          </div>
        </div>

        {/* Messaging Logs Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-xl max-w-[85%] text-sm shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-200/60 rounded-tl-none'
                }`}
              >
                {/* Fallback to typing placeholder if message block is strictly rendering first chunk */}
                {msg.text === '' && isTyping && i === messages.length - 1 ? (
                  <div className="flex space-x-1 py-1 px-2 items-center justify-center">
                    <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Text Form Submissions Container */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Ask a question about this segment..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              disabled={isTyping}
            />
            <button
              onClick={handleSendChat}
              disabled={isTyping || !query.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 shadow-sm flex items-center justify-center"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}