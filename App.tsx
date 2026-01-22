
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import RoomForm from './components/RoomForm';
import Classroom from './components/Classroom';
import { UserRole, ViewState, RoomState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [initialCode, setInitialCode] = useState('');

  // URL প্যারামিটার চেক করা
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) {
      setInitialCode(roomCode.toUpperCase());
      setRole(UserRole.STUDENT);
      setView('FORM');
    }
  }, []);

  const handleStartAsTeacher = () => {
    setRole(UserRole.TEACHER);
    setView('FORM');
  };

  const handleStartAsStudent = () => {
    setRole(UserRole.STUDENT);
    setView('FORM');
  };

  const handleJoinOrCreateClass = (name: string, code: string, className: string, isCoTeacher: boolean) => {
    setUserName(name);
    setRoom({
      id: Math.random().toString(36).substr(2, 9),
      code: code.toUpperCase(),
      className: className || 'Untitled Class',
      isActive: true
    });
    if (isCoTeacher) setRole(UserRole.CO_TEACHER);
    setView('CLASSROOM');
    
    // URL আপডেট করা (পেজ রিফ্রেশ ছাড়া)
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?room=${code.toUpperCase()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleReset = () => {
    setView('LANDING');
    setRole(null);
    setUserName('');
    setRoom(null);
    setInitialCode('');
    // URL প্যারামিটার পরিষ্কার করা
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {view === 'LANDING' && (
        <LandingPage 
          onTeacherClick={handleStartAsTeacher} 
          onStudentClick={handleStartAsStudent} 
        />
      )}
      
      {view === 'FORM' && role && (
        <RoomForm 
          role={role} 
          prefillCode={initialCode}
          onBack={() => setView('LANDING')} 
          onJoin={handleJoinOrCreateClass}
        />
      )}

      {view === 'CLASSROOM' && room && (
        <Classroom 
          userName={userName}
          role={role || UserRole.STUDENT}
          room={room}
          onLeave={handleReset}
        />
      )}

      <footer className="mt-8 text-white/60 text-xs">
        @2026 TAS SHOP™. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
