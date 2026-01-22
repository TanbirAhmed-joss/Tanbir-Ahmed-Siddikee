
import React from 'react';
import { MonitorPlay, Radio } from 'lucide-react';

interface LandingPageProps {
  onTeacherClick: () => void;
  onStudentClick: () => void;
}

// Fixed: Completed the truncated LandingPage component and added export default.
const LandingPage: React.FC<LandingPageProps> = ({ onTeacherClick, onStudentClick }) => {
  return (
    <div className="w-full max-w-4xl text-center">
      <div className="mb-12">
        <div className="flex justify-center mb-6 relative">
          <div className="p-5 bg-white rounded-3xl shadow-xl border border-white/20 transform hover:rotate-6 transition-transform">
            <MonitorPlay size={48} className="text-purple-600" />
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>
          </div>
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
          Tanbir Media Streaming Engine
        </h1>
        <p className="text-white/80 text-lg font-medium">Professional Live Streaming Solution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teacher Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl transition-transform hover:scale-105 flex flex-col items-center">
          <div className="text-6xl mb-6">🧑‍🏫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">I'm a Teacher</h2>
          <p className="text-gray-500 mb-8 text-center">Create a room, share the code, and start your live stream session with your students instantly.</p>
          <button 
            onClick={onTeacherClick}
            className="mt-auto w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-purple-200"
          >
            Start a Stream
          </button>
        </div>

        {/* Student Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl transition-transform hover:scale-105 flex flex-col items-center">
          <div className="text-6xl mb-6">👨‍🎓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">I'm a Student</h2>
          <p className="text-gray-500 mb-8 text-center">Join an existing session using a room code provided by your teacher to watch the live stream.</p>
          <button 
            onClick={onStudentClick}
            className="mt-auto w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-gray-200"
          >
            Join a Class
          </button>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-center gap-2 text-white/40">
        <Radio size={16} className="animate-pulse" />
        <span className="text-sm font-medium uppercase tracking-widest">Powered by Tanbir Stream Protocol 4.2</span>
      </div>
    </div>
  );
};

export default LandingPage;
