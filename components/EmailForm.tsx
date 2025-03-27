'use client';

import { useState } from 'react';

interface EmailFormProps {
  isDarkMode: boolean;
}

export default function EmailForm({ isDarkMode }: EmailFormProps) {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://backend1-one-plum.vercel.app/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send email');
      }

      setMessage('Email sent successfully!');
      setFormData({ to: '', subject: '', body: '' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Send Email
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            To
          </label>
          <input
            type="email"
            id="to"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            className={`mt-1 block w-full rounded-md border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className={`mt-1 block w-full rounded-md border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required
          />
        </div>

        <div>
          <label htmlFor="body" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Message
          </label>
          <textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={4}
            className={`mt-1 block w-full rounded-md border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-md ${
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