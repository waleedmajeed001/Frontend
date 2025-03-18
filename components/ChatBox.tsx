"use client"

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatSidebar from "./ChatSidebar";
import UserProfile from './UserProfile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

interface SharedContext {
  lastUpdated: number;
  data: Record<string, any>;
}

interface UserProfileData {
  name: string;
  age: string;
  hobbies: string;
  additionalInfo: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-addyvd6th-waleed-majeeds-projects.vercel.app';

const WelcomeScreen = ({ onNewChat, isAnimating }: { onNewChat: () => void; isAnimating: boolean }) => {
  return (
    <div className={`flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50 transition-all duration-500 ${
      isAnimating ? 'animate-welcome-in' : ''
    }`}>
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero Icon */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-12">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to AI Chat</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Start a conversation with our AI assistant. Ask questions, get help, or just chat!
          </p>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            {
              icon: "💡",
              title: "Get Creative",
              description: "Ask me to help you brainstorm ideas or solve problems"
            },
            {
              icon: "📚",
              title: "Learn Something",
              description: "Ask me about any topic you're interested in"
            },
            {
              icon: "🤝",
              title: "Get Help",
              description: "Ask me for assistance with tasks or questions"
            },
            {
              icon: "💬",
              title: "Just Chat",
              description: "Have a friendly conversation about anything"
            }
          ].map((item, index) => (
            <button
              key={index}
              onClick={onNewChat}
              className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div>
          <button
            onClick={onNewChat}
            className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start New Chat
          </button>
        </div>

        {/* Features List */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Smart Responses
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24/7 Available
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure & Private
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatBox = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatSessions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [sharedContext, setSharedContext] = useState<SharedContext>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sharedContext');
      return saved ? JSON.parse(saved) : { lastUpdated: Date.now(), data: {} };
    }
    return { lastUpdated: Date.now(), data: {} };
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const baseDelay = 8000; // 8 seconds
  const [waitTimeLeft, setWaitTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (waitTimeLeft > 0) {
      timer = setInterval(() => {
        setWaitTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [waitTimeLeft]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle hydration and page refresh
  useEffect(() => {
    setIsClient(true);
    setShowWelcome(true); // Show welcome screen on every refresh
    
    const savedSessions = localStorage.getItem('chatSessions');
    const savedContext = localStorage.getItem('sharedContext');
    
    if (savedSessions) {
      const loadedSessions = JSON.parse(savedSessions);
      setSessions(loadedSessions);
    }
    
    if (savedContext) {
      setSharedContext(JSON.parse(savedContext));
    }
  }, []);

  // Save sessions and context to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('sharedContext', JSON.stringify(sharedContext));
  }, [sharedContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions]);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      timestamp: Date.now(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowWelcome(false);
    setInput("");
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const updatedSessions = prev.filter(session => session.id !== sessionId);
      if (updatedSessions.length === 0) {
        // If no sessions left, show welcome screen
        setShowWelcome(true);
        setActiveSessionId("");
      } else if (activeSessionId === sessionId) {
        // If deleted active session and there are other sessions, select the first one
        setActiveSessionId(updatedSessions[0].id);
      }
      return updatedSessions;
    });
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "")
        };
      }
      return session;
    }));
  };

  const handleProfileSave = (data: UserProfileData) => {
    setUserProfile(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
  };

  const attemptRequest = async (retryCount: number = 0): Promise<string> => {
    try {
      // Get current session's messages for history
      const currentSession = sessions.find(s => s.id === activeSessionId);
      const history = currentSession?.messages || [];

      // Prepare request payload
      const payload = {
        message: input,
        history: history,
        userProfile: userProfile ? {
          name: userProfile.name,
          age: userProfile.age,
          hobbies: userProfile.hobbies,
          additionalInfo: userProfile.additionalInfo
        } : null
      };

      // Check internet connectivity first
      try {
        await fetch('https://www.google.com/favicon.ico', {
          mode: 'no-cors',
          cache: 'no-store'
        });
      } catch (e) {
        return 'Please check your internet connection and try again.';
      }

      try {
        console.log('Attempting to connect to:', API_URL); // Debug log
        
        // First, try to check if the backend is accessible
        try {
          const healthCheck = await axios.get(API_URL, {
            timeout: 5000,
            headers: {
              'Accept': 'application/json'
            }
          });
          console.log('Backend health check:', healthCheck.status);
        } catch (healthError) {
          console.error('Backend health check failed:', healthError);
          return 'The chat service is not accessible. Please make sure the backend is running.';
        }

        // If health check passes, proceed with the chat request
        const payload = {
          message: input,
          history: history,
          userProfile: userProfile ? {
            name: userProfile.name,
            age: userProfile.age,
            hobbies: userProfile.hobbies,
            additionalInfo: userProfile.additionalInfo
          } : null
        };

        console.log('Sending chat request with payload:', payload);

        const response = await axios.post(`${API_URL}/chat`, payload, {
          timeout: 60000, // 60 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });

        console.log('Chat response received:', {
          status: response.status,
          data: response.data
        });

        if (response.status === 200 && response.data) {
          return response.data.reply || response.data;
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Invalid response from chat service');
        }

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
          });

          if (error.code === 'ECONNABORTED') {
            return 'Request timed out. The server took too long to respond. Please try again.';
          }
          if (error.response) {
            if (error.response.status === 404) {
              return 'Chat endpoint not found. Please verify the backend URL and endpoints are correct.';
            }
            if (error.response.status === 500) {
              return 'The chat service encountered an error. Please try again later.';
            }
            return `Error: ${error.response.data?.detail || error.response.data || 'The chat service returned an error.'}`;
          } else if (error.request) {
            return 'Unable to reach the chat service. Please check if the backend server is running and accessible.';
          }
        }
        // Handle non-Axios errors
        console.error('Unexpected error:', error);
        return 'An unexpected error occurred. Please try again.';
      }
    } catch (error: any) {
      // Handle network errors first
      if (!error.response || error.code === 'ECONNABORTED') {
        if (retryCount < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptRequest(retryCount + 1);
        }
        return 'Unable to connect to the chat service. Please check your internet connection and try again.';
      }

      // Handle rate limit errors (both direct and nested)
      const isRateLimit = 
        error?.response?.status === 429 ||
        (error?.response?.status === 500 && 
         error?.response?.data?.detail?.includes('429: Resource has been exhausted'));

      if (isRateLimit) {
        if (retryCount < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptRequest(retryCount + 1);
        }
        const waitTime = Math.ceil(baseDelay / 1000);
        setWaitTimeLeft(waitTime);
        return `⏳ Please wait ${waitTime} seconds before sending another message. The AI service is currently busy. This helps ensure everyone gets a fair chance to use the service.`;
      }

      // Handle specific HTTP status codes
      const errorMessages: Record<number, string> = {
        400: 'Invalid request. Please try rephrasing your message.',
        401: 'Authentication failed. Please refresh the page and try again.',
        403: 'Access denied. Please check your permissions.',
        404: 'Chat service not found. Please make sure the server is running.',
        422: 'Invalid message format. Please try again.',
        500: error?.response?.data?.detail || 'Server error. Please try again later.'
      };

      if (error?.response?.status && errorMessages[error.response.status]) {
        return errorMessages[error.response.status];
      }

      // Default error message
      return error?.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage: Message = { 
      role: 'user',
      content: userMessage 
    };
    
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return { 
          ...session, 
          messages: [...session.messages, newUserMessage] 
        };
      }
      return session;
    }));

    try {
      const response = await attemptRequest();
      
      // Add AI response
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          // Only filter out temporary error messages
          const filteredMessages = session.messages.filter(m => 
            !m.content.startsWith('Error:') && 
            !m.content.includes('rate limit') &&
            !m.content.includes('AI service is busy')
          );
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: response
          };

          // Update session title if this is the first user message
          const isFirstMessage = filteredMessages.length === 1;
          if (isFirstMessage) {
            const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "");
            return {
              ...session,
              title: title,
              messages: [...filteredMessages, assistantMessage]
            };
          }

          return {
            ...session,
            messages: [...filteredMessages, assistantMessage]
          };
        }
        return session;
      }));

      // Save to localStorage
      const updatedSession = sessions.find(s => s.id === activeSessionId);
      if (updatedSession) {
        localStorage.setItem(`chatSession_${activeSessionId}`, JSON.stringify(updatedSession));
      }

    } catch (error: any) {
      // Add error message to chat
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          const errorMessage: Message = {
            role: 'assistant',
            content: error?.message || 'Failed to send message. Please try again.'
          };
          return {
            ...session,
            messages: [...session.messages, errorMessage]
          };
        }
        return session;
      }));

    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Modified session selection handler
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowWelcome(false); // Hide welcome screen when selecting a session
  };

  // Handle welcome screen transition
  const handleShowWelcome = () => {
    setIsAnimating(true);
    // Start exit animation for chat interface
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.classList.add('animate-chat-out');
    }
    // Wait for animation to complete before showing welcome screen
    setTimeout(() => {
      setShowWelcome(true);
    }, 300);
  };

  if (!isClient) {
  return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Show sidebar only if there are sessions */}
      {sessions.length > 0 && (
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={createNewChat}
          onDeleteSession={deleteSession}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}
      
      <main className={`h-screen transition-all duration-500 ease-in-out ${
        sessions.length > 0 ? (isSidebarCollapsed ? 'ml-20' : 'ml-80') : ''
      }`}>
        {showWelcome || sessions.length === 0 ? (
          <WelcomeScreen onNewChat={createNewChat} isAnimating={isAnimating} />
        ) : (
          <div id="chat-container" className="flex flex-col h-full animate-chat-in">
            {/* Header with subtle gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {activeSession?.title || "New Chat"}
                </h1>
                {userProfile && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 cursor-pointer transition-all"
                       onClick={() => setIsProfileOpen(true)}
                       title="Click to edit profile">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{userProfile.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleShowWelcome}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Back to Welcome</span>
                </button>
              </div>
            </div>

            {/* Chat messages container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700">Start the Conversation</h2>
                    <p className="text-gray-500">Type your first message below to begin chatting</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : msg.content.includes('⏳') // Check for rate limit message
                            ? 'bg-yellow-50 border border-yellow-200'
                            : msg.content.startsWith('Error:') || msg.content.includes('failed')
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50 border border-gray-100'
                      }`}>
                        <div className={`text-sm font-medium mb-1 ${
                          msg.role === 'user' 
                            ? 'text-blue-100' 
                            : msg.content.includes('⏳')
                              ? 'text-yellow-600'
                              : msg.content.startsWith('Error:') || msg.content.includes('failed')
                                ? 'text-red-600'
                                : 'text-gray-500'
                        }`}>
                          {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </div>
                        <div className={`whitespace-pre-wrap ${
                          msg.role === 'user' 
                            ? 'text-white' 
                            : msg.content.includes('⏳')
                              ? 'text-yellow-700'
                              : msg.content.startsWith('Error:') || msg.content.includes('failed')
                                ? 'text-red-700'
                                : 'text-gray-800'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with modern design */}
            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-6">
              <div className={`mx-auto flex gap-4 items-center transition-all duration-500 ${
                isSidebarCollapsed ? 'max-w-5xl px-4' : 'max-w-4xl'
              }`}>
                {!userProfile && (
                  <div className="absolute -top-10 left-0 right-0 bg-blue-50 text-blue-600 py-2 px-4 text-center text-sm">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="inline-flex items-center gap-2 underline hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Set up your profile
                    </button>
                    {" "}to get personalized responses and a better chat experience
                  </div>
                )}
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={waitTimeLeft > 0 ? `Please wait ${waitTimeLeft} seconds...` : "Type your message..."}
                    disabled={isLoading || waitTimeLeft > 0}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {waitTimeLeft > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-600">
                      ⏳ {waitTimeLeft}s
                    </div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim() || waitTimeLeft > 0}
                  className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleProfileSave}
      />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes chat-out {
          from { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
        }
        
        @keyframes chat-in {
          from { 
            opacity: 0;
            transform: scale(1.05) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes welcome-in {
          0% { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-chat-out {
          animation: chat-out 0.3s ease-out forwards;
        }
        
        .animate-chat-in {
          animation: chat-in 0.5s ease-out forwards;
        }
        
        .animate-welcome-in {
          animation: welcome-in 0.5s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
