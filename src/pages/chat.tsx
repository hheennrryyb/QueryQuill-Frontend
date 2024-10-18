import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, Copy, ArrowLeft, UserRound, Info, X , Loader} from "lucide-react"
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
      <Bot size={24} className="text-white" />
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
  const [context, setContext] = useState<string>('');
  const [contextVisible, setContextVisible] = useState<boolean>(false);
  const [isContextLoading, setIsContextLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId).then(setProjectDetails);
    }
  }, [projectId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setContextVisible(false);
      }
    };

    if (contextVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextVisible]);

  const handleGetContext = async (query: string, projectId: string, userMessage: string) => {
    setContextVisible(true);
    setIsContextLoading(true);
    const context = await chatbot.getRelevantContext(query, projectId);
    setContext("The following context for the query '" + userMessage + "' was found: \n\n" + context);
    setIsContextLoading(false);
  }

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
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex flex-row justify-between items-center">
          <button
            onClick={() => navigate(`/file-explorer/${projectId}`)}
            className="flex items-center border border-gray-300 rounded-md p-2 bg-white transition-colors text-sm"
          >
            <ArrowLeft size={16} className="" /> <span className="ml-2 hidden sm:inline">File Explorer</span>
          </button>
          <div className="pl-4 text-right mr-1 flex flex-col items-end self-end">
            <h2 className="text-xl font-bold text-gray-900">{projectDetails?.name}</h2>
            <p className="text-sm text-gray-500">Last Updated: {new Date(projectDetails?.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-grow overflow-hidden p-2 sm:p-4">
            <ScrollArea>
              {messages.map((message) => (
                <div key={message.id} className={`flex mt-6 items-start mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2 ">
                      <Bot size={24} className="text-white"/>
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] text-white ${message.sender === 'user' ? 'bg-white text-black' : 'bg-secondary'}`}>
                    {message.sender === 'bot' ? (
                      <div className="flex flex-col w-full">
                      <ReactMarkdown 
                      className="prose dark:prose-invert "
                      remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                      rehypePlugins={[rehypeKatex, rehypeHighlight]}
                      components={{
                        ul: ({node, ...props}) => <ul className="list-disc ml-5" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-5" {...props} />,
                        li: ({node, ...props}) => <li className="my-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        code({ inline, className, children, ...props }: React.ComponentProps<'code'> & { inline?: boolean }) {
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
                      <div className="flex flex-col w-full">
                        <p className="text-black">{message.text}</p>
                        <button className="text-muted-foreground p-[5px] m-0 w-fit self-end mt-2 bg-gray-200 rounded-md" onClick={() => {handleGetContext(message.text, projectId ?? '', message.text)}}>
                        <Info className="h-4 w-4" />
                      </button>
                      </div>
                    )}
                    
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ml-2">
                      <UserRound />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
            </ScrollArea>
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-t-[1.5rem]">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                className="flex-grow px-4 py-2 rounded-full bg-white text-black border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="p-2 rounded-full bg-secondary text-white hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {contextVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col relative"
          >
            <button 
              className="absolute bg-white bg-opacity-50 top-2 right-2 text-black border-[2px] border-gray-200 rounded-md p-2 hover:text-gray-700 focus:outline-none"
              onClick={() => setContextVisible(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6 overflow-y-auto flex-grow pt-12">
              {isContextLoading ? (
                <div className="text-center flex flex-col items-center justify-center h-full">
                  <Loader size={24} className="text-black animate-spin mb-4" />
                  <h3 className="text-lg">Your Context for the Query is Loading...</h3>
                </div>
              ) : (
                <ReactMarkdown 
                  className="prose max-w-none dark:prose-invert"
                  remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight]}
                  components={{
                    ul: ({node, ...props}) => <ul className="list-disc ml-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  }}
                >
                  {context}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}