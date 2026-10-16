import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Lock, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationContext';
import { api } from '../services/api';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addFacultyMember, facultyList } = usePublications();

  // Active portal role: admin or faculty
  const [portalRole, setPortalRole] = useState<'admin' | 'faculty'>('admin');

  // Mode: signin or register
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign in Form states
  const [email, setEmail] = useState('admin@researchhub.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('CSE');
  const [regTitle, setRegTitle] = useState('Assistant Professor');
  const [regPassword, setRegPassword] = useState('');
  const [regInterests, setRegInterests] = useState('');

  // Validation & feedback states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate Sign In fields
  const validateSignIn = (): boolean => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateSignIn()) return;

    setLoading(true);

    const apiResult = await api.login(email, password);

    if (apiResult && apiResult.user) {
      login(apiResult.user);
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    // Fallback if API server is offline
    if (email.toLowerCase().includes('admin@')) {
      login({
        name: 'Dr. Karthika',
        role: 'Research Admin',
        email: email,
        initials: 'DK',
      });
      setLoading(false);
      navigate('/dashboard');
    } else {
      const matchedFaculty = facultyList.find(
        (fac) => fac.email.toLowerCase() === email.toLowerCase()
      );
      const formattedName = email.split('@')[0].split('.').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const facultyName = matchedFaculty
        ? matchedFaculty.name
        : (formattedName.startsWith('Dr.') ? formattedName : `Dr. ${formattedName}`);
      const initials = matchedFaculty
        ? matchedFaculty.initials
        : facultyName.replace('Dr. ', '').split(' ').map((s) => s[0]).join('').toUpperCase().substring(0, 2);

      login({
        name: facultyName,
        role: 'Faculty',
        email: email,
        initials: initials || 'FM',
      });
      setLoading(false);
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setGeneralError('Please fill in all required registration fields.');
      return;
    }

    setLoading(true);

    const formattedName = regName.startsWith('Dr.') ? regName : `Dr. ${regName}`;
    const nameParts = formattedName.replace(/Dr\./g, '').trim().split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const interestsArray = regInterests
      ? regInterests.split(',').map((s) => s.trim())
      : ['Research', 'Academia'];

    await addFacultyMember({
      name: formattedName,
      title: regTitle,
      department: regDept,
      email: regEmail,
      initials,
      researchInterests: interestsArray,
      bio: `${regTitle} in the Department of ${regDept}.`,
    });

    const apiResult = await api.register({
      name: formattedName,
      email: regEmail,
      department: regDept,
      title: regTitle,
      password: regPassword,
      researchInterests: regInterests,
    });

    login(apiResult?.user || {
      name: formattedName,
      role: 'Faculty',
      email: regEmail,
      initials,
    });

    setLoading(false);
    navigate('/dashboard');
  };

  // Populate mock logins
  const loadDemo = (demoType: 'admin' | 'faculty' | 'registerDemo') => {
    setGeneralError('');
    setEmailError('');
    setPasswordError('');
    
    if (demoType === 'admin') {
      setPortalRole('admin');
      setMode('signin');
      setEmail('admin@researchhub.edu');
      setPassword('admin123');
    } else if (demoType === 'faculty') {
      setPortalRole('faculty');
      setMode('signin');
      setEmail('faculty@researchhub.edu');
      setPassword('faculty123');
    } else {
      setPortalRole('faculty');
      setMode('register');
      setRegName('Dr. Ananya Sharma');
      setRegEmail('ananya.sharma@university.edu');
      setRegDept('CSE');
      setRegTitle('Assistant Professor');
      setRegPassword('ananya123');
      setRegInterests('Quantum Computing, Cybersecurity');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 lg:p-12 font-sans">
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Branding Section */}
        <div className="md:col-span-5 bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border-4 border-white" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rotate-45" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-lg border border-white" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-xs">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight block">ResearchHub</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">University Platform</span>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <h1 className="text-2xl font-bold leading-tight lg:text-3xl">
                Faculty Research Repository & Analytics
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Centralize faculty research, manage publications, and gain insights into institutional research performance.
              </p>
            </div>

            <ul className="space-y-3.5 pt-4">
              <li className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">✓</span>
                <span>Centralized Research Repository</span>
              </li>
              <li className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">✓</span>
                <span>Publication Management & File Uploads</span>
              </li>
              <li className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">✓</span>
                <span>Role-Based Access Control (RBAC)</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-12 md:pt-0">
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              © {new Date().getFullYear()} ResearchHub Platform. <br />
              All rights reserved. Institutional Repository Network.
            </p>
          </div>
        </div>

        {/* Right Column: Sign In / Registration Section */}
        <div className="md:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
          <div className="max-w-md mx-auto w-full my-auto space-y-6">
            
            {/* Mode Switcher: Hidden for Admin, active only when Faculty Portal Entry is clicked */}
            {portalRole === 'faculty' ? (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => { setMode('register'); setGeneralError(''); }}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                    mode === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  1. New Faculty Registration
                </button>
                <button
                  onClick={() => { setMode('signin'); setGeneralError(''); }}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    mode === 'signin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  2. Registered Faculty Login
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Research Administrator Portal</span>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Audit Access
                </span>
              </div>
            )}

            {/* General alert error banner */}
            {generalError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {mode === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {portalRole === 'admin' ? 'Administrator Sign In' : 'Faculty Sign In'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {portalRole === 'admin' 
                      ? 'Sign in to access the ResearchHub administrative verification suite.' 
                      : 'Sign in to access your personal research workspace.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className={`
                    flex items-center border rounded-lg px-3 py-2 bg-gray-50 transition-all duration-150
                    ${emailError ? 'border-red-300 ring-2 ring-red-500/10 bg-white' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white'}
                  `}>
                    <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 w-full"
                    />
                  </div>
                  {emailError && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className={`
                    flex items-center border rounded-lg px-3 py-2 bg-gray-50 transition-all duration-150
                    ${passwordError ? 'border-red-300 ring-2 ring-red-500/10 bg-white' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white'}
                  `}>
                    <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {passwordError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 justify-center font-bold mt-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              /* Faculty Registration Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Faculty Registration</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Register a new faculty account to submit research papers.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="IT">IT</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Designation</label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="e.g. Asst. Professor"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">University Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ananya@university.edu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Research Interests</label>
                  <input
                    type="text"
                    value={regInterests}
                    onChange={(e) => setRegInterests(e.target.value)}
                    placeholder="e.g. Quantum Computing, Cybersecurity"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 justify-center font-bold mt-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registering Faculty...</span>
                    </div>
                  ) : (
                    <>
                      <span>Register & Access Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Demo access widget */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2 mb-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900">Demo Access Presets</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => loadDemo('admin')}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all cursor-pointer text-center ${
                    portalRole === 'admin'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/15'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-800">Research Admin</span>
                  <span className="text-[9px] text-gray-400 font-mono">admin@researchhub.edu</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadDemo('faculty')}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all cursor-pointer text-center ${
                    portalRole === 'faculty'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/15'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold text-blue-700">Faculty Portal Entry</span>
                  <span className="text-[9px] text-blue-500 font-medium">Registration & Registered Login</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
