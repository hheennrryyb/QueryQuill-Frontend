import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, Copy, ArrowLeft } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import ChatbotAPI from '../lib/chatbot.ts'; // Renamed import
import { useParams } from 'react-router-dom';
import { getProjectDetails } from '../lib/actions';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';

import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';


type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

const ScrollArea = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  })

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto pr-4">
      {children}
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground mr-2">
      Bot
    </div>
    <div className="flex space-x-2">
      <div className="w-3 h-3 rounded-full bg-secondary animate-bounce"></div>
      <div className="w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
)

export default function Chat() { // Renamed from Chatbot to Chat
  const { projectId } = useParams<{ projectId: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hi there! I'm **Query Quill**, your AI assistant. 📚✨ \n\n
With access to all the documents in your project, I'm here to help you find the information you need quickly. Whether you have a question, need a summary, or want to brainstorm ideas, I'm ready to assist you.
\n\n Feel free to ask me anything related to your project, and I'll do my best to provide accurate and helpful information.
\n\n So, how can I help you today? Let's get started! 😊`, sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatbot] = useState(() => new ChatbotAPI());
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId).then(setProjectDetails);
    }
  }, [projectId]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const botReply = await chatbot.sendMessage(input, projectId ?? '');
        setIsTyping(false);
        setMessages(prev => [...prev, { id: prev.length + 1, text: botReply, sender: 'bot' }]);
      } catch (error) {
        console.error('Error getting bot response:', error);
        setIsTyping(false);
        setMessages(prev => [...prev, { id: prev.length + 1, text: "Sorry, I couldn't process your request.", sender: 'bot' }]);
      }
    }
  }

  return (
    <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl mx-auto h-full flex flex-col ">
      <div onClick={() => {
        navigate(`/file-explorer/${projectId}`);
      }} className="text-muted-foreground p-2 m-0 w-fit self-start flex items-center gap-2 cursor-pointer"> <ArrowLeft size={16} /> Back to File Explorer </div>
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">Chatbot</h2>
        <p>Project Name: {projectDetails?.name}</p>
        <p>Last Updated: { new Date(projectDetails?.updated_at).toLocaleString()}</p>
      </div>
      <div className="p-4 flex-grow overflow-hidden">
        <ScrollArea>
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2 ">
                  <Bot size={24} />
                </div>
              )}
              <div className={`rounded-lg p-3 max-w-[80%] text-white ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary'}`}>
                {message.sender === 'bot' ? (
                  <div className="flex flex-col w-full">
                  <ReactMarkdown 
                  className="prose dark:prose-invert "
                  remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight]}
                  components={{
                    ul: ({node, ...props}) => <ul className="list-disc pl-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className={`language-${match[1]} p-2 rounded-md text-wrap`}>
                          <code className={`language-${match[1]}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                  >{message.text}</ReactMarkdown>
                  {message.id !== 1 && (
                  <button className="text-muted-foreground p-2 m-0 w-fit self-end" onClick={() => {
                      navigator.clipboard.writeText(message.text);
                    toast.success('Copied to clipboard');
                  }}>
                    <Copy className="h-4 w-4" />
                  </button>
                  )}
                  </div>
                ) : (
                  message.text
                )}
                
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ml-2">
                  You
                </div>
              )}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollArea>
      </div>
      <div className="p-4 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}