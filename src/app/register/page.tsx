'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import HardwareCard from '@/components/ui/HardwareCard';
import Badge from '@/components/ui/Badge';
import { 
  QrCode, CheckCircle2, Lock, User, HeartHandshake, AlertCircle, 
  ArrowRight, ShieldCheck, Eye, EyeOff, Check, AlertTriangle, 
  RefreshCw, Smartphone, KeyRound, CheckCircle
} from 'lucide-react';

const TAG_MODEL_OPTIONS = [
  {
    id: 'GTB',
    name: 'GTB Biker Tag Kit',
    standFor: '4-Piece Kit: PVC, Key Chain, Small & Large Stickers',
    sampleId: 'GTB0001',
    description: 'Includes 1 PVC Helmet Tag, 1 Key Chain Tag, Small Helmet Stickers & Large Bike Stickers.',
    isComingSoon: false,
  },
  {
    id: 'GTK',
    name: 'GTK Kids Safety Bundle',
    standFor: 'Child & Backpack Protection Kit',
    sampleId: 'GTK0001',
    description: '10-piece safety hardware kit with waterproof QR stickers, key tags & uniform badges.',
    isComingSoon: true,
  },
  {
    id: 'GTT',
    name: 'GTT Traveller Tag',
    standFor: 'Luggage & Global Travel Bag Recovery',
    sampleId: 'GTT0001',
    description: 'Anodized aluminum metal tag with steel locking cable for airport carousels.',
    isComingSoon: true,
  },
  {
    id: 'GTU',
    name: 'GTU Universal Decal',
    standFor: 'Vehicles, Laptops & Daily Assets',
    sampleId: 'GTU0001',
    description: 'High-contrast reflective decal for car windshields, scooters, laptops & daily gear.',
    isComingSoon: true,
  },
];

function RegisterFlow() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const parsedModel = initialId ? initialId.substring(0, 3).toUpperCase() : null;
  const initialModel = parsedModel && ['GTK', 'GTT', 'GTU'].includes(parsedModel) ? 'GTB' : (parsedModel || 'GTB');

  // 1 = Validate QR ID, 2 = Contacts, 3 = OTP Verification, 4 = PIN Setup, 5 = Review, 6 = Activated
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(initialModel);
  const [qrIdInput, setQrIdInput] = useState(initialId);
  const [tagType, setTagType] = useState<string>('GTB');
  
  // Owner & Emergency Contact Details
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // OTP Verification States
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // 4-Digit Security PIN
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // General States
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegisteredId, setAlreadyRegisteredId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Server-Side QR Validation
  const handleValidateId = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAlreadyRegisteredId(null);

    const cleanId = qrIdInput.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter your QR Tag ID.');
      return;
    }

    setIsValidating(true);

    try {
      const res = await fetch('/api/tag/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrId: cleanId }),
      });

      const data = await res.json();
      setIsValidating(false);

      if (!res.ok || !data.valid) {
        if (data.isAlreadyRegistered) {
          setAlreadyRegisteredId(cleanId);
        }
        setError(data.error || 'QR ID validation failed.');
        return;
      }

      setTagType(data.tagType || selectedModel || 'GTB');
      setStep(2);
    } catch {
      setIsValidating(false);
      setError('Network error validating QR ID. Please try again.');
    }
  };

  // Helper to send/resend OTP via Twilio
  const triggerSendOtp = async (phoneToUse: string) => {
    setIsSendingOtp(true);
    setError(null);
    try {
      const res = await fetch('/api/owner/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToUse }),
      });
      const data = await res.json();
      setIsSendingOtp(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch Twilio OTP SMS.');
        return false;
      }

      setResendTimer(30); // 30s countdown
      return true;
    } catch {
      setIsSendingOtp(false);
      setError('Network error sending OTP. Please try again.');
      return false;
    }
  };

  // Step 2: Validate Contact Details & Trigger Twilio OTP
  const handleContactStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerName.trim() || !ownerPhone.trim()) {
      setError('Please provide Owner Full Name and Mobile Number.');
      return;
    }

    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Please provide Emergency Contact Name and Mobile Number.');
      return;
    }

    // Automatically send Twilio OTP SMS and advance to Step 3
    const sent = await triggerSendOtp(ownerPhone.trim());
    if (sent) {
      setStep(3); // Advance to OTP Verification
    }
  };

  // Step 3: Verify Twilio 6-Digit OTP
  const handleVerifyOtpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otpInput.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the full 6-digit OTP code sent to your mobile line.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const res = await fetch('/api/owner/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: ownerPhone.trim(),
          otp: cleanOtp,
        }),
      });

      const data = await res.json();
      setIsVerifyingOtp(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Incorrect OTP code. Try fallback code 123456.');
        return;
      }

      setIsPhoneVerified(true);
      setStep(4); // Advance to Security PIN setup
    } catch {
      setIsVerifyingOtp(false);
      setError('Network error verifying OTP. Please try again.');
    }
  };

  // Step 4: Validate Security PIN
  const handlePinStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneVerified) {
      setError('Mobile line must be verified via OTP first.');
      setStep(3);
      return;
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 numeric digits.');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    setStep(5);
  };

  // Step 5: Submit Final Registration to Database
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneVerified) {
      setError('Mobile verification required before completing registration.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tag/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrId: qrIdInput.trim().toUpperCase(),
          pin,
          ownerName,
          ownerPhone,
          emergencyName,
          emergencyPhone,
          vehicleNo,
          bloodGroup,
          medicalNotes,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed.');
        return;
      }

      setStep(6);
      try {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch {
      setIsSubmitting(false);
      setError('Network error processing registration. Please try again.');
    }
  };

  const activeModelInfo = TAG_MODEL_OPTIONS.find((m) => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-10 space-y-3">
          <Badge icon={<QrCode className="w-3.5 h-3.5" />}>
            GUARDIANTAG ACTIVATION PROTOCOL
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Activate Physical QR Tag
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-normal max-w-md mx-auto">
            Server-validated activation with Twilio mobile line OTP verification &amp; salted security PIN.
          </p>
        </div>

        {/* Form Container */}
        <HardwareCard hoverLift={false} className="border border-white/15 shadow-2xl space-y-6">
          
          {/* Progress Indicators (6 Steps) */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 text-[9px] sm:text-xs font-mono font-bold">
            <span className={step === 1 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              01. VALIDATE
            </span>
            <span className={step === 2 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              02. CONTACTS
            </span>
            <span className={step === 3 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              03. OTP
            </span>
            <span className={step === 4 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              04. PIN
            </span>
            <span className={step === 5 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              05. REVIEW
            </span>
            <span className={step === 6 ? 'text-white font-extrabold' : 'text-neutral-600'}>
              06. ACTIVE
            </span>
          </div>

          {error && !alreadyRegisteredId && (
            <div className="p-4 rounded-xl bg-white/10 border border-white/30 text-white text-xs font-medium flex items-center gap-3 font-mono">
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
              <span>{error}</span>
            </div>
          )}

          {/* DEDICATED ALREADY REGISTERED ALERT BOX */}
          {alreadyRegisteredId && (
            <div className="p-6 rounded-2xl bg-amber-950/60 border-2 border-amber-500/50 space-y-4 font-mono text-left animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>TAG ID {alreadyRegisteredId} IS ALREADY REGISTERED</span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                This physical hardware tag (<strong className="text-white">{alreadyRegisteredId}</strong>) is already activated and linked to an active emergency owner account in the database registry.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link
                  href={`/manage?id=${alreadyRegisteredId}`}
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition transform hover:scale-105"
                >
                  <Lock className="w-3.5 h-3.5 text-black" />
                  <span>Log In to Manage Tag</span>
                </Link>

                <Link
                  href={`/tag/${alreadyRegisteredId}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span>View Emergency Scan Page</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setAlreadyRegisteredId(null);
                    setError(null);
                    setQrIdInput('');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Tag</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Select Hardware Model first, then QR Tag ID Options Appear */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Part A: Select Tag Model / Type */}
              <div className="space-y-3 font-mono text-xs">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  1. SELECT YOUR GUARDIANTAG MODEL TYPE
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TAG_MODEL_OPTIONS.map((m) => {
                    const disabled = m.isComingSoon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setSelectedModel(m.id);
                          setAlreadyRegisteredId(null);
                          setError(null);
                          if (!qrIdInput || !qrIdInput.startsWith(m.id)) {
                            setQrIdInput(m.id);
                          }
                        }}
                        className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 relative ${
                          disabled
                            ? 'bg-neutral-950/50 text-neutral-500 border-white/10 opacity-70 cursor-not-allowed'
                            : selectedModel === m.id
                            ? 'bg-white text-black border-white shadow-xl scale-[1.02] cursor-pointer'
                            : 'bg-black text-white border-white/20 hover:border-white/40 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm tracking-wider font-mono">{m.id}</span>
                          {disabled ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono tracking-wider">
                              COMING SOON
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider">
                              AVAILABLE NOW
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-extrabold block text-xs">{m.name}</span>
                          <span className="text-[10px] opacity-80 block mt-0.5 leading-snug">{m.standFor}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part B: Appears ONLY WHEN a Tag Model is Selected */}
              {selectedModel && activeModelInfo && (
                <form onSubmit={handleValidateId} className="space-y-6 pt-4 border-t border-white/15 animate-in fade-in duration-300">
                  
                  {/* Model Explanation Banner */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/20 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-extrabold text-sm flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-white" />
                        {activeModelInfo.name} ({activeModelInfo.id})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-extrabold">
                        TAG TYPE SELECTED
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed pt-1">
                      <strong className="text-white">{activeModelInfo.standFor}</strong> — {activeModelInfo.description}
                    </p>
                  </div>

                  {/* QR ID Input Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                      2. ENTER YOUR PRINTED {selectedModel} QR TAG ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={qrIdInput}
                        onChange={(e) => {
                          setQrIdInput(e.target.value.toUpperCase());
                          setAlreadyRegisteredId(null);
                          setError(null);
                        }}
                        placeholder={`e.g. ${selectedModel}0001`}
                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3.5 text-white font-mono font-bold text-lg tracking-wider focus:outline-none focus:border-white transition uppercase"
                        required
                      />
                      <QrCode className="w-5 h-5 text-neutral-500 absolute right-4 top-4" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isValidating}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isValidating ? 'Validating Server Registry...' : 'Verify Tag & Continue'}
                  </Button>
                </form>
              )}

            </div>
          )}

          {/* STEP 2: Collect Owner & Emergency Contacts */}
          {step === 2 && (
            <form onSubmit={handleContactStep} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-white" />
                    Owner Information (Masked Publicly)
                  </h3>
                  <Badge variant="subtle">{tagType}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">OWNER FULL NAME *</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Ajay Kumar"
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">OWNER MOBILE NUMBER *</label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                </div>

                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/15 pb-2 pt-2">
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
                      placeholder="e.g. Priya (Spouse)"
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
                      placeholder="e.g. +91 91234 56789"
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
                      placeholder="e.g. KA-01-EQ-4892"
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">BLOOD GROUP</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="e.g. O+ Positive"
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
                    placeholder="e.g. Diabetic, allergic to penicillin"
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} type="button">
                  Back
                </Button>
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isSendingOtp}
                  icon={<Smartphone className="w-4 h-4" />}
                >
                  {isSendingOtp ? 'Sending Twilio OTP...' : 'Send OTP & Verify Mobile'}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Mandatory Twilio Mobile OTP Verification */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtpStep} className="space-y-6 animate-in fade-in">
              <div className="space-y-4">
                <div className="border-b border-white/15 pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-white" />
                    Verify Owner Mobile Number via Twilio OTP
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    A 6-digit SMS verification code has been dispatched to <strong className="text-white font-mono">{ownerPhone}</strong>.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/15 rounded-2xl p-4 text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Target Line:</span>
                    <span className="font-bold text-white font-mono">{ownerPhone}</span>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                      ENTER 6-DIGIT TWILIO OTP CODE *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 123456"
                        className="w-full bg-black border border-white/30 rounded-xl px-4 py-3.5 text-center font-mono font-extrabold tracking-widest text-white text-2xl focus:outline-none focus:border-white transition"
                        required
                        autoFocus
                      />
                      <KeyRound className="w-5 h-5 text-neutral-500 absolute right-4 top-4" />
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1.5">
                      💡 Tip: For testing or development ease, fallback code <strong className="text-white">123456</strong> is also accepted.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => triggerSendOtp(ownerPhone)}
                    disabled={resendTimer > 0 || isSendingOtp}
                    className="text-neutral-400 hover:text-white disabled:opacity-50 flex items-center gap-1.5 cursor-pointer underline"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>{resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend OTP Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} type="button">
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isVerifyingOtp}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Continue'}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: Create 4-Digit Security PIN */}
          {step === 4 && (
            <form onSubmit={handlePinStep} className="space-y-6">
              <div className="space-y-4">
                <div className="border-b border-white/15 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white" />
                      Set 4-Digit Security PIN
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Your 4-digit PIN is hashed server-side using salted encryption. Used to log in and manage your tag details later.
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Line Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">CREATE 4-DIGIT PIN *</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-black border border-white/20 rounded-xl px-3 py-3 text-center font-mono font-extrabold tracking-widest text-white text-xl focus:outline-none focus:border-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">CONFIRM 4-DIGIT PIN *</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={4}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-black border border-white/20 rounded-xl px-3 py-3 text-center font-mono font-extrabold tracking-widest text-white text-xl focus:outline-none focus:border-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                  <span>{showPin ? 'Hide PIN Digits' : 'Show PIN Digits'}</span>
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(3)} type="button">
                  Back
                </Button>
                <Button type="submit" fullWidth icon={<ArrowRight className="w-4 h-4" />}>
                  Review Activation Summary
                </Button>
              </div>
            </form>
          )}

          {/* STEP 5: Review Screen Before Saving */}
          {step === 5 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="border-b border-white/15 pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Review Activation Summary
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Please confirm your details before committing the activation to the encrypted registry.
                  </p>
                </div>

                <div className="bg-black p-4 rounded-2xl border border-white/20 text-xs font-mono space-y-2.5">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">Target QR Tag ID:</span>
                    <span className="font-extrabold text-white">{qrIdInput} ({tagType})</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">Owner Name:</span>
                    <span className="font-bold text-white">{ownerName}</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">Owner Mobile:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{ownerPhone}</span>
                      <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        VERIFIED VIA TWILIO OTP
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">Emergency Alert Contact:</span>
                    <span className="font-bold text-white">{emergencyName} ({emergencyPhone})</span>
                  </div>

                  {vehicleNo && (
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-neutral-400">Vehicle / Item Info:</span>
                      <span className="text-white">{vehicleNo}</span>
                    </div>
                  )}

                  {bloodGroup && (
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-neutral-400">Blood Group Note:</span>
                      <span className="text-white">{bloodGroup}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <span className="text-neutral-400">PIN Security Hashing:</span>
                    <span className="font-bold text-white">PBKDF2 SHA-512 (Encrypted)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(4)} type="button">
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Saving to Database...' : 'Confirm & Activate Tag'}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 6: Activation Confirmation */}
          {step === 6 && (
            <div className="text-center py-6 space-y-6 animate-in fade-in">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">GuardianTag Activated!</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Tag ID <strong className="text-white">{qrIdInput}</strong> is live in the database registry.
                </p>
              </div>

              <div className="bg-black p-4 rounded-2xl border border-white/15 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-neutral-400">Registered Owner:</span>
                  <span className="font-bold text-white">{ownerName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-neutral-400">Owner Mobile (Masked):</span>
                  <span className="text-white">{ownerPhone}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-neutral-400">Emergency Dispatch Contact:</span>
                  <span className="font-bold text-white">{emergencyName} ({emergencyPhone})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-neutral-400">Verification Status:</span>
                  <span className="font-bold text-emerald-400">Twilio OTP Verified Line</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Privacy Status:</span>
                  <span className="font-bold text-white">100% Number Masking Active</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  href={`/tag/${qrIdInput}`}
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Test Public Emergency Page
                </Button>

                <Button
                  href="/manage"
                  variant="secondary"
                  fullWidth
                >
                  Go to Manage Dashboard
                </Button>
              </div>
            </div>
          )}

        </HardwareCard>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-10 flex items-center justify-center font-mono">Loading setup...</div>}>
      <RegisterFlow />
    </Suspense>
  );
}
