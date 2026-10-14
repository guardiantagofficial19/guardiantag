'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import HardwareCard from '@/components/ui/HardwareCard';
import Badge from '@/components/ui/Badge';
import { 
  Lock, User, HeartHandshake, Save, CheckCircle2, AlertTriangle, 
  ShieldCheck, ArrowRight, Eye, EyeOff, LogOut, KeyRound, 
  Download, Smartphone, RefreshCw, CheckCircle, ExternalLink
} from 'lucide-react';

function ManageFlow() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  // Auth Mode State: 'pin' | 'otp'
  const [loginMode, setLoginMode] = useState<'pin' | 'otp'>('pin');

  // Login Form States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrId, setQrId] = useState(initialId);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // OTP Login States
  const [otpInput, setOtpInput] = useState('');
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Form Details (Loaded post-auth)
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [activatedAt, setActivatedAt] = useState('');
  const [tagStatus, setTagStatus] = useState<'activated' | 'deactivated'>('activated');

  // Optional PIN Change State
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // UI Feedback States
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resend OTP Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Request OTP for Login
  const handleRequestLoginOtp = async () => {
    const cleanId = qrId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter your QR Tag ID first.');
      return;
    }

    setError(null);
    setIsSendingOtp(true);

    try {
      // First fetch tag details or request OTP via API
      const res = await fetch('/api/owner/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanId }), // API accepts phone or lookup
      });

      const data = await res.json();
      setIsSendingOtp(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send login OTP via Twilio SMS.');
        return;
      }

      setIsOtpRequested(true);
      setResendTimer(30);
    } catch {
      setIsSendingOtp(false);
      setError('Network error requesting login OTP.');
    }
  };

  // Step 1: Server Authentication (PIN or OTP)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLocked(false);

    const cleanId = qrId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter your QR Tag ID.');
      return;
    }

    if (loginMode === 'pin' && !pin) {
      setError('Please enter your 4-digit security PIN.');
      return;
    }

    if (loginMode === 'otp' && !otpInput) {
      setError('Please enter the 6-digit OTP sent to your registered mobile.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = loginMode === 'pin' 
        ? { qrId: cleanId, pin, loginType: 'pin' }
        : { qrId: cleanId, otp: otpInput, loginType: 'otp' };

      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        if (data.isLocked) {
          setIsLocked(true);
          setLockoutMinutes(data.remainingMinutes || 5);
          setError(data.error);
        } else {
          setError(data.error || 'Authentication failed. Please check credentials or try fallback OTP 123456.');
        }
        return;
      }

      // Successful Auth: Populate owner details
      setIsAuthenticated(true);
      setOwnerName(data.owner.ownerName || '');
      setOwnerPhone(data.owner.ownerPhone || '');
      setEmergencyName(data.owner.emergencyName || '');
      setEmergencyPhone(data.owner.emergencyPhone || '');
      setVehicleNo(data.owner.vehicleNo || '');
      setBloodGroup(data.owner.bloodGroup || '');
      setMedicalNotes(data.owner.medicalNotes || '');
      setActivatedAt(data.owner.activatedAt || '');
      setTagStatus(data.owner.status === 'deactivated' ? 'deactivated' : 'activated');
    } catch {
      setIsLoading(false);
      setError('Authentication request failed. Please check your network connection.');
    }
  };

  // Step 2: Save Updated Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);

    if (!ownerName.trim() || !ownerPhone.trim()) {
      setError('Owner Name and Mobile Number are required.');
      return;
    }

    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Emergency Contact Name and Mobile Number are required.');
      return;
    }

    if (showPinChange) {
      if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        setError('New PIN must be exactly 4 numeric digits.');
        return;
      }

      if (newPin !== confirmNewPin) {
        setError('New PINs do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/owner/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrId: qrId.trim().toUpperCase(),
          ownerName,
          ownerPhone,
          emergencyName,
          emergencyPhone,
          vehicleNo,
          bloodGroup,
          medicalNotes,
          newPin: showPinChange ? newPin : undefined,
          status: tagStatus,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update details in server database.');
        return;
      }

      setSaveSuccess(true);
      setShowPinChange(false);
      setNewPin('');
      setConfirmNewPin('');

      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setIsLoading(false);
      setError('Network error saving updates.');
    }
  };

  // Toggle Tag Active / Deactivated (Lost) Status
  const handleToggleTagStatus = async () => {
    const nextStatus = tagStatus === 'activated' ? 'deactivated' : 'activated';
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/owner/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrId: qrId.trim().toUpperCase(),
          ownerName,
          ownerPhone,
          emergencyName,
          emergencyPhone,
          vehicleNo,
          bloodGroup,
          medicalNotes,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        setTagStatus(nextStatus);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setError(data.error || 'Failed to update tag status.');
      }
    } catch {
      setIsLoading(false);
      setError('Network error updating tag status.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setOtpInput('');
    setIsOtpRequested(false);
    setError(null);
    setSaveSuccess(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-10 space-y-3">
          <Badge icon={<Lock className="w-3.5 h-3.5" />}>
            RETURNING OWNER MANAGEMENT PORTAL
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Manage GuardianTag Details
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-normal max-w-md mx-auto">
            Log in via 4-Digit Security PIN or Twilio Mobile SMS OTP to manage contacts, medical info &amp; security settings.
          </p>
        </div>

        {/* Main Content Card */}
        <HardwareCard hoverLift={false} className="border border-white/15 shadow-2xl space-y-6">
          
          {error && (
            <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 ${
              isLocked
                ? 'bg-neutral-900 border border-white text-white font-bold'
                : 'bg-white/10 border border-white/30 text-white'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0 text-white" />
              <div>
                <p>{error}</p>
                {isLocked && (
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    Account access paused to protect against brute-force logins.
                  </p>
                )}
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-3 shadow-xl font-mono">
              <CheckCircle2 className="w-5 h-5 text-black" />
              <span>Details saved successfully! Emergency lookups have been updated in Supabase registry.</span>
            </div>
          )}

          {/* VIEW 1: OWNER DUAL LOGIN FORM (PIN vs TWILIO OTP) */}
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                
                {/* Auth Mode Toggle Tabs */}
                <div className="flex border border-white/20 rounded-xl overflow-hidden text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('pin');
                      setError(null);
                    }}
                    className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMode === 'pin' 
                        ? 'bg-white text-black font-extrabold' 
                        : 'bg-black text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>01. 4-Digit PIN Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('otp');
                      setError(null);
                    }}
                    className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMode === 'otp' 
                        ? 'bg-white text-black font-extrabold' 
                        : 'bg-black text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>02. Twilio Mobile OTP</span>
                  </button>
                </div>

                {/* Common QR Tag ID Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-neutral-300">
                    GUARDIANTAG SERIAL QR ID *
                  </label>
                  <input
                    type="text"
                    value={qrId}
                    onChange={(e) => setQrId(e.target.value.toUpperCase())}
                    placeholder="e.g. GTB0001"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white font-mono font-bold text-base tracking-wider focus:outline-none focus:border-white uppercase"
                    required
                  />
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Active test tag: <strong className="text-white font-bold">GTB0002</strong> (Default PIN: <strong className="text-white font-bold">1234</strong>)
                  </p>
                </div>

                {/* MODE A: 4-DIGIT PIN LOGIN */}
                {loginMode === 'pin' && (
                  <div className="space-y-2 animate-in fade-in">
                    <label className="block text-xs font-mono font-bold text-neutral-300">
                      4-DIGIT SECURITY PIN *
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-center font-mono font-extrabold tracking-widest text-white text-xl focus:outline-none focus:border-white"
                        required={loginMode === 'pin'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-3.5 text-neutral-400 hover:text-white"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE B: TWILIO MOBILE OTP LOGIN */}
                {loginMode === 'otp' && (
                  <div className="space-y-4 animate-in fade-in">
                    {!isOtpRequested ? (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-3">
                        <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                          Enter your QR Tag ID above and click below to send a 6-digit verification SMS code via Twilio to your registered mobile number.
                        </p>
                        <Button
                          type="button"
                          onClick={handleRequestLoginOtp}
                          disabled={isSendingOtp || !qrId.trim()}
                          fullWidth
                          variant="secondary"
                          icon={<Smartphone className="w-4 h-4" />}
                        >
                          {isSendingOtp ? 'Dispatching Twilio SMS...' : 'Send SMS OTP to Registered Mobile'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/15">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-bold text-neutral-300">
                            ENTER 6-DIGIT TWILIO OTP CODE *
                          </label>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            SMS Dispatched
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 123456"
                            className="w-full bg-black border border-white/30 rounded-xl px-4 py-3 text-center font-mono font-extrabold tracking-widest text-white text-xl focus:outline-none focus:border-white"
                            required={loginMode === 'otp'}
                            autoFocus
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono pt-1">
                          <button
                            type="button"
                            onClick={handleRequestLoginOtp}
                            disabled={resendTimer > 0 || isSendingOtp}
                            className="text-neutral-400 hover:text-white disabled:opacity-50 flex items-center gap-1.5 underline cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                            <span>{resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend OTP Code'}</span>
                          </button>
                          <span className="text-[10px] text-neutral-400">
                            Fallback code: <strong className="text-white">123456</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={isLoading || isLocked}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isLoading 
                  ? 'Authenticating Session...' 
                  : (loginMode === 'pin' ? 'Log In with Security PIN' : 'Verify OTP & Log In')
                }
              </Button>
            </form>
          ) : (
            /* VIEW 2: AUTHENTICATED CUSTOMIZATION & EDITING FORM */
            <form onSubmit={handleSaveDetails} className="space-y-6">
              
              {/* Profile Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/15 pb-4 gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider block">
                      AUTHENTICATED TAG: {qrId}
                    </span>
                    {tagStatus === 'activated' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        Status: Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Status: Deactivated (Lost Mode)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                    Privacy Masking Active • Server Session Authenticated
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Lost Tag / Deactivation Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleTagStatus}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border transition ${
                      tagStatus === 'activated'
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{tagStatus === 'activated' ? 'Deactivate Tag (Lost)' : 'Reactivate Tag'}</span>
                  </button>

                  {/* Emergency Scan Preview */}
                  <Link
                    href={`/tag/${qrId}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Emergency Scan</span>
                  </Link>

                  {/* Certificate SVG Download */}
                  <button
                    type="button"
                    onClick={() => {
                      const svgContent = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" style="background:#000000; font-family:monospace;">
                          <rect x="20" y="20" width="760" height="960" fill="#0a0a0a" stroke="#ffffff" stroke-width="4" rx="24"/>
                          <rect x="40" y="40" width="720" height="920" fill="none" stroke="#333333" stroke-dasharray="4 4" rx="16"/>
                          <text x="400" y="120" text-anchor="middle" fill="#ffffff" font-size="32" font-weight="bold">GUARDIANTAG OFFICIAL CERTIFICATE</text>
                          <text x="400" y="160" text-anchor="middle" fill="#888888" font-size="14" font-weight="bold">AUTHENTICATED HARDWARE SAFETY REGISTRATION</text>
                          <line x1="80" y1="200" x2="720" y2="200" stroke="#333333" stroke-width="2"/>
                          
                          <text x="100" y="260" fill="#888888" font-size="12">TAG SERIAL ID:</text>
                          <text x="300" y="260" fill="#ffffff" font-size="16" font-weight="bold">${qrId}</text>
                          
                          <text x="100" y="310" fill="#888888" font-size="12">REGISTERED OWNER:</text>
                          <text x="300" y="310" fill="#ffffff" font-size="16" font-weight="bold">${ownerName || 'AUTHENTICATED RIDER'}</text>
                          
                          <text x="100" y="360" fill="#888888" fill-opacity="1" stroke-width="0" font-size="12">OWNER PHONE (MASKED):</text>
                          <text x="300" y="360" fill="#ffffff" font-size="16" font-weight="bold">${ownerPhone || '+91 98765 43210'}</text>

                          <text x="100" y="410" fill="#888888" font-size="12">EMERGENCY DISPATCH:</text>
                          <text x="300" y="410" fill="#ffffff" font-size="16" font-weight="bold">${emergencyName} (${emergencyPhone})</text>
                          
                          <rect x="250" y="480" width="300" height="300" fill="#000000" stroke="#ffffff" stroke-width="3" rx="16"/>
                          <text x="400" y="820" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">HARDWARE SAFETY VALIDATED</text>
                          <text x="400" y="860" text-anchor="middle" fill="#555555" font-size="12">GUARDIANTAG • guardiantag.in</text>
                        </svg>
                      `;
                      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `GUARDIANTAG_CERTIFICATE_${qrId}.svg`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Certificate (SVG)</span>
                  </button>

                  {/* Medical Lockscreen Pass Download */}
                  <button
                    type="button"
                    onClick={() => {
                      const svgContent = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000" width="600" height="1000" style="background:#000000; font-family:monospace;">
                          <rect x="0" y="0" width="600" height="1000" fill="#000000"/>
                          <rect x="30" y="40" width="540" height="920" fill="#0a0a0a" stroke="#ffffff" stroke-width="3" rx="36"/>
                          <text x="300" y="100" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="bold">EMERGENCY MEDICAL ID</text>
                          <text x="300" y="130" text-anchor="middle" fill="#888888" font-size="12">GUARDIANTAG LOCKSCREEN PASS</text>
                          <line x1="60" y1="160" x2="540" y2="160" stroke="#333333" stroke-width="2"/>
                          
                          <text x="80" y="220" fill="#888888" font-size="12">NAME:</text>
                          <text x="80" y="250" fill="#ffffff" font-size="20" font-weight="bold">${ownerName || 'AUTHENTICATED RIDER'}</text>
                          
                          <text x="80" y="310" fill="#888888" font-size="12">BLOOD GROUP:</text>
                          <text x="80" y="340" fill="#ffffff" font-size="24" font-weight="bold">${bloodGroup || 'O+ POSITIVE'}</text>

                          <text x="80" y="400" fill="#888888" font-size="12">MEDICAL NOTES:</text>
                          <text x="80" y="430" fill="#ffffff" font-size="14">${medicalNotes || 'No known drug allergies'}</text>

                          <rect x="150" y="520" width="300" height="300" fill="#ffffff" rx="16"/>
                          <text x="300" y="860" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">SCAN QR TO DISPATCH EMERGENCY RELAY</text>
                        </svg>
                      `;
                      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `GUARDIANTAG_LOCKSCREEN_PASS_${qrId}.svg`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Medical Pass (SVG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Owner Contacts */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                  <User className="w-4 h-4 text-white" />
                  Owner Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">OWNER FULL NAME *</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">OWNER MOBILE (Masked) *</label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                </div>

                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2 pt-2">
                  <HeartHandshake className="w-4 h-4 text-white" />
                  Emergency Dispatch Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">EMERGENCY CONTACT NAME *</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">EMERGENCY MOBILE NUMBER *</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">VEHICLE NO / ITEM</label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">BLOOD GROUP</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 font-bold mb-1">MEDICAL / ALLERGY NOTES</label>
                  <input
                    type="text"
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-white"
                  />
                </div>

                {/* Optional PIN Change Drawer */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPinChange(!showPinChange)}
                    className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 cursor-pointer font-bold border-b border-white/20 pb-1"
                  >
                    <KeyRound className="w-4 h-4 text-white" />
                    <span>{showPinChange ? 'Cancel PIN Change' : 'Change Security 4-Digit PIN'}</span>
                  </button>

                  {showPinChange && (
                    <div className="mt-4 p-4 rounded-2xl bg-black border border-white/20 space-y-3 animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <label className="block text-neutral-400 font-bold mb-1">NEW 4-DIGIT PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-center font-mono font-extrabold tracking-widest text-white text-base focus:outline-none focus:border-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 font-bold mb-1">CONFIRM NEW PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={confirmNewPin}
                            onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-center font-mono font-extrabold tracking-widest text-white text-base focus:outline-none focus:border-white"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        New PIN will be hashed server-side with SHA-512 salted encryption upon saving.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                icon={<Save className="w-4 h-4" />}
              >
                {isLoading ? 'Saving Updates to Registry...' : 'Save Changes & Update Tag'}
              </Button>
            </form>
          )}

        </HardwareCard>
      </main>

      <Footer />
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-10 flex items-center justify-center font-mono">Loading management portal...</div>}>
      <ManageFlow />
    </Suspense>
  );
}
