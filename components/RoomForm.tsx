
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { UserRole } from '../types';

interface RoomFormProps {
  role: UserRole;
  prefillCode?: string;
  onBack: () => void;
  onJoin: (name: string, code: string, className: string, isCoTeacher: boolean) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ role, prefillCode, onBack, onJoin }) => {
  const isTeacher = role === UserRole.TEACHER;
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [code, setCode] = useState('');
  const [isCoTeacher, setIsCoTeacher] = useState(false);

  useEffect(() => {
    if (isTeacher) {
      setCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    } else if (prefillCode) {
      setCode(prefillCode);
    }
  }, [isTeacher, prefillCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && (isTeacher ? className.trim() : code.trim().length === 6)) {
      onJoin(name, code, className, isCoTeacher);
    }
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onBack}
        className="text-white/80 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex justify-center mb-4">
          <div className="text-5xl">{isTeacher ? '🧑‍🏫' : '👨‍🎓'}</div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {isTeacher ? 'Create Live Class' : 'Join Live Class'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isTeacher ? 'Start streaming to your students' : 'Enter the room code from your teacher'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input 
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isTeacher ? "Mr. Tanbir" : "Enter your full name"}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                name ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isTeacher ? 'Class Name' : 'Room Code'}
            </label>
            <input 
              type="text"
              required
              maxLength={isTeacher ? 100 : 6}
              value={isTeacher ? className : code}
              onChange={(e) => isTeacher ? setClassName(e.target.value) : setCode(e.target.value.toUpperCase())}
              placeholder={isTeacher ? "e.g., Advanced Science Session" : "ABC123"}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                (isTeacher ? className : code) ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
              } ${!isTeacher ? 'text-center text-2xl font-bold tracking-widest uppercase' : ''}`}
            />
          </div>

          {!isTeacher && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <input 
                type="checkbox" 
                id="co-teacher" 
                checked={isCoTeacher}
                onChange={(e) => setIsCoTeacher(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="co-teacher" className="text-sm text-gray-600 leading-snug cursor-pointer select-none">
                Join as Co-Teacher (can monitor chat & students)
              </label>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 shadow-purple-200"
          >
            {isTeacher ? 'Create Room & Start Live' : 'Join Class Now'}
          </button>
        </form>

        <div className="mt-8 bg-purple-50 p-4 rounded-xl flex gap-3 items-start border border-purple-100">
          <Lightbulb className="text-amber-500 shrink-0" size={18} />
          <p className="text-xs text-purple-700 leading-tight">
            {isTeacher 
              ? "Your session will be secure. Only students with the room code can join."
              : "Ask your teacher for the unique 6-digit code to enter the live session."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;
