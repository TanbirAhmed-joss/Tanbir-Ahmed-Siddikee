
import React, { useEffect } from 'react';

interface EndScreenProps {
  onHomeClick: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ onHomeClick }) => {
  useEffect(() => {
    // Automatic redirection after 10 seconds
    const timer = setTimeout(onHomeClick, 10000);
    return () => clearTimeout(timer);
  }, [onHomeClick]);

  return (
    <div className="w-full max-w-3xl bg-purple-900/50 backdrop-blur-md rounded-[2.5rem] p-16 shadow-2xl text-center border border-white/10">
      <div className="text-7xl mb-12 animate-bounce">🥳</div>
      
      <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
        Thank You for Attending!
      </h2>
      <p className="text-white/80 text-xl mb-12 font-medium">
        The class has ended.
      </p>

      <p className="text-white/60 text-sm mb-8 italic">
        Redirecting you to home in a moment...
      </p>

      <button 
        onClick={onHomeClick}
        className="px-12 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:scale-105 active:scale-95"
      >
        Go Home Now
      </button>
    </div>
  );
};

export default EndScreen;
