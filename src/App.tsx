import { useState, ReactNode } from 'react';
import { Home, Gavel, User, Search, Flame, Clock, Heart, Share2, LogIn, Mail, Lock, ChevronRight, Bell, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// Temporary blank mock state
const TRENDING_CARDS: any[] = [];
const ACTIVE_BIDS: any[] = [];

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [currentTab, setCurrentTab] = useState('home');

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-[#0a0a0a] min-h-screen relative flex flex-col overflow-hidden shadow-2xl shadow-black">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide text-white">
          <AnimatePresence mode="wait">
            {currentTab === 'home' && <HomeView key="home" user={user} />}
            {currentTab === 'participate' && <ParticipateView key="participate" />}
            {currentTab === 'profile' && <ProfileView key="profile" user={user} onLogout={handleLogout} />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-[#0f0f0f]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center py-4 px-6 z-50 rounded-t-[32px] shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)]">
          <NavButton 
            active={currentTab === 'home'} 
            onClick={() => setCurrentTab('home')} 
            icon={<Home size={24} />} 
          />
          <NavButton 
            active={currentTab === 'participate'} 
            onClick={() => setCurrentTab('participate')} 
            icon={<Gavel size={24} />} 
            badge={2}
          />
          <NavButton 
            active={currentTab === 'profile'} 
            onClick={() => setCurrentTab('profile')} 
            icon={<User size={24} />} 
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, badge }: { active: boolean, onClick: () => void, icon: ReactNode, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      {badge && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#0f0f0f]"></span>
      )}
    </button>
  );
}

// --- VIEWS ---

function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-indigo-500/30 font-sans">
      <motion.div 
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-[32px] shadow-2xl"
      >
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <Gavel className="text-black" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-neutral-400 mb-8 font-medium">Sign in to discover and bid on rare cards.</p>

        <button 
          onClick={onLogin}
          className="w-full bg-[#141414] text-white border border-white/10 font-semibold py-4 rounded-2xl mt-4 hover:bg-[#1f1f1f] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-neutral-500 mt-8 font-medium">
          By signing in, you agree to our <a href="#" className="text-white hover:underline transition-colors">Terms</a>
        </p>
      </motion.div>
    </div>
  );
}

function HomeView({ user }: { user: FirebaseUser }) {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-neutral-500 font-medium tracking-wider uppercase mb-1">Good Morning</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">{user.displayName || 'User'}</h2>
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-800 shadow-md bg-neutral-900 flex items-center justify-center">
             {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <User className="text-neutral-500" size={24} />}
          </div>
          <div className="absolute top-0 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-[#0a0a0a]"></div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 text-white">
        <Search className="absolute left-4 top-3.5 text-neutral-400" size={20} />
        <input 
          type="text" 
          placeholder="Search rare cards..." 
          className="w-full pl-12 pr-4 py-3.5 bg-[#141414] border border-white/5 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-500 shadow-inner"
        />
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="text-indigo-500" size={20} /> Trending Now
          </h3>
          <a href="#" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">See All</a>
        </div>
        
        {/* Horizontal Scroll Area */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x">
          {TRENDING_CARDS.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-12 text-neutral-500 bg-[#121212] rounded-[32px] border border-white/5 mx-6">
              <Search className="mb-2 opacity-50" size={32} />
              <p className="text-sm font-medium">No trending cards yet</p>
            </div>
          ) : TRENDING_CARDS.map(card => (
            <div key={card.id}>...</div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}

function ParticipateView() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6 font-sans tracking-tight">Active Bids</h2>
      
      <div className="flex gap-2 mb-6">
        <button className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform hover:scale-105 active:scale-95">All (2)</button>
        <button className="px-5 py-2.5 bg-[#141414] text-neutral-400 border border-white/5 rounded-full text-sm font-medium hover:bg-[#1f1f1f] hover:text-white transition-all">Winning (1)</button>
        <button className="px-5 py-2.5 bg-[#141414] text-neutral-400 border border-white/5 rounded-full text-sm font-medium hover:bg-[#1f1f1f] hover:text-white transition-all">Outbid (1)</button>
      </div>

      <div className="space-y-4">
        {ACTIVE_BIDS.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-12 text-neutral-500 bg-[#121212] rounded-[32px] border border-white/5">
            <Gavel className="mb-2 opacity-50" size={32} />
            <p className="text-sm font-medium">No active bids</p>
          </div>
        ) : ACTIVE_BIDS.map(card => (
           <div key={card.id}>...</div>
        ))}
      </div>
    </motion.div>
  );
}

function ProfileView({ user, onLogout }: { user: FirebaseUser, onLogout: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="p-6"
    >
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-[3px] border-[#1a1a1a] shadow-2xl rotate-3 bg-neutral-900 flex items-center justify-center transition-transform hover:rotate-0 duration-300">
            {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover -rotate-3 hover:rotate-0 transition-transform duration-300 scale-110 hover:scale-100" /> : <User className="text-neutral-500 -rotate-3 scale-150" size={32} />}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{user.displayName || 'User'}</h2>
        <p className="text-sm font-medium text-neutral-500">{user.email}</p>
      </div>

      <div className="bg-[#111111] text-white rounded-[32px] p-6 shadow-xl mb-8 relative overflow-hidden border border-white/5">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-center mb-6">
          <span className="text-neutral-400 font-medium flex items-center gap-2"><Wallet size={18} className="text-indigo-400" /> Balance</span>
          <span className="text-xs bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5 rounded-full font-semibold border border-white/10 cursor-pointer">Add Funds</span>
        </div>
        <div className="relative z-10 font-mono text-3xl font-bold tracking-tight text-white">
          $0.00
        </div>
      </div>

      <div className="space-y-3">
        <ProfileMenuItem icon={<Heart size={20} />} label="Watchlist" badge="5" />
        <ProfileMenuItem icon={<Bell size={20} />} label="Notifications" />
        <ProfileMenuItem icon={<LogOutIcon onClick={onLogout} />} label="Logout" isDestructive />
      </div>
    </motion.div>
  );
}

function ProfileMenuItem({ icon, label, badge, isDestructive }: { icon: ReactNode, label: string, badge?: string, isDestructive?: boolean }) {
  return (
    <button className={`w-full bg-[#141414] hover:bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex items-center justify-between transition-all duration-300 active:scale-[0.98] ${isDestructive ? 'text-red-400' : 'text-neutral-200'}`}>
      <div className="flex items-center gap-3 font-semibold">
        <div className={`p-2 rounded-xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-neutral-300'}`}>
          {icon}
        </div>
        {label}
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
        <ChevronRight size={18} className="text-neutral-600" />
      </div>
    </button>
  );
}

function LogOutIcon({ onClick } : { onClick: () => void }) {
  return (
    <div onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <LogIn className="rotate-180" size={20} />
    </div>
  )
}
