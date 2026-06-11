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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[550px]">
      
  {/* LEFT PANE: Embedded YouTube Lecture Video Player */}
  <div className="lg:col-span-7 bg-[#0f0f17] rounded-xl overflow-hidden shadow-xl flex items-center justify-center border border-slate-800/80">
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
  <div className="lg:col-span-5 flex flex-col bg-[#0f0f17] border border-slate-800 rounded-xl shadow-xl overflow-hidden h-full">
    
    {/* Chat Workspace Header */}
    <div className="border-b border-slate-800/60 px-4 py-3.5 flex items-center justify-between bg-[#14141f]">
      <div>
        <h3 className="font-semibold text-zinc-100 text-sm tracking-wide">Active Video AI Assistant</h3>
        <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Connected to ChromaDB Context Index
        </p>
      </div>
    </div>

    {/* Messaging Logs Screen */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090d]">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-md ${
              msg.sender === 'user'
                ? 'bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-br-md shadow-purple-900/20'
                : 'bg-[#23232c] text-zinc-200 border border-slate-800 rounded-bl-md'
            }`}
          >
            {/* Fallback to typing placeholder if message block is strictly rendering first chunk */}
            {msg.text === '' && isTyping && i === messages.length - 1 ? (
              <div className="flex space-x-1.5 py-1 px-2 items-center justify-center">
                <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></div>
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
    <div className="p-3 border-t border-slate-800/80 bg-[#14141f]">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-[#09090d] border border-slate-800 px-4 py-2.5 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition duration-150"
          placeholder="Ask a question about this segment..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
          disabled={isTyping}
        />
        <button
          onClick={handleSendChat}
          disabled={isTyping || !query.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition duration-150 shadow-sm flex items-center justify-center"
        >
          Send
        </button>
      </div>
    </div>

  </div>
</div>
  );
}