
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, Mic, MicOff, Video, VideoOff, 
  X, Copy, Check, ShieldAlert, UserX, MessageSquareOff, 
  Users, ShieldCheck, LogOut
} from 'lucide-react';
import { RoomState, UserRole, ChatMessage, ModerationAlert } from '../types';

interface ClassroomProps {
  userName: string;
  role: UserRole;
  room: RoomState;
  onLeave: () => void;
}

const Classroom: React.FC<ClassroomProps> = ({ userName, role, room, onLeave }) => {
  const isTeacher = role === UserRole.TEACHER || role === UserRole.CO_TEACHER;
  const isAdmin = role === UserRole.TEACHER;

  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showParticipantList, setShowParticipantList] = useState(false);
  
  // Admin States
  const [isChatDisabledGlobally, setIsChatDisabledGlobally] = useState(false);
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<ModerationAlert[]>([]);
  
  // Simulated participants list
  const [participants] = useState<string[]>(['সদফ (Host)', 'Arif', 'Siam', 'Fahim', 'Tanbir']);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // সরাসরি হোম পেজে যাওয়ার ফাংশন (কোনো কনফার্মেশন ছাড়া)
  const triggerLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // ক্যামেরা এবং মাইক বন্ধ করা
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // সরাসরি হোম পেজে নিয়ে যাবে
    onLeave();
  };

  const startBroadcasting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setIsLive(true);
    } catch (err) {
      alert("Please allow camera and microphone access to start.");
    }
  };

  const checkModeration = (text: string): { isFlagged: boolean; reason?: string } => {
    const badWords = ['খারাপ', 'gadha', 'pagol', 'অশালীন']; 
    const lowerText = text.toLowerCase();
    if (badWords.some(word => lowerText.includes(word))) {
      return { isFlagged: true, reason: 'অশালীন ভাষা শনাক্ত হয়েছে!' };
    }
    return { isFlagged: false };
  };

  const addAlert = (user: string, reason: string) => {
    if (!isTeacher) return;
    const newAlert = { id: Date.now().toString(), user, reason, timestamp: new Date() };
    setAlerts(prev => [newAlert, ...prev]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
    }, 6000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!isTeacher && (isChatDisabledGlobally || mutedUsers.has(userName) || bannedUsers.has(userName))) return;

    const modStatus = checkModeration(inputText);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userName,
      text: inputText.trim(),
      timestamp: new Date(),
      role: role,
      isFlagged: modStatus.isFlagged,
      flagReason: modStatus.reason
    };

    if (modStatus.isFlagged) addAlert(userName, modStatus.reason!);
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const toggleBan = (targetName: string) => {
    if (!isAdmin || targetName.includes('(Host)')) return;
    setBannedUsers(prev => {
      const next = new Set(prev);
      if (next.has(targetName)) next.delete(targetName);
      else {
        next.add(targetName);
        setMessages(msgs => msgs.filter(m => m.sender !== targetName));
      }
      return next;
    });
  };

  const toggleMute = (targetName: string) => {
    if (!isAdmin || targetName.includes('(Host)')) return;
    setMutedUsers(prev => {
      const next = new Set(prev);
      if (next.has(targetName)) next.delete(targetName);
      else next.add(targetName);
      return next;
    });
  };

  return (
    <div className="w-full max-w-7xl h-[92vh] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Moderation Alerts */}
      {isTeacher && alerts.length > 0 && (
        <div className="absolute top-20 right-6 z-[100] flex flex-col gap-3 w-80">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border border-red-400 flex items-start gap-3 animate-bounce">
              <ShieldAlert className="shrink-0" size={20} />
              <div className="flex-1">
                <p className="font-bold text-sm">{alert.reason}</p>
                <p className="text-xs opacity-80">ইউজার: {alert.user}</p>
              </div>
              <button onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))} className="opacity-50 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-black flex items-center gap-2">
              {room.className}
              {isAdmin && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">CODE: {room.code}</span>
              {isLive && <span className="flex items-center gap-1.5 text-[10px] text-red-400 font-black uppercase animate-pulse">● LIVE</span>}
            </div>
          </div>
        </div>
        
        {/* উপরের Leave বাটন */}
        <button 
          onClick={triggerLogout}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform text-red-400" />
          <span>Leave</span>
        </button>
      </header>

      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          
          {/* Video Area */}
          <div className="flex-1 bg-black/40 rounded-[2.5rem] overflow-hidden relative border border-white/10 shadow-2xl flex items-center justify-center">
            {isLive ? (
              <video ref={videoRef} autoPlay muted={isAdmin} playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video size={32} className="text-white/20" />
                </div>
                <h2 className="text-white text-2xl font-bold mb-6">Ready to start the session?</h2>
                {isAdmin && (
                  <button 
                    onClick={startBroadcasting}
                    className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95"
                  >
                    START LIVE NOW
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Teacher Controls Bar */}
          {isAdmin && isLive && (
            <div className="bg-white rounded-[2rem] p-3 shadow-xl flex items-center justify-center gap-4 border border-white/20">
              <button 
                onClick={() => {streamRef.current?.getAudioTracks().forEach(t => t.enabled = !isMicOn); setIsMicOn(!isMicOn)}} 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-red-500 text-white shadow-lg'}`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                onClick={() => {streamRef.current?.getVideoTracks().forEach(t => t.enabled = !isCameraOn); setIsCameraOn(!isCameraOn)}} 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCameraOn ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-red-500 text-white shadow-lg'}`}
              >
                {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              <div className="w-px h-10 bg-slate-200 mx-2"></div>
              <button 
                onClick={() => setIsChatDisabledGlobally(!isChatDisabledGlobally)} 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isChatDisabledGlobally ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'}`}
              >
                {isChatDisabledGlobally ? <MessageSquareOff size={24} /> : <MessageSquare size={24} />}
              </button>
              <button 
                onClick={() => setShowParticipantList(!showParticipantList)} 
                className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
              >
                <Users size={24} />
              </button>
              <div className="w-px h-10 bg-slate-200 mx-2"></div>
              
              {/* নিচের End Class বাটন */}
              <button 
                onClick={triggerLogout}
                className="px-10 h-14 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-red-700 transition-all active:scale-95"
              >
                End Class
              </button>
            </div>
          )}

          {/* Share Section */}
          {isAdmin && (
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between gap-4 border border-white/20">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-50 py-3 px-8 rounded-2xl border border-indigo-100">
                  <span className="text-[10px] text-indigo-400 block uppercase font-black mb-1">Room Code</span>
                  <h2 className="text-indigo-900 text-3xl font-black tracking-widest">{room.code}</h2>
                </div>
                <button 
                  onClick={() => {navigator.clipboard.writeText(window.location.origin); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} 
                  className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-md ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Link Copied' : 'Share Website'}
                </button>
              </div>
              <div className="text-right">
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1 mb-1">
                  <ShieldCheck size={12} /> Secure Connection
                </p>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest tracking-tighter">Tanbir Media Engine v4.2</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <aside className="w-[420px] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Live Chat</h3>
            </div>
            {isChatDisabledGlobally && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">Muted</span>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                <MessageSquare size={40} className="mb-2" />
                <p className="text-xs font-black uppercase">No Messages</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase mb-1">{msg.sender}</span>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.sender === userName 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type something..."
                disabled={!isTeacher && isChatDisabledGlobally}
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button type="submit" className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md">
                <Send size={20} />
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* Participant List Modal */}
      {isAdmin && showParticipantList && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-8">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-slate-800 font-black text-lg uppercase tracking-widest">Active Members</h3>
               <button onClick={() => setShowParticipantList(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                 <X size={24} />
               </button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
              {participants.map(p => (
                <div key={p} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">{p[0]}</div>
                    <span className="font-bold text-slate-700">{p}</span>
                  </div>
                  {!p.includes('(Host)') && (
                    <div className="flex gap-2">
                      <button onClick={() => toggleMute(p)} className={`p-2 rounded-lg transition-all ${mutedUsers.has(p) ? 'bg-amber-500 text-white' : 'bg-white text-slate-400 hover:bg-amber-50'}`}><MessageSquareOff size={18} /></button>
                      <button onClick={() => toggleBan(p)} className="p-2 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"><UserX size={18} /></button>
                    </div>
                  )}
                  {p.includes('(Host)') && <ShieldCheck className="text-amber-500" size={20} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
