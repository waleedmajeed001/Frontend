"use client"

import { useState } from 'react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatSidebar = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isCollapsed,
  onToggleCollapse
}: ChatSidebarProps) => {
  return (
    <div className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-lg transition-all duration-500 ease-in-out z-40 flex flex-col ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Header with fixed height */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            isCollapsed ? 'w-12' : 'w-12'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className={`text-xl font-semibold text-gray-800 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            AI Chat
          </h1>
        </div>
        <button
          onClick={onNewChat}
          className={`w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${
            isCollapsed ? 'p-3' : 'px-4 py-3'
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat List with flex scroll */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative mb-1 rounded-xl transition-all duration-200 ${
                activeSessionId === session.id
                  ? 'bg-blue-50 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left transition-colors ${
                  isCollapsed ? 'p-3 flex justify-center' : 'p-3'
                }`}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${
                    activeSessionId === session.id
                      ? 'from-blue-400 to-blue-500'
                      : 'from-gray-100 to-gray-200'
                  } flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${
                      activeSessionId === session.id ? 'text-white' : 'text-gray-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        activeSessionId === session.id ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </button>
              
              {!isCollapsed && (
                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Improved Collapse Toggle Button */}
      <div className="absolute -right-7 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={onToggleCollapse}
          className="group relative w-7 h-14 bg-white border border-gray-200 rounded-r-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="relative flex items-center">
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </div>
        </button>
      </div>

      {/* Bottom gradient fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ChatSidebar;