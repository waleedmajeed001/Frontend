'use client';

import { useState } from 'react';

interface SMSFormProps {
  isDarkMode: boolean;
}

export default function SMSForm({ isDarkMode }: SMSFormProps) {
  const [formData, setFormData] = useState({
    to: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://backend1-one-plum.vercel.app/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send SMS');
      }

      setMessage('SMS sent successfully!');
      setFormData({ to: '', message: '' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send SMS');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h2 className={`text-lg sm:text-2xl font-semibold mb-3 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Send SMS
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
        <div>
          <label htmlFor="to" className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="text-sm">+</span>
            </div>
            <input
              type="tel"
              id="to"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className={`block w-full pl-7 py-2.5 sm:py-3 rounded-md border text-base ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="1234567890"
              required
            />
          </div>
          <p className={`mt-1 text-xs sm:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Enter the phone number without the + symbol (e.g., 1234567890)
          </p>
        </div>

        <div>
          <label htmlFor="message" className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className={`mt-1 block w-full py-2.5 sm:py-3 rounded-md border text-base ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required
          />
          <p className={`mt-1 text-xs sm:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Maximum length: 1600 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 sm:py-3.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform`}
        >
          {isLoading ? 'Sending...' : 'Send SMS'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-md text-sm sm:text-base ${
            message.includes('successfully')
              ? isDarkMode
                ? 'bg-green-900 text-green-100'
                : 'bg-green-50 text-green-700'
              : isDarkMode
                ? 'bg-red-900 text-red-100'
                : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}