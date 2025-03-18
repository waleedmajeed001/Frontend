"use client"

import { useState, useEffect } from 'react';

interface UserProfileData {
  name: string;
  age: string;
  hobbies: string;
  additionalInfo: string;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfileData) => void;
}

const UserProfile = ({ isOpen, onClose, onSave }: UserProfileProps) => {
  const [profileData, setProfileData] = useState<UserProfileData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : {
        name: '',
        age: '',
        hobbies: '',
        additionalInfo: ''
      };
    }
    return {
      name: '',
      age: '',
      hobbies: '',
      additionalInfo: ''
    };
  });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        setProfileData(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    onSave(profileData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
                <p className="text-sm text-gray-500">Personalize your chat experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
              <textarea
                value={profileData.hobbies}
                onChange={(e) => setProfileData({ ...profileData, hobbies: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                placeholder="What do you like to do? (separated by commas)"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
              <textarea
                value={profileData.additionalInfo}
                onChange={(e) => setProfileData({ ...profileData, additionalInfo: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                placeholder="Any other details you'd like me to remember?"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-8 py-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 