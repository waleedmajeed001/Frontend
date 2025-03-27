'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import EmailForm from '@/components/EmailForm';
import SMSForm from '@/components/SMSForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Communication Hub
          </h1>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDarkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
              isDarkMode ? 'rotate-180' : 'rotate-0'
            }`}>
              <div className={`absolute transition-opacity duration-300 ${
                isDarkMode ? 'opacity-0' : 'opacity-100'
              }`}>
                🌙
              </div>
              <div className={`absolute transition-opacity duration-300 ${
                isDarkMode ? 'opacity-100' : 'opacity-0'
              }`}>
                🌞
              </div>
            </div>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`rounded-lg shadow-md p-2 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Chat with AI
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'email'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Send Email
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'sms'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Send SMS
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {activeTab === 'chat' && <ChatInterface isDarkMode={isDarkMode} />}
          {activeTab === 'email' && <EmailForm isDarkMode={isDarkMode} />}
          {activeTab === 'sms' && <SMSForm isDarkMode={isDarkMode} />}
        </div>
      </div>
    </main>
  );
}
