import React, { useState, useRef, useEffect } from 'react';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello, FTC programmer! I'm your AI robotics assistant. Paste your Java OpMode, ask questions about PedroPathing, or describe a mechanical issue, and I'll help you debug or write the code.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI Response (You can connect this to OpenAI/Anthropic API endpoint)
    setTimeout(() => {
      let botReply = "I've analyzed your request. Make sure your hardware map initialization matches your configuration file in FTC Dashboard. ";
      
      if (userMsg.toLowerCase().includes('path') || userMsg.toLowerCase().includes('pedro')) {
        botReply = "When working with PedroPathing, ensure your follower is updated inside your `update()` loop in your TeleOp or Autonomous OpMode by calling `follower.update();`.";
      } else if (userMsg.toLowerCase().includes('servo') || userMsg.toLowerCase().includes('motor')) {
        botReply = "Double-check your motor direction settings (`DcMotorSimple.Direction.REVERSE`) if your robot is spinning in place during autonomous navigation.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 text-slate-100 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-4 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-400">FTC AI Code Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Get instant debugging, Java syntax help, and strategy advice.</p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-4 mb-4 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-yellow-400 text-slate-950 font-medium rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 text-sm animate-pulse">
              AI is analyzing your robot code...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about Java OpModes, PedroPathing, or debugging..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-6 py-3 rounded-xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}